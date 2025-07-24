import { useCameraPath } from "./useCameraPath";
import { CameraPathLine } from "./CameraPathLine";
import { Environment, OrbitControls, Grid } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { PhysicsPicturePlane } from "./PhysicsPicturePlane";

interface Scene3DProps {
  onPictureClick: () => void;
  showOrbitControls: boolean;
}

export const Scene3D = ({
  onPictureClick,
  showOrbitControls,
}: Scene3DProps) => {
  const { debug } = useCameraPath();

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 10, 7]} intensity={1.2} castShadow />
      <Environment preset="sunset" />
      {debug && <CameraPathLine />}
      {(debug || showOrbitControls) && (
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxDistance={50}
          minDistance={2}
        />
      )}
      <pointLight position={[2, 2, 2]} intensity={25} color="#ff00ff" />

      <Grid
        args={[20, 20]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#ffffff"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#ffffff"
        fadeDistance={30}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid={true}
        position={[0, 0, 0]}
      />

      <PhysicsPicturePlane
        onPictureClick={onPictureClick}
        imageUrl="/src/assets/images/sample-image.jpg"
        position={[0, 0, 0]}
        size={[1, 1]}
      />
      <EffectComposer>
        <Bloom
          intensity={0.1}
          luminanceThreshold={0.6}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
};
