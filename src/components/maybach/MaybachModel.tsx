import { useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { Color } from "three";
import type { Material, Mesh, MeshStandardMaterial, Object3D } from "three";

type Props = {
  bodyColor: string;
  accentColor: string;
};

const BODY_HINTS = ["body", "paint", "carpaint", "exterior", "bonnet", "hood", "door", "fender", "panel"];
const ACCENT_HINTS = ["chrome", "trim", "rim", "wheel", "detail", "grill", "logo", "metal", "line"];
const MAYBACH_GLB_URL = `${import.meta.env.BASE_URL}models/maybach.glb`;

function isMesh(obj: Object3D): obj is Mesh {
  return (obj as Mesh).isMesh === true;
}

function hasHint(name: string, hints: string[]) {
  return hints.some((h) => name.includes(h));
}

export function MaybachModel({ bodyColor, accentColor }: Props) {
  const { scene } = useGLTF(MAYBACH_GLB_URL);

  const cloned = useMemo(() => {
    const next = scene.clone(true);
    next.traverse((obj: Object3D) => {
      if (!isMesh(obj) || !obj.material) return;
      if (Array.isArray(obj.material)) {
        obj.material = obj.material.map((m: Material) => m.clone());
      } else {
        obj.material = obj.material.clone();
      }
    });
    return next;
  }, [scene]);

  useEffect(() => {
    const body = new Color(bodyColor);
    const accent = new Color(accentColor);

    cloned.traverse((obj: Object3D) => {
      if (!isMesh(obj) || !obj.material) return;
      const mats = (Array.isArray(obj.material) ? obj.material : [obj.material]) as MeshStandardMaterial[];

      mats.forEach((mat) => {
        if (!("color" in mat)) return;
        const key = `${obj.name} ${mat.name}`.toLowerCase();
        if (hasHint(key, BODY_HINTS)) {
          mat.color.copy(body);
          mat.metalness = Math.max(mat.metalness ?? 0.25, 0.4);
          mat.roughness = Math.min(mat.roughness ?? 0.5, 0.34);
          mat.needsUpdate = true;
          return;
        }
        if (hasHint(key, ACCENT_HINTS)) {
          mat.color.copy(accent);
          mat.metalness = Math.max(mat.metalness ?? 0.4, 0.88);
          mat.roughness = Math.min(mat.roughness ?? 0.35, 0.22);
          mat.needsUpdate = true;
        }
      });
    });
  }, [cloned, bodyColor, accentColor]);

  return <primitive object={cloned} />;
}

useGLTF.preload(MAYBACH_GLB_URL);
