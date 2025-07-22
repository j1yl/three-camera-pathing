import { useThree, useFrame } from "@react-three/fiber";
import { useCameraPath } from "./useCameraPath";
import * as THREE from "three";

export const DebugCameraUpdater = () => {
  const { camera } = useThree();
  const { setDebugCameraInfo } = useCameraPath();
  useFrame(() => {
    setDebugCameraInfo({
      lookAt: camera.getWorldDirection(new THREE.Vector3()),
      up: camera.up.clone(),
      fov: "fov" in camera ? (camera as { fov: number }).fov : undefined,
    });
  });
  return null;
};
