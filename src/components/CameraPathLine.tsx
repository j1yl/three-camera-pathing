import { useCameraPath } from "./useCameraPath";

export const CameraPathLine = () => {
  const { path, targetPath } = useCameraPath();
  const positionPoints = path.getPoints(100);
  const targetPoints = targetPath.getPoints(100);

  const positionArray = new Float32Array(
    positionPoints.flatMap((p) => [p.x, p.y, p.z])
  );
  const targetArray = new Float32Array(
    targetPoints.flatMap((p) => [p.x, p.y, p.z])
  );

  return (
    <>
      {/* Camera position path */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={positionArray}
            itemSize={3}
            args={[positionArray, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="hotpink" linewidth={2} />
      </line>

      {/* Camera target path */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={targetArray}
            itemSize={3}
            args={[targetArray, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="cyan" linewidth={2} />
      </line>

      {/* Connection lines between position and target at key points */}
      {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
        const pos = path.getPoint(t);
        const target = targetPath.getPoint(t);
        const connectionArray = new Float32Array([
          pos.x,
          pos.y,
          pos.z,
          target.x,
          target.y,
          target.z,
        ]);

        return (
          <line key={i}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                array={connectionArray}
                itemSize={3}
                args={[connectionArray, 3]}
              />
            </bufferGeometry>
            <lineBasicMaterial color="yellow" linewidth={1} />
          </line>
        );
      })}
    </>
  );
};
