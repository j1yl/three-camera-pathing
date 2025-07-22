import { useCameraPath } from "./useCameraPath";
import type { CameraKeyframe, EasingType } from "./CameraPathContextDef";

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

  return (
    <div
      style={{
        position: "fixed",
        top: 10,
        left: 10,
        background: "rgba(30,30,30,0.9)",
        color: "#fff",
        fontSize: 12,
        padding: "12px",
        borderRadius: 8,
        zIndex: 100,
        fontFamily: "monospace",
        maxWidth: 350,
        maxHeight: "80vh",
        overflowY: "auto",
      }}
    >
      <div style={{ fontWeight: "bold", marginBottom: 12 }}>
        Camera Keyframe Editor
      </div>

      {/* Global Settings */}
      <div
        style={{
          marginBottom: 16,
          padding: 8,
          border: "1px solid #666",
          borderRadius: 4,
        }}
      >
        <div style={{ fontWeight: "bold", marginBottom: 8 }}>
          Global Settings
        </div>

        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 11, marginBottom: 4 }}>Easing Type:</div>
          <select
            value={easingType}
            onChange={(e) => setEasingType(e.target.value as EasingType)}
            style={{
              width: "100%",
              padding: 4,
              fontSize: 10,
              background: "#222",
              color: "#fff",
              border: "1px solid #555",
              borderRadius: 2,
            }}
          >
            {EASING_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 11, marginBottom: 4 }}>
            Interpolation Speed: {interpolationSpeed.toFixed(2)}
          </div>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            value={interpolationSpeed}
            onChange={(e) => setInterpolationSpeed(parseFloat(e.target.value))}
            style={{
              width: "100%",
              height: 6,
              background: "#555",
              borderRadius: 3,
              outline: "none",
            }}
          />
        </div>
      </div>

      {keyframes.map((kf, index) => (
        <div
          key={index}
          style={{
            marginBottom: 16,
            padding: 8,
            border: "1px solid #444",
            borderRadius: 4,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <span style={{ fontWeight: "bold" }}>Keyframe {index}</span>
            <button
              onClick={() => removeKeyframe(index)}
              style={{
                background: "#ff4444",
                color: "white",
                border: "none",
                borderRadius: 4,
                padding: "2px 6px",
                fontSize: 10,
                cursor: "pointer",
              }}
            >
              Remove
            </button>
          </div>

          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 11, marginBottom: 4 }}>Position:</div>
            <div style={{ display: "flex", gap: 4 }}>
              {kf.position.map((val, i) => (
                <input
                  key={i}
                  type="number"
                  value={val}
                  onChange={(e) => {
                    const newPos = [...kf.position] as [number, number, number];
                    newPos[i] = parseFloat(e.target.value) || 0;
                    updateKeyframe(index, "position", newPos);
                  }}
                  style={{
                    width: 60,
                    padding: 2,
                    fontSize: 10,
                    background: "#222",
                    color: "#fff",
                    border: "1px solid #555",
                    borderRadius: 2,
                  }}
                />
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 11, marginBottom: 4 }}>Target:</div>
            <div style={{ display: "flex", gap: 4 }}>
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
                  style={{
                    width: 60,
                    padding: 2,
                    fontSize: 10,
                    background: "#222",
                    color: "#fff",
                    border: "1px solid #555",
                    borderRadius: 2,
                  }}
                />
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 11, marginBottom: 4 }}>FOV:</div>
            <input
              type="number"
              value={kf.fov || 75}
              onChange={(e) =>
                updateKeyframe(index, "fov", parseFloat(e.target.value) || 75)
              }
              style={{
                width: 60,
                padding: 2,
                fontSize: 10,
                background: "#222",
                color: "#fff",
                border: "1px solid #555",
                borderRadius: 2,
              }}
            />
          </div>

          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 11, marginBottom: 4 }}>Easing:</div>
            <select
              value={kf.easing || "easeInOut"}
              onChange={(e) =>
                updateKeyframe(index, "easing", e.target.value as EasingType)
              }
              style={{
                width: "100%",
                padding: 2,
                fontSize: 10,
                background: "#222",
                color: "#fff",
                border: "1px solid #555",
                borderRadius: 2,
              }}
            >
              {EASING_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 11, marginBottom: 4 }}>
              Duration: {kf.duration || 2}s
            </div>
            <input
              type="range"
              min="0.5"
              max="5.0"
              step="0.1"
              value={kf.duration || 2}
              onChange={(e) =>
                updateKeyframe(index, "duration", parseFloat(e.target.value))
              }
              style={{
                width: "100%",
                height: 4,
                background: "#555",
                borderRadius: 2,
                outline: "none",
              }}
            />
          </div>
        </div>
      ))}

      <button
        onClick={addKeyframe}
        style={{
          background: "#44ff44",
          color: "black",
          border: "none",
          borderRadius: 4,
          padding: "8px 12px",
          fontSize: 12,
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Add Keyframe
      </button>

      <div style={{ marginTop: 12, fontSize: 10, opacity: 0.7 }}>
        Changes apply immediately. Press 'D' to toggle debug mode.
      </div>
    </div>
  );
};
