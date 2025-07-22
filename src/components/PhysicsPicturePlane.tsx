import { useState, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { gsap } from "gsap";
import { useTexture } from "@react-three/drei";
import { usePlane } from "@react-three/cannon";

interface PhysicsPicturePlaneProps {
  onPictureClick: () => void;
  imageUrl?: string;
  position?: [number, number, number];
  size?: [number, number];
}

export const PhysicsPicturePlane = ({
  onPictureClick,
  imageUrl = "/src/assets/images/sample-image.jpg",
  position = [0, 0, 0], // Slightly above grid
  size = [1, 1], // 4:3 aspect ratio (2 width, 1.5 height)
}: PhysicsPicturePlaneProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [bounceCount, setBounceCount] = useState(0);
  const originalRotation = useRef(new THREE.Euler(-Math.PI / 2, 0, 0));
  const spinDirection = useRef(1);

  // Physics plane
  const [planeRef, planeApi] = usePlane(() => ({
    mass: 0, // Static body
    position: position,
    rotation: [-Math.PI / 2, 0, 0], // Lay flat on grid
    args: size, // Width and height
    material: {
      friction: 0.7,
      restitution: 0.8, // Higher bounce
    },
  }));

  // Load the texture
  const texture = useTexture(imageUrl);
  texture.colorSpace = THREE.SRGBColorSpace;

  useFrame((state) => {
    if (planeRef.current && !isAnimating) {
      const time = state.clock.elapsedTime;

      // Gentle floating animation when not hovered
      const floatOffset = Math.sin(time * 2) * 0.02;
      planeRef.current.position.y = position[1] + floatOffset;

      // Subtle rotation when not spinning
      if (!isSpinning) {
        planeRef.current.rotation.z = Math.sin(time * 0.5) * 0.05;
      }
    }

    // Spinning animation
    if (planeRef.current && isSpinning) {
      const time = state.clock.elapsedTime;
      planeRef.current.rotation.y = time * 2 * spinDirection.current;

      // Add some wobble to the spin
      planeRef.current.rotation.x = -Math.PI / 2 + Math.sin(time * 4) * 0.1;
    }
  });

  const handlePointerOver = () => {
    if (isAnimating) return;

    setIsHovered(true);
    if (planeRef.current) {
      setIsAnimating(true);

      // Lift animation with physics-like bounce
      gsap.to(planeRef.current.position, {
        y: position[1] + 0.3,
        duration: 0.4,
        ease: "elastic.out(1, 0.3)",
      });

      // Scale up with physics-like effect
      gsap.to(planeRef.current.scale, {
        x: 1.1,
        y: 1.1,
        z: 1.1,
        duration: 0.4,
        ease: "back.out(1.7)",
      });

      // Add glow effect
      const mesh = planeRef.current as THREE.Mesh;
      const material = mesh.material as THREE.MeshStandardMaterial;
      gsap.to(material, {
        emissiveIntensity: 0.4,
        duration: 0.4,
        ease: "power2.out",
      });

      // Start gentle spin
      setIsSpinning(true);
      spinDirection.current = Math.random() > 0.5 ? 1 : -1;

      setIsAnimating(false);
    }
  };

  const handlePointerOut = () => {
    if (isAnimating) return;

    setIsHovered(false);
    if (planeRef.current) {
      setIsAnimating(true);

      // Return to original position with bounce
      gsap.to(planeRef.current.position, {
        y: position[1],
        duration: 0.6,
        ease: "bounce.out",
      });

      // Return to original scale
      gsap.to(planeRef.current.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.4,
        ease: "power2.out",
      });

      // Remove glow effect
      const mesh = planeRef.current as THREE.Mesh;
      const material = mesh.material as THREE.MeshStandardMaterial;
      gsap.to(material, {
        emissiveIntensity: 0,
        duration: 0.4,
        ease: "power2.out",
      });

      // Stop spinning and return to original rotation
      setIsSpinning(false);
      gsap.to(planeRef.current.rotation, {
        x: originalRotation.current.x,
        y: originalRotation.current.y,
        z: originalRotation.current.z,
        duration: 0.8,
        ease: "elastic.out(1, 0.5)",
      });

      setIsAnimating(false);
    }
  };

  const handleClick = () => {
    if (isAnimating) return;

    if (planeRef.current) {
      setIsAnimating(true);
      setBounceCount((prev) => prev + 1);

      // Multi-stage click animation
      const timeline = gsap.timeline({
        onComplete: () => {
          setIsAnimating(false);
        },
      });

      // Stage 1: Quick scale down
      timeline.to(planeRef.current.scale, {
        x: 0.8,
        y: 0.8,
        z: 0.8,
        duration: 0.1,
        ease: "power2.in",
      });

      // Stage 2: Bounce up with rotation
      timeline.to(
        planeRef.current.position,
        {
          y: position[1] + 0.5,
          duration: 0.3,
          ease: "power2.out",
        },
        "-=0.1"
      );

      timeline.to(
        planeRef.current.rotation,
        {
          y: planeRef.current.rotation.y + Math.PI * 2,
          duration: 0.3,
          ease: "power2.out",
        },
        "-=0.3"
      );

      // Stage 3: Scale back up with elastic effect
      timeline.to(
        planeRef.current.scale,
        {
          x: 1.2,
          y: 1.2,
          z: 1.2,
          duration: 0.4,
          ease: "elastic.out(1, 0.3)",
        },
        "-=0.2"
      );

      // Stage 4: Return to normal
      timeline.to(
        planeRef.current.position,
        {
          y: position[1],
          duration: 0.5,
          ease: "bounce.out",
        },
        "-=0.2"
      );

      timeline.to(
        planeRef.current.scale,
        {
          x: 1,
          y: 1,
          z: 1,
          duration: 0.3,
          ease: "power2.out",
        },
        "-=0.3"
      );

      // Add particle-like effect (change material properties)
      const mesh = planeRef.current as THREE.Mesh;
      const material = mesh.material as THREE.MeshStandardMaterial;

      timeline.to(
        material,
        {
          emissiveIntensity: 0.8,
          duration: 0.1,
          ease: "power2.in",
        },
        "-=0.4"
      );

      timeline.to(
        material,
        {
          emissiveIntensity: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        "-=0.3"
      );
    }

    onPictureClick();
  };

  // Add physics-based shake effect
  const shakePlane = () => {
    if (planeRef.current && !isAnimating) {
      setIsAnimating(true);

      const timeline = gsap.timeline({
        onComplete: () => setIsAnimating(false),
      });

      // Shake rotation
      for (let i = 0; i < 5; i++) {
        timeline.to(planeRef.current.rotation, {
          z: originalRotation.current.z + (Math.random() - 0.5) * 0.2,
          duration: 0.05,
          ease: "power1.inOut",
        });
      }

      // Return to original rotation
      timeline.to(planeRef.current.rotation, {
        z: originalRotation.current.z,
        duration: 0.2,
        ease: "power2.out",
      });
    }
  };

  // Auto-shake every 10 seconds
  useFrame((state) => {
    if (state.clock.elapsedTime % 10 < 0.1 && !isAnimating && !isHovered) {
      shakePlane();
    }
  });

  return (
    <mesh
      ref={planeRef}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      <planeGeometry args={size} />
      <meshStandardMaterial
        map={texture}
        emissive={isHovered ? "#ffffff" : "#000000"}
        emissiveIntensity={0}
        roughness={0.2}
        metalness={0.1}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};
