import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import { MaybachModel } from "./MaybachModel";

type Props = {
  bodyColor: string;
  accentColor: string;
  heroLightOn: boolean;
};

export function MaybachViewer({ bodyColor, accentColor, heroLightOn }: Props) {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [4.8, 1.42, 4.9], fov: 30 }} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={heroLightOn ? 0.78 : 0.38} />
      <directionalLight position={[8.5, 7, 3.5]} intensity={heroLightOn ? 3.65 : 0.35} color="#ffe4bb" />
      <directionalLight position={[-6, 3.4, -6.3]} intensity={heroLightOn ? 1.7 : 0.72} color="#a8bfff" />
      <directionalLight position={[0, 2.2, -8]} intensity={heroLightOn ? 1.28 : 0.34} color="#fff3de" />
      <directionalLight position={[-2.6, 1.7, 5.6]} intensity={heroLightOn ? 1.02 : 0.34} color="#f5f2eb" />

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

      <Suspense fallback={null}>
        <group position={[0, -0.92, 0]} scale={0.88}>
          <MaybachModel bodyColor={bodyColor} accentColor={accentColor} />
        </group>
        <ContactShadows position={[0, -1.5, 0]} opacity={heroLightOn ? 0.36 : 0.12} blur={2.15} scale={22} far={9} />
      </Suspense>

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
