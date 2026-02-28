import { Component, Suspense, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Html, OrbitControls } from "@react-three/drei";
import { MaybachModel } from "./MaybachModel";

type Props = {
  bodyColor: string;
  accentColor: string;
  heroLightOn: boolean;
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

export function MaybachViewer({ bodyColor, accentColor, heroLightOn }: Props) {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 1.5, 6], fov: 46 }} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={heroLightOn ? 1.0 : 0.72} />
      <directionalLight position={[5, 6.2, 4.4]} intensity={heroLightOn ? 2.35 : 1.15} color="#ffe4bb" />
      <directionalLight position={[-5.2, 3.8, -4.6]} intensity={heroLightOn ? 1.25 : 0.72} color="#b3c5ff" />
      <directionalLight position={[0, 2.2, -8]} intensity={heroLightOn ? 1.15 : 0.62} color="#fff3de" />

      {heroLightOn ? (
        <>
          <pointLight
            position={[2.95, -0.28, 2.55]}
            distance={8}
            decay={1.35}
            intensity={1.68}
            color="#f4efe2"
          />
          <pointLight
            position={[-3.25, -0.2, -1.65]}
            distance={8.5}
            decay={1.3}
            intensity={1.24}
            color="#f2ead8"
          />
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
          <group position={[0, -0.95, 0]} scale={1}>
            <MaybachModel bodyColor={bodyColor} accentColor={accentColor} />
          </group>
          <ContactShadows position={[0, -1.5, 0]} opacity={heroLightOn ? 0.36 : 0.14} blur={2.15} scale={22} far={9} />
        </Suspense>
      </ModelErrorBoundary>

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minDistance={4.2}
        maxDistance={6.3}
        minPolarAngle={Math.PI / 3.3}
        maxPolarAngle={Math.PI / 2.08}
        enableDamping
        dampingFactor={0.08}
      />
    </Canvas>
  );
}
