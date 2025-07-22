import React, { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { CameraPathContext } from "./CameraPathContextDef.ts";
import type {
  DebugCameraInfo,
  CameraKeyframe,
  EasingType,
} from "./CameraPathContextDef.ts";

// Default camera keyframes - you can easily modify these
const DEFAULT_KEYFRAMES: CameraKeyframe[] = [
  {
    position: [0, 2, 2],
    target: [0, 0, -0.5],
    up: [0, 1, 0],
    fov: 70,
    easing: "easeInOut",
    duration: 1,
  },
  {
    position: [2, 2, 2],
    target: [0, 0, -0.5],
    up: [0, 1, 0],
    fov: 40,
    easing: "easeInOut",
    duration: 1,
  },
];

export const CameraPathProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [scroll, setScroll] = useState(0);
  const [cameraPos, setCameraPos] = useState<[number, number, number]>([
    0, 10, 0,
  ]);
  const [cameraTarget, setCameraTarget] = useState<[number, number, number]>([
    0, 0, 10,
  ]);
  const [debug, setDebug] = useState(false);
  const [debugCameraInfo, setDebugCameraInfo] =
    useState<DebugCameraInfo | null>(null);
  const [keyframes, setKeyframes] =
    useState<CameraKeyframe[]>(DEFAULT_KEYFRAMES);
  const [easingType, setEasingType] = useState<EasingType>("easeInOut");
  const [interpolationSpeed, setInterpolationSpeed] = useState(0.8);

  const boardLength = 50;
  const cameraHeight = 10;

  // Create paths from keyframes
  const path = useRef(
    new THREE.CatmullRomCurve3(
      keyframes.map((kf) => new THREE.Vector3(...kf.position))
    )
  );

  const targetPath = useRef(
    new THREE.CatmullRomCurve3(
      keyframes.map((kf) => new THREE.Vector3(...kf.target))
    )
  );

  // Update paths when keyframes change
  useEffect(() => {
    path.current = new THREE.CatmullRomCurve3(
      keyframes.map((kf) => new THREE.Vector3(...kf.position))
    );
    targetPath.current = new THREE.CatmullRomCurve3(
      keyframes.map((kf) => new THREE.Vector3(...kf.target))
    );
  }, [keyframes]);

  // Debug toggle with 'D'
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "d" || e.key === "D") setDebug((v) => !v);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <CameraPathContext.Provider
      value={{
        scroll,
        setScroll,
        cameraPos,
        setCameraPos,
        cameraTarget,
        setCameraTarget,
        debug,
        setDebug,
        path: path.current,
        targetPath: targetPath.current,
        debugCameraInfo,
        setDebugCameraInfo,
        boardLength,
        cameraHeight,
        keyframes,
        setKeyframes,
        easingType,
        setEasingType,
        interpolationSpeed,
        setInterpolationSpeed,
      }}
    >
      {children}
    </CameraPathContext.Provider>
  );
};
