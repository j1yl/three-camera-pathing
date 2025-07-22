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
        <DebugMenu />
        <CameraKeyframeEditor />

        {/* Modal rendered outside Canvas */}
        <InteractiveModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onCenterModel={handleCenterModel}
        />
      </div>
    </CameraPathProvider>
  );
}
