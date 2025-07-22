import type { EasingType } from "./CameraPathContextDef";

// Easing functions for smooth camera movement
export const easingFunctions = {
  linear: (t: number): number => t,

  easeInOut: (t: number): number => {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  },

  easeIn: (t: number): number => {
    return t * t;
  },

  easeOut: (t: number): number => {
    return t * (2 - t);
  },

  smoothstep: (t: number): number => {
    return t * t * (3 - 2 * t);
  },

  bounce: (t: number): number => {
    if (t < 1 / 2.75) {
      return 7.5625 * t * t;
    } else if (t < 2 / 2.75) {
      return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
    } else if (t < 2.5 / 2.75) {
      return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
    } else {
      return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
    }
  },
};

export const applyEasing = (t: number, easingType: EasingType): number => {
  return easingFunctions[easingType](t);
};

// Smooth interpolation between two values
export const lerp = (a: number, b: number, t: number): number => {
  return a + (b - a) * t;
};

// Smooth interpolation between two 3D vectors
export const lerpVector3 = (
  a: [number, number, number],
  b: [number, number, number],
  t: number
): [number, number, number] => {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
};

// Smooth interpolation between two keyframes
export const interpolateKeyframes = (
  keyframeA: {
    position: [number, number, number];
    target: [number, number, number];
    fov?: number;
  },
  keyframeB: {
    position: [number, number, number];
    target: [number, number, number];
    fov?: number;
  },
  t: number,
  easingType: EasingType = "easeInOut"
): {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
} => {
  const easedT = applyEasing(t, easingType);

  return {
    position: lerpVector3(keyframeA.position, keyframeB.position, easedT),
    target: lerpVector3(keyframeA.target, keyframeB.target, easedT),
    fov: lerp(keyframeA.fov || 75, keyframeB.fov || 75, easedT),
  };
};
