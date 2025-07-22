import { useCameraPath } from "./useCameraPath";
import type { ObjectType } from "./types";

const OBJECTS: ObjectType[] = [
  { id: 1, type: "box", position: [0, 0, 0] },
  { id: 2, type: "sphere", position: [3, 0, -2] },
  { id: 3, type: "cone", position: [-3, 0, 2] },
];

export const DebugMenu = () => {
  const {
    cameraPos,
    cameraTarget,
    scroll,
    debugCameraInfo,
    keyframes,
    easingType,
    interpolationSpeed,
  } = useCameraPath();

  return (
    <div
      style={{
        position: "fixed",
        top: 10,
        right: 10,
        background: "rgba(30,30,30,0.85)",
        color: "#fff",
        fontSize: 12,
        padding: "8px 14px",
        borderRadius: 8,
        zIndex: 100,
        fontFamily: "monospace",
        maxWidth: 400,
        maxHeight: "80vh",
        overflowY: "auto",
      }}
    >
      <div style={{ fontWeight: "bold", marginBottom: 8 }}>Camera Control</div>
      <div>Position: {cameraPos.map((n) => n.toFixed(2)).join(", ")}</div>
      <div>Target: {cameraTarget.map((n) => n.toFixed(2)).join(", ")}</div>
      <div>Scroll: {scroll.toFixed(4)}</div>

      <div style={{ marginTop: 8, fontWeight: "bold" }}>Interpolation:</div>
      <div>Easing: {easingType}</div>
      <div>Speed: {interpolationSpeed.toFixed(2)}</div>

      {debugCameraInfo && (
        <>
          <div style={{ marginTop: 8, fontWeight: "bold" }}>Camera Info:</div>
          <div>
            LookAt: [{debugCameraInfo.lookAt.x.toFixed(2)},{" "}
            {debugCameraInfo.lookAt.y.toFixed(2)},{" "}
            {debugCameraInfo.lookAt.z.toFixed(2)}]
          </div>
          <div>
            Up: [{debugCameraInfo.up.x.toFixed(2)},{" "}
            {debugCameraInfo.up.y.toFixed(2)}, {debugCameraInfo.up.z.toFixed(2)}
            ]
          </div>
          {debugCameraInfo.fov !== undefined && (
            <div>FOV: {debugCameraInfo.fov.toFixed(2)}</div>
          )}
        </>
      )}

      <div style={{ marginTop: 8, fontWeight: "bold" }}>
        Keyframes ({keyframes.length}):
      </div>
      {keyframes.map((kf, i) => (
        <div key={i} style={{ marginLeft: 8, fontSize: 11 }}>
          <div>
            K{i}: pos[{kf.position.map((n) => n.toFixed(1)).join(", ")}] →
            target[{kf.target.map((n) => n.toFixed(1)).join(", ")}]
          </div>
          <div style={{ marginLeft: 8, fontSize: 10, opacity: 0.8 }}>
            easing: {kf.easing || "easeInOut"}, duration: {kf.duration || 2}s
          </div>
        </div>
      ))}

      <div style={{ marginTop: 8, fontWeight: "bold" }}>Objects:</div>
      {OBJECTS.map((obj) => (
        <div key={obj.id}>
          {obj.type}: [{obj.position.map((n) => n.toFixed(2)).join(", ")}]
        </div>
      ))}

      <div style={{ marginTop: 8, fontSize: 10, opacity: 0.7 }}>
        Press 'D' to toggle debug mode
      </div>
    </div>
  );
};
