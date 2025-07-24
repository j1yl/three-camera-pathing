import { useCameraPath } from "./useCameraPath";
import type { CameraKeyframe, EasingType } from "./CameraPathContextDef";
import { useState, useEffect } from "react";

const EASING_OPTIONS: EasingType[] = [
  "linear",
  "easeInOut",
  "easeIn",
  "easeOut",
  "smoothstep",
  "bounce",
];

export const CameraKeyframeEditor = () => {
  const {
    keyframes,
    setKeyframes,
    debug,
    easingType,
    setEasingType,
    interpolationSpeed,
    setInterpolationSpeed,
  } = useCameraPath();

  const [openPanels, setOpenPanels] = useState(keyframes.map(() => false));

  useEffect(() => {
    setOpenPanels(keyframes.map(() => false));
  }, [keyframes]);

  if (!debug) return null;

  const updateKeyframe = (
    index: number,
    field: keyof CameraKeyframe,
    value: number | [number, number, number] | EasingType
  ) => {
    const newKeyframes = [...keyframes];
    newKeyframes[index] = { ...newKeyframes[index], [field]: value };
    setKeyframes(newKeyframes);
  };

  const addKeyframe = () => {
    const lastKeyframe = keyframes[keyframes.length - 1];
    const newKeyframe: CameraKeyframe = {
      position: [...lastKeyframe.position] as [number, number, number],
      target: [...lastKeyframe.target] as [number, number, number],
      up: lastKeyframe.up
        ? ([...lastKeyframe.up] as [number, number, number])
        : [0, 1, 0],
      fov: lastKeyframe.fov || 75,
      easing: lastKeyframe.easing || "easeInOut",
      duration: lastKeyframe.duration || 2,
    };
    setKeyframes([...keyframes, newKeyframe]);
  };

  const removeKeyframe = (index: number) => {
    if (keyframes.length > 2) {
      const newKeyframes = keyframes.filter((_, i) => i !== index);
      setKeyframes(newKeyframes);
    }
  };

  const togglePanel = (idx: number) => {
    setOpenPanels((prev) => prev.map((open, i) => (i === idx ? !open : open)));
  };

  return (
    <div className="fixed top-2 left-2 z-50 bg-white text-black p-4 max-w-sm w-full max-h-[50vh] overflow-y-auto text-xs">
      <div className="mb-4">
        <div className="font-semibold">Global Settings</div>
        <div className="mb-2">
          <label className="block text-xs mb-1 font-medium">Easing Type</label>
          <select
            value={easingType}
            onChange={(e) => setEasingType(e.target.value as EasingType)}
            className="w-full p-1 border border-gray-300 bg-white text-xs"
          >
            {EASING_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs mb-1 font-medium">
            Interpolation Speed:
            <span className="font-mono">{interpolationSpeed.toFixed(2)}</span>
          </label>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            value={interpolationSpeed}
            onChange={(e) => setInterpolationSpeed(parseFloat(e.target.value))}
            className="w-full h-1 bg-gray-200 appearance-none cursor-pointer"
          />
        </div>
      </div>
      {/* Keyframes List */}
      <div className="space-y-3">
        {keyframes.map((kf, index) => (
          <div key={index} className="bg-gray-50 border border-gray-300 p-2">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => togglePanel(index)}
            >
              <span>Keyframe {index}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeKeyframe(index);
                }}
                className="ml-2 px-2 py-1 bg-red-500 text-white  text-xs hover:bg-red-600"
                disabled={keyframes.length <= 2}
                title={
                  keyframes.length <= 2
                    ? "At least 2 keyframes required"
                    : "Remove keyframe"
                }
              >
                Remove
              </button>
            </div>
            <div className={openPanels[index] ? "block mt-2" : "hidden"}>
              <div className="mb-2">
                <label className="block text-xs mb-1 font-medium">
                  Position
                </label>
                <div className="flex gap-1">
                  {kf.position.map((val, i) => (
                    <input
                      key={i}
                      type="number"
                      value={val}
                      onChange={(e) => {
                        const newPos = [...kf.position] as [
                          number,
                          number,
                          number
                        ];
                        newPos[i] = parseFloat(e.target.value) || 0;
                        updateKeyframe(index, "position", newPos);
                      }}
                      className="w-16 p-1  border border-gray-300 text-xs bg-white"
                    />
                  ))}
                </div>
              </div>
              <div className="mb-2">
                <label className="block text-xs mb-1 font-medium">Target</label>
                <div className="flex gap-1">
                  {kf.target.map((val, i) => (
                    <input
                      key={i}
                      type="number"
                      value={val}
                      onChange={(e) => {
                        const newTarget = [...kf.target] as [
                          number,
                          number,
                          number
                        ];
                        newTarget[i] = parseFloat(e.target.value) || 0;
                        updateKeyframe(index, "target", newTarget);
                      }}
                      className="w-16 p-1  border border-gray-300 text-xs bg-white"
                    />
                  ))}
                </div>
              </div>
              <div className="mb-2">
                <label className="block text-xs mb-1 font-medium">FOV</label>
                <input
                  type="number"
                  value={kf.fov || 75}
                  onChange={(e) =>
                    updateKeyframe(
                      index,
                      "fov",
                      parseFloat(e.target.value) || 75
                    )
                  }
                  className="w-20 p-1  border border-gray-300 text-xs bg-white"
                />
              </div>
              <div className="mb-2">
                <label className="block text-xs mb-1 font-medium">Easing</label>
                <select
                  value={kf.easing || "easeInOut"}
                  onChange={(e) =>
                    updateKeyframe(
                      index,
                      "easing",
                      e.target.value as EasingType
                    )
                  }
                  className="w-full p-1  border border-gray-300 text-xs bg-white"
                >
                  {EASING_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-2">
                <label className="block text-xs mb-1 font-medium">
                  Duration:{" "}
                  <span className="font-mono">{kf.duration || 2}s</span>
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="5.0"
                  step="0.1"
                  value={kf.duration || 2}
                  onChange={(e) =>
                    updateKeyframe(
                      index,
                      "duration",
                      parseFloat(e.target.value)
                    )
                  }
                  className="w-full h-2 bg-gray-200 -lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={addKeyframe}
        className="mt-4 w-full py-2 bg-green-500 text-white  font-bold text-xs hover:bg-green-600 transition"
      >
        Add Keyframe
      </button>
    </div>
  );
};
