// Shared types for 3D scene and camera pathing

export type ObjectType = {
  id: number;
  type: "box" | "sphere" | "cone";
  position: [number, number, number];
};

export interface PlaceholderProps {
  type: ObjectType["type"];
  position: [number, number, number];
  onClick: () => void;
  isFocused: boolean;
}

export interface Scene3DProps {
  focus: ObjectType | null;
  setFocus: (obj: ObjectType | null) => void;
}

export interface CameraPathControllerProps {
  focus: ObjectType | null;
}
