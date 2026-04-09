import { Component, Suspense, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Html, OrbitControls } from "@react-three/drei";
import { MaybachModel } from "./MaybachModel";

type Props = {
  bodyColor: string;
  accentColor: string;
  heroLightOn: boolean;
  compactMode?: boolean;
};

class ModelErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  override componentDidCatch() {
    // Intentionally empty: UI fallback is enough for this context.
  }

  override render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

export function MaybachViewer({ bodyColor, accentColor, heroLightOn, compactMode = false }: Props) {
  return (
    <Canvas
      dpr={compactMode ? [0.85, 1.1] : [1, 1.5]}
      frameloop={compactMode ? "demand" : "always"}
      camera={compactMode ? { position: [0, 1.22, 7.35], fov: 54 } : { position: [0, 1.5, 6], fov: 46 }}
      gl={{ antialias: !compactMode, alpha: true, powerPreference: compactMode ? "low-power" : "high-performance" }}
    >
      <ambientLight intensity={compactMode ? (heroLightOn ? 0.9 : 0.68) : heroLightOn ? 1.0 : 0.72} />
      <directionalLight position={[5, 6.2, 4.4]} intensity={compactMode ? (heroLightOn ? 1.75 : 0.9) : heroLightOn ? 2.35 : 1.15} color="#ffe4bb" />
      <directionalLight position={[-5.2, 3.8, -4.6]} intensity={compactMode ? (heroLightOn ? 0.95 : 0.62) : heroLightOn ? 1.25 : 0.72} color="#b3c5ff" />
      <directionalLight position={[0, 2.2, -8]} intensity={compactMode ? (heroLightOn ? 0.82 : 0.48) : heroLightOn ? 1.15 : 0.62} color="#fff3de" />

      {heroLightOn ? (
        <>
          <pointLight position={[2.95, -0.28, 2.55]} distance={compactMode ? 6.4 : 8} decay={1.35} intensity={compactMode ? 1.08 : 1.68} color="#f4efe2" />
          {!compactMode ? (
            <pointLight position={[-3.25, -0.2, -1.65]} distance={8.5} decay={1.3} intensity={1.24} color="#f2ead8" />
          ) : null}
        </>
      ) : null}

      <ModelErrorBoundary
        fallback={
          <Html center>
            <div className="cmModelStatus cmModelStatus--error">
              Model failed to load. Check that /public/models/maybach.glb exists.
            </div>
          </Html>
        }
      >
        <Suspense
          fallback={
            <Html center>
              <div className="cmModelStatus">Loading Maybach…</div>
            </Html>
          }
        >
          <group position={compactMode ? [0, -1.02, 0] : [0, -0.95, 0]} scale={compactMode ? 0.92 : 1}>
            <MaybachModel bodyColor={bodyColor} accentColor={accentColor} />
          </group>
          <ContactShadows
            frames={1}
            position={[0, -1.5, 0]}
            opacity={compactMode ? (heroLightOn ? 0.22 : 0.1) : heroLightOn ? 0.36 : 0.14}
            blur={compactMode ? 1.55 : 2.15}
            scale={compactMode ? 18 : 22}
            far={compactMode ? 7.2 : 9}
          />
        </Suspense>
      </ModelErrorBoundary>

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        rotateSpeed={compactMode ? 0.82 : 1}
        minDistance={compactMode ? 5.8 : 4.2}
        maxDistance={compactMode ? 7.4 : 6.3}
        minPolarAngle={compactMode ? Math.PI / 3.0 : Math.PI / 3.3}
        maxPolarAngle={compactMode ? Math.PI / 1.98 : Math.PI / 2.08}
        enableDamping
        dampingFactor={compactMode ? 0.11 : 0.08}
      />
    </Canvas>
  );
}
