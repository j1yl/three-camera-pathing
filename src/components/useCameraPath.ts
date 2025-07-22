import { useContext } from "react";
import { CameraPathContext } from "./CameraPathContextDef";

export const useCameraPath = () => {
  const ctx = useContext(CameraPathContext);
  if (!ctx)
    throw new Error("useCameraPath must be used within CameraPathProvider");
  return ctx;
};
