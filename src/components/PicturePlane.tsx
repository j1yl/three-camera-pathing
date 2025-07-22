import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { gsap } from "gsap";
import { useTexture } from "@react-three/drei";

interface PicturePlaneProps {
  onPictureClick: () => void;
  imageUrl?: string;
  position?: [number, number, number];
  size?: [number, number];
}

export const PicturePlane = ({
  onPictureClick,
  imageUrl = "/src/assets/images/sample-image.jpg",
  position = [0, 0.1, 0], // Slightly above grid
  size = [2, 1.5], // 4:3 aspect ratio (2 width, 1.5 height)
}: PicturePlaneProps) => {
  const planeRef = useRef<THREE.Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Load the texture with fallback
  const texture = useTexture(imageUrl);
  texture.colorSpace = THREE.SRGBColorSpace;

  useFrame(() => {
    if (planeRef.current && !isAnimating) {
      // Gentle floating animation when not hovered
      const time = Date.now() * 0.001;
      const floatOffset = Math.sin(time * 2) * 0.02;
      planeRef.current.position.y = position[1] + floatOffset;
    }
  });

  const handlePointerOver = () => {
    if (isAnimating) return;

    setIsHovered(true);
    if (planeRef.current) {
      setIsAnimating(true);

      // Lift animation
      gsap.to(planeRef.current.position, {
        y: position[1] + 0.3,
        duration: 0.4,
        ease: "power2.out",
      });

      // Scale up slightly
      gsap.to(planeRef.current.scale, {
        x: 1.05,
        y: 1.05,
        z: 1.05,
        duration: 0.4,
        ease: "power2.out",
      });

      // Add glow effect
      gsap.to(planeRef.current.material, {
        emissiveIntensity: 0.3,
        duration: 0.4,
        ease: "power2.out",
      });

      setIsAnimating(false);
    }
  };

  const handlePointerOut = () => {
    if (isAnimating) return;

    setIsHovered(false);
    if (planeRef.current) {
      setIsAnimating(true);

      // Return to original position
      gsap.to(planeRef.current.position, {
        y: position[1],
        duration: 0.4,
        ease: "power2.out",
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
      gsap.to(planeRef.current.material, {
        emissiveIntensity: 0,
        duration: 0.4,
        ease: "power2.out",
      });

      setIsAnimating(false);
    }
  };

  const handleClick = () => {
    if (isAnimating) return;

    if (planeRef.current) {
      setIsAnimating(true);

      // Click animation - scale down then up
      gsap.to(planeRef.current.scale, {
        x: 0.9,
        y: 0.9,
        z: 0.9,
        duration: 0.1,
        ease: "power2.in",
        onComplete: () => {
          gsap.to(planeRef.current!.scale, {
            x: 1.05,
            y: 1.05,
            z: 1.05,
            duration: 0.3,
            ease: "elastic.out(1, 0.5)",
            onComplete: () => {
              setIsAnimating(false);
            },
          });
        },
      });
    }

    onPictureClick();
  };

  return (
    <mesh
      ref={planeRef}
      position={position}
      rotation={[-Math.PI / 2, 0, 0]} // Lay flat on grid
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
