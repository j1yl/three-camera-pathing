import { createContext } from "react";
import * as THREE from "three";

export type EasingType =
  | "linear"
  | "easeInOut"
  | "easeIn"
  | "easeOut"
  | "smoothstep"
  | "bounce";

export interface CameraKeyframe {
  position: [number, number, number];
  target: [number, number, number];
  up?: [number, number, number];
  fov?: number;
  easing?: EasingType;
  duration?: number; // Time to reach this keyframe (in seconds)
}

export interface DebugCameraInfo {
  lookAt: THREE.Vector3;
  up: THREE.Vector3;
  fov?: number;
}

export interface CameraPathContextType {
  scroll: number;
  setScroll: (t: number) => void;
  cameraPos: [number, number, number];
  setCameraPos: (pos: [number, number, number]) => void;
  cameraTarget: [number, number, number];
  setCameraTarget: (target: [number, number, number]) => void;
  debug: boolean;
  setDebug: (v: boolean) => void;
  path: THREE.CatmullRomCurve3;
  targetPath: THREE.CatmullRomCurve3;
  debugCameraInfo: DebugCameraInfo | null;
  setDebugCameraInfo: (info: DebugCameraInfo) => void;
  boardLength: number;
  cameraHeight: number;
  keyframes: CameraKeyframe[];
  setKeyframes: (keyframes: CameraKeyframe[]) => void;
  easingType: EasingType;
  setEasingType: (easing: EasingType) => void;
  interpolationSpeed: number;
  setInterpolationSpeed: (speed: number) => void;
}

export const CameraPathContext = createContext<
  CameraPathContextType | undefined
>(undefined);
