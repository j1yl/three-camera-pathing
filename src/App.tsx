import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/cannon";
import { CameraPathProvider } from "./components/CameraPathContext";
import { CameraPathController } from "./components/CameraPathController";
import { Scene3D } from "./components/Scene3D";
import { DebugMenu } from "./components/DebugMenu";
import { DebugCameraUpdater } from "./components/DebugCameraUpdater";
import { CameraKeyframeEditor } from "./components/CameraKeyframeEditor";
import { InteractiveModal } from "./components/InteractiveModal";
import { useState } from "react";

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showOrbitControls, setShowOrbitControls] = useState(false);
  const [showDebugMenu, setShowDebugMenu] = useState(true);

  const handlePictureClick = () => {
    setIsModalOpen(true);
  };

  const handleCenterModel = () => {
    setShowOrbitControls(true);
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <CameraPathProvider>
      <div style={{ width: "100vw", height: "100vh", background: "#181818" }}>
        <div className="top-0 left-1/2 -translate-x-1/2 absolute z-50 pointer-events-none text-xs uppercase bg-white text-black px-1 mt-2">
          [D] for debug mode
        </div>
        <button
          className="px-1 uppercase text-xs bg-white text-black fixed top-2 right-2 z-50"
          aria-pressed={showDebugMenu}
          aria-label={showDebugMenu ? "Hide debug menu" : "Show debug menu"}
          onClick={() => setShowDebugMenu((v) => !v)}
        >
          {showDebugMenu ? "Hide Debug Menu" : "Show Debug Menu"}
        </button>
        <Canvas
          shadows
          camera={{ position: [0, 3, 0], fov: 60, up: [0, 1, 0] }}
        >
          <Physics gravity={[0, -9.81, 0]}>
            <Scene3D
              onPictureClick={handlePictureClick}
              showOrbitControls={showOrbitControls}
            />
          </Physics>
          <CameraPathController />
          <DebugCameraUpdater />
        </Canvas>
        {showDebugMenu && <DebugMenu />}
        <CameraKeyframeEditor />
        <InteractiveModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onCenterModel={handleCenterModel}
        />
      </div>
    </CameraPathProvider>
  );
}
