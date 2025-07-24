import { useCameraPath } from "./useCameraPath";

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
    <div className="fixed top-12 right-2 bg-white text-black text-xs p-4 z-50 max-w-96 max-h-[40vh] overflow-y-auto shadow-lg">
      <div>Position: {cameraPos.map((n) => n.toFixed(2)).join(", ")}</div>
      <div>Target: {cameraTarget.map((n) => n.toFixed(2)).join(", ")}</div>
      <div>Scroll: {scroll.toFixed(4)}</div>
      <div className="mt-2">Easing: {easingType}</div>
      <div>Speed: {interpolationSpeed.toFixed(2)}</div>
      {debugCameraInfo && (
        <div className="mt-2">
          <div>
            LookAt: [{debugCameraInfo.lookAt.x.toFixed(2)},{" "}
            {debugCameraInfo.lookAt.y.toFixed(2)},{" "}
            {debugCameraInfo.lookAt.z.toFixed(2)}]
          </div>
          <div style={{ marginBottom: 2 }}>
            Up: [{debugCameraInfo.up.x.toFixed(2)},{" "}
            {debugCameraInfo.up.y.toFixed(2)}, {debugCameraInfo.up.z.toFixed(2)}
            ]
          </div>
          {debugCameraInfo.fov !== undefined && (
            <div>FOV: {debugCameraInfo.fov.toFixed(2)}</div>
          )}
        </div>
      )}
      <div className="mt-2">Keyframes: ({keyframes.length})</div>
      <div>
        {keyframes.map((kf, i) => (
          <div key={i}>
            <div className="text-[11px]">
              <span className="text-red-500">{i}</span>: pos[
              {kf.position.map((n) => n.toFixed(1)).join(", ")}] → target[
              {kf.target.map((n) => n.toFixed(1)).join(", ")}]
            </div>
            <div className="text-[10px] opacity-80">
              easing: {kf.easing || "easeInOut"}, duration: {kf.duration || 2}s
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
