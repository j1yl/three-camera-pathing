import { useThree, useFrame } from "@react-three/fiber";
import { useCameraPath } from "./useCameraPath";
import { useRef, useEffect } from "react";
import { interpolateKeyframes } from "./easing";
import * as THREE from "three";

export const CameraPathController = () => {
  const { camera } = useThree();
  const {
    scroll,
    setScroll,
    setCameraPos,
    setCameraTarget,
    debug,
    path,
    targetPath,
    keyframes,
    easingType,
    interpolationSpeed,
  } = useCameraPath();
  const scrollTarget = useRef(scroll);
  const mouse = useRef({ x: 0, y: 0 });

  // On mount, set camera to start of path
  useEffect(() => {
    if (!debug) {
      const t = scroll;
      const cameraPos = path.getPoint(t);
      const targetPos = targetPath.getPoint(t);

      camera.position.copy(cameraPos);
      camera.up.set(0, 1, 0);
      camera.lookAt(targetPos);

      setCameraPos([camera.position.x, camera.position.y, camera.position.z]);
      setCameraTarget([targetPos.x, targetPos.y, targetPos.z]);
    }
    // eslint-disable-next-line
  }, []);

  // Reset scrollTarget when debug mode toggles
  useEffect(() => {
    scrollTarget.current = scroll;
  }, [debug, scroll]);

  // Mouse move for perspective effect (disabled in debug)
  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!debug) {
        mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
      }
    }
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [debug]);

  // Scroll camera along the path (0 to 1)
  useEffect(() => {
    function onWheel(e: WheelEvent) {
      if (!debug) {
        scrollTarget.current = Math.max(
          0,
          Math.min(1, scrollTarget.current + e.deltaY * 0.0001)
        );
      }
    }
    window.addEventListener("wheel", onWheel);
    return () => window.removeEventListener("wheel", onWheel);
  }, [debug]);

  useFrame(() => {
    if (!debug) {
      // Interpolate scroll toward scrollTarget with easing
      const newScroll =
        scroll + (scrollTarget.current - scroll) * interpolationSpeed;
      setScroll(newScroll);

      // Use keyframe interpolation for smoother movement
      if (keyframes.length >= 2) {
        const totalKeyframes = keyframes.length - 1;
        const keyframeIndex = newScroll * totalKeyframes;
        const currentIndex = Math.floor(keyframeIndex);
        const nextIndex = Math.min(currentIndex + 1, totalKeyframes);
        const segmentT = keyframeIndex - currentIndex;

        const currentKeyframe = keyframes[currentIndex];
        const nextKeyframe = keyframes[nextIndex];

        if (currentKeyframe && nextKeyframe) {
          const interpolated = interpolateKeyframes(
            currentKeyframe,
            nextKeyframe,
            segmentT,
            easingType
          );

          camera.position.set(...interpolated.position);
          camera.up.set(0, 1, 0);
          camera.lookAt(new THREE.Vector3(...interpolated.target));

          // Update FOV if available
          if (interpolated.fov && "fov" in camera) {
            (camera as { fov: number }).fov = interpolated.fov;
            camera.updateProjectionMatrix();
          }

          setCameraPos([
            camera.position.x,
            camera.position.y,
            camera.position.z,
          ]);
          setCameraTarget([...interpolated.target]);
        }
      } else {
        // Fallback to path-based movement
        const t = newScroll;
        const cameraPos = path.getPoint(t);
        const targetPos = targetPath.getPoint(t);

        camera.position.copy(cameraPos);
        camera.up.set(0, 1, 0);
        camera.lookAt(targetPos);

        setCameraPos([camera.position.x, camera.position.y, camera.position.z]);
        setCameraTarget([targetPos.x, targetPos.y, targetPos.z]);
      }
    }
  });

  return null;
};
