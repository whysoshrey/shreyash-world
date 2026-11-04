import { createContext, useContext, useEffect, useMemo, useRef, type MutableRefObject, type ReactNode } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { ContactShadows, Edges, Environment, Lightformer, OrbitControls, Outlines, useCursor } from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { EXPLODE, type LayerKey } from "./agvParts";

/**
 * ACME robot, rebuilt as a 3D model. Units are centimetres; y is up, the robot faces −z.
 * Dimensions follow the dissertation (5 cm wheels, 4 mm wheel plate, 1 mm steel electronics plate, 8 mm payload deck,
 * 20 kg payload) and the CAD drawing; the arrangement of the front-mounted parts follows the build photos and video.
 */

export type SceneProps = {
  exploded: boolean;
  casing: boolean;
  selected: string | null;
  hovered: string | null;
  onSelect: (id: string | null) => void;
  onHover: (id: string | null) => void;
  zoom: number; // 0.6 (close) … 1.4 (far)
  resetKey: number;
  still: boolean;
  active: boolean; // false while scrolled out of view: stop rendering
  onReady?: () => void;
};

const TARGET = new THREE.Vector3(0, 10, 0);
const TARGET_EXPLODED = new THREE.Vector3(0, 28, 0);
// front-left three-quarter view: the status display, RFID reader and ultrasonic sensor face the viewer
const CAMERA_HOME = new THREE.Vector3(-66, 48, -86);

/* ------------------------------------------------------------------ materials */
function useMaterials() {
  return useMemo(() => {
    const std = (color: string, metalness = 0, roughness = 0.6, extra: Partial<THREE.MeshStandardMaterialParameters> = {}) =>
      new THREE.MeshStandardMaterial({ color, metalness, roughness, ...extra });
    return {
      alu: std("#d3d7dc", 1, 0.4),
      aluDark: std("#9aa1a9", 1, 0.38),
      steel: std("#c4c8cd", 1, 0.3),
      acrylic: new THREE.MeshPhysicalMaterial({ color: "#eef5ff", metalness: 0, roughness: 0.04, transparent: true, opacity: 0.16, clearcoat: 1, clearcoatRoughness: 0.05, depthWrite: false, side: THREE.DoubleSide }),
      pink: new THREE.MeshPhysicalMaterial({ color: "#f1a3bd", metalness: 0, roughness: 0.25, transparent: true, opacity: 0.86, clearcoat: 0.6 }),
      hub: std("#f2b20a", 0.15, 0.42),
      hubDark: std("#c98f00", 0.2, 0.5),
      roller: std("#161616", 0, 0.72),
      motor: std("#2d2f33", 0.7, 0.38),
      gearbox: std("#45484d", 0.5, 0.45),
      pcbBlue: std("#0f5f8f", 0.1, 0.5),
      pcbBlack: std("#1a1c22", 0.1, 0.5),
      pcbRed: std("#b3262b", 0.1, 0.5),
      pcbGreen: std("#1f5e3a", 0.1, 0.5),
      chip: std("#111216", 0.2, 0.4),
      header: std("#0c0c0c", 0.2, 0.6),
      pin: std("#d6b35a", 1, 0.3),
      battery: std("#1f2228", 0.3, 0.55),
      batteryLabel: std("#2f6fd1", 0.2, 0.5),
      bolt: std("#a7adb3", 1, 0.25),
      rubber: std("#202020", 0, 0.8),
      white: std("#f2f2ee", 0, 0.5),
      red: std("#d0201f", 0.05, 0.3),
      redGlow: std("#ff3b30", 0, 0.3, { emissive: new THREE.Color("#ff2a1f"), emissiveIntensity: 1.4 }),
      sensorEye: std("#c9ccd2", 0.9, 0.25),
      sensorMesh: std("#2a2a2a", 0.3, 0.7),
      wireRed: std("#d62d2d", 0, 0.7),
      wireBlack: std("#191919", 0, 0.7),
      wireBlue: std("#2c5bd6", 0, 0.7),
      wireYellow: std("#e2b21c", 0, 0.7),
      wireGreen: std("#2a9d4b", 0, 0.7),
    };
  }, []);
}
type Mats = ReturnType<typeof useMaterials>;

/* ------------------------------------------------------------------ selection plumbing */
type Sel = { selected: string | null; hovered: string | null };
const SelCtx = createContext<Sel>({ selected: null, hovered: null });
const PartCtx = createContext<string | null>(null);

/** A mesh that outlines itself when its part is selected or hovered. */
function Piece(props: { geometry: THREE.BufferGeometry; material: THREE.Material; position?: [number, number, number]; rotation?: [number, number, number]; edges?: boolean; noShadow?: boolean }) {
  const part = useContext(PartCtx);
  const { selected, hovered } = useContext(SelCtx);
  const on = part !== null && (selected === part || hovered === part);
  const transparent = (props.material as THREE.Material).transparent;
  return (
    <mesh geometry={props.geometry} material={props.material} position={props.position} rotation={props.rotation} castShadow={!props.noShadow && !transparent} receiveShadow>
      {props.edges ? <Edges threshold={20} color="#8fa6c6" /> : null}
      {on ? <Outlines thickness={selected === part ? 2.5 : 1.5} screenspace color={selected === part ? "#8c2b1d" : "#2e4757"} /> : null}
    </mesh>
  );
}

/** Groups meshes into an inspectable part. */
function Part({ id, children, register }: { id: string; children: ReactNode; register: (id: string, o: THREE.Object3D | null) => void }) {
  const set = useContext(PartHandlers);
  return (
    <PartCtx.Provider value={id}>
      <group
        ref={(o) => register(id, o)}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); set.onHover(id); }}
        onPointerOut={(e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); set.onHover(null); }}
        onClick={(e: ThreeEvent<MouseEvent>) => { if (e.delta > 5) return; e.stopPropagation(); set.onSelect(id); }}
      >
        {children}
      </group>
    </PartCtx.Provider>
  );
}
const PartHandlers = createContext<{ onSelect: (id: string | null) => void; onHover: (id: string | null) => void }>({ onSelect: () => {}, onHover: () => {} });

/** A layer that lifts smoothly in the exploded view. */
function Layer({ k, exploded, still, children }: { k: LayerKey; exploded: boolean; still: boolean; children: ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (!ref.current) return;
    const goal = exploded ? EXPLODE[k] : 0;
    const y = ref.current.position.y;
    ref.current.position.y = still ? goal : THREE.MathUtils.damp(y, goal, 6, dt);
  });
  return <group ref={ref}>{children}</group>;
}

/* ------------------------------------------------------------------ geometry helpers */
/** three r175 skips extrusion end caps when bevels are off; a zero-size single bevel keeps the caps. */
const FLAT = { bevelEnabled: true, bevelSegments: 1, bevelSize: 0, bevelThickness: 0 } as const;

const geo = {
  box: (w: number, h: number, d: number) => new THREE.BoxGeometry(w, h, d),
  rbox: (w: number, h: number, d: number, r: number) => roundedBox(w, h, d, r),
  cyl: (r: number, h: number, seg = 24) => new THREE.CylinderGeometry(r, r, h, seg),
};

function roundedBox(w: number, h: number, d: number, r: number) {
  // a rounded rectangle in plan (x/z), extruded upward by h
  const s = new THREE.Shape();
  const x = -w / 2, z = -d / 2;
  s.moveTo(x + r, z);
  s.lineTo(x + w - r, z); s.quadraticCurveTo(x + w, z, x + w, z + r);
  s.lineTo(x + w, z + d - r); s.quadraticCurveTo(x + w, z + d, x + w - r, z + d);
  s.lineTo(x + r, z + d); s.quadraticCurveTo(x, z + d, x, z + d - r);
  s.lineTo(x, z + r); s.quadraticCurveTo(x, z, x + r, z);
  const g = new THREE.ExtrudeGeometry(s, { depth: h, curveSegments: 6, ...FLAT });
  g.rotateX(Math.PI / 2); // extrude along −y …
  g.translate(0, h / 2, 0); // … then centre it vertically
  return g;
}

/** Side panel of the enclosure with arches over both wheels (profile in z/y, thickness along x). */
function sidePanelGeometry() {
  const L = 50.5, yTop = 21.5, yBot = 6.5, wheelZ = 18, wheelY = 5, r = 6.6;
  const s = new THREE.Shape();
  s.moveTo(-L / 2, yTop);
  s.lineTo(L / 2, yTop);
  s.lineTo(L / 2, yBot);
  const arch = (cz: number) => {
    const dz = Math.sqrt(r * r - (yBot - wheelY) ** 2);
    const a0 = Math.atan2(yBot - wheelY, dz), a1 = Math.PI - a0;
    s.lineTo(cz + dz, yBot);
    for (let i = 1; i <= 16; i++) {
      const a = a0 + ((a1 - a0) * i) / 16;
      s.lineTo(cz + Math.cos(a) * r, wheelY + Math.sin(a) * r);
    }
  };
  arch(wheelZ);
  s.lineTo(-wheelZ + Math.sqrt(r * r - (yBot - wheelY) ** 2), yBot);
  arch(-wheelZ);
  s.lineTo(-L / 2, yBot);
  s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.5, ...FLAT });
  g.rotateY(Math.PI / 2); // shape x → −z, extrusion → +x
  return g;
}

function wireGeometry(points: [number, number, number][], r = 0.14) {
  const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
  return new THREE.TubeGeometry(curve, 40, r, 6, false);
}

function lcdTexture() {
  const c = document.createElement("canvas");
  c.width = 512; c.height = 128;
  const x = c.getContext("2d")!;
  x.fillStyle = "#9fd34a"; x.fillRect(0, 0, 512, 128);
  x.fillStyle = "rgba(0,0,0,0.08)";
  for (let i = 0; i < 16; i++) for (let j = 0; j < 2; j++) x.fillRect(14 + i * 30.5, 14 + j * 54, 26, 44);
  x.fillStyle = "#14320c"; x.font = "bold 38px 'Courier New', monospace"; x.textBaseline = "top";
  x.fillText("Current Location", 18, 18);
  x.fillText("Final Loc: Home", 18, 72);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

/* ------------------------------------------------------------------ parts */
function OmniWheel({ m, x, z }: { m: Mats; x: number; z: number }) {
  const side = Math.sign(x);
  const parts = useMemo(() => {
    const hub = geo.cyl(3.7, 3.4, 32);
    const ring = geo.cyl(3.9, 0.5, 32);
    const boss = geo.cyl(1.2, 3.8, 16);
    const roller = new THREE.CapsuleGeometry(0.62, 1.15, 4, 10);
    const rollers: { p: [number, number, number]; q: THREE.Quaternion }[] = [];
    const n = 9;
    [-0.85, 0.85].forEach((off, row) => {
      for (let i = 0; i < n; i++) {
        const a = ((i + row * 0.5) / n) * Math.PI * 2;
        const pos = new THREE.Vector3(off, Math.cos(a) * 4.35, Math.sin(a) * 4.35);
        const tangent = new THREE.Vector3(0, -Math.sin(a), Math.cos(a));
        const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent);
        rollers.push({ p: [pos.x, pos.y, pos.z], q });
      }
    });
    const holes = Array.from({ length: 6 }, (_, i) => (i / 6) * Math.PI * 2);
    return { hub, ring, boss, roller, rollers, holes, hole: geo.cyl(0.55, 3.5, 12) };
  }, []);
  return (
    <group position={[x, 5, z]}>
      <Piece geometry={parts.hub} material={m.hub} rotation={[0, 0, Math.PI / 2]} />
      <Piece geometry={parts.ring} material={m.hubDark} position={[side * 1.75, 0, 0]} rotation={[0, 0, Math.PI / 2]} />
      <Piece geometry={parts.ring} material={m.hubDark} position={[-side * 1.75, 0, 0]} rotation={[0, 0, Math.PI / 2]} />
      <Piece geometry={parts.boss} material={m.aluDark} rotation={[0, 0, Math.PI / 2]} />
      {parts.holes.map((a) => (
        <Piece key={a} geometry={parts.hole} material={m.hubDark} position={[0, Math.cos(a) * 2.35, Math.sin(a) * 2.35]} rotation={[0, 0, Math.PI / 2]} noShadow />
      ))}
      {parts.rollers.map((r, i) => (
        <mesh key={i} geometry={parts.roller} material={m.roller} position={r.p} quaternion={r.q} castShadow />
      ))}
    </group>
  );
}

function Pcb({ size, color, at, children }: { size: [number, number]; color: THREE.Material; at: [number, number, number]; children?: ReactNode }) {
  const g = useMemo(() => geo.box(size[0], 0.16, size[1]), [size]);
  return (
    <group position={at}>
      <Piece geometry={g} material={color} />
      {children}
    </group>
  );
}

function Robot({ m, exploded, casing, still, register }: { m: Mats; exploded: boolean; casing: boolean; still: boolean; register: (id: string, o: THREE.Object3D | null) => void }) {
  const G = useMemo(() => {
    const lcd = lcdTexture();
    return {
      wheelPlate: geo.rbox(34, 0.4, 48.2, 3),
      elecPlate: geo.rbox(31, 0.12, 38.7, 2),
      deck: geo.rbox(36.5, 0.5, 45, 3),
      payload: geo.rbox(30, 0.8, 44, 2.5),
      lid: geo.rbox(41.5, 0.5, 51.2, 1.5),
      side: sidePanelGeometry(),
      face: geo.box(41, 11.5, 0.5),
      standoff: geo.cyl(0.42, 1, 10),
      motor: geo.cyl(1.75, 6.2, 20),
      gearbox: geo.box(3.6, 3.6, 4.2),
      shaft: geo.cyl(0.4, 2.6, 10),
      bracket: geo.box(4.2, 2.6, 0.5),
      casterBall: new THREE.SphereGeometry(1.6, 20, 16),
      casterCup: geo.cyl(2.1, 1.2, 20),
      casterStem: geo.cyl(0.7, 3.9, 12),
      bolt: geo.cyl(0.85, 0.55, 6),
      nut: geo.cyl(0.5, 0.9, 6),
      chipS: geo.box(1.6, 0.35, 1.6),
      chipL: geo.box(2.2, 0.3, 1.1),
      header: geo.box(8.6, 0.8, 0.5),
      headerS: geo.box(3.6, 0.8, 0.45),
      usb: geo.box(1.6, 1.1, 1.3),
      jack: geo.box(1.4, 1.1, 1.8),
      heatsink: geo.box(2.4, 2.4, 1.6),
      terminal: geo.box(1.1, 1, 1),
      coil: geo.cyl(0.8, 0.9, 16),
      pot: geo.box(0.9, 0.9, 0.9),
      battery: geo.rbox(7.2, 3.6, 10, 0.6),
      batteryBand: geo.box(7.3, 3.7, 1.4),
      lcdBody: geo.box(8.2, 3.7, 0.5),
      lcdScreen: new THREE.PlaneGeometry(6.6, 1.65),
      lcdMat: new THREE.MeshStandardMaterial({ map: lcd, emissive: new THREE.Color("#7fbf34"), emissiveMap: lcd, emissiveIntensity: 0.55, roughness: 0.35 }),
      usBoard: geo.box(4.6, 2.1, 0.18),
      usEye: geo.cyl(0.8, 1.2, 24),
      usMesh: geo.cyl(0.62, 0.05, 24),
      servo: geo.box(2.3, 2.3, 1.25),
      servoHorn: geo.box(1.8, 0.2, 0.5),
      rfid: geo.box(4.2, 4.2, 0.16),
      rfidCoil: new THREE.TorusGeometry(1.45, 0.07, 6, 4),
      killBase: geo.cyl(1.25, 1.1, 20),
      killCap: geo.cyl(1.05, 0.7, 24),
      irBoard: geo.box(11.5, 0.16, 2.2),
      irLed: geo.cyl(0.35, 0.45, 12),
      irArm: geo.box(1.2, 4.8, 0.5),
      led: geo.cyl(0.18, 0.3, 8),
    };
  }, []);

  const wheelZ = 18;
  const wheelX = 22.4;
  const wires = useMemo(
    () => [
      { g: wireGeometry([[9.5, 13.4, 3.8], [6, 15, -1], [5, 13.3, -6]], 0.18), mat: m.wireRed },
      { g: wireGeometry([[8.5, 13.4, 3.8], [4.5, 15.2, -1], [4, 13.3, -6]], 0.18), mat: m.wireBlack },
      { g: wireGeometry([[9.5, 13.4, 3.8], [0, 15.6, -2], [-8, 12.8, -7.4]], 0.16), mat: m.wireRed },
      { g: wireGeometry([[-8, 12.8, -8.6], [-9, 14, -2], [-9, 12.6, 1.8]], 0.12), mat: m.wireYellow },
      { g: wireGeometry([[-3.6, 12.6, 3], [0, 14.6, 5], [5.5, 12.6, 6.2]], 0.1), mat: m.wireGreen },
      { g: wireGeometry([[-3.6, 12.6, 3.6], [0.5, 15, 5.6], [5.5, 12.6, 6.8]], 0.1), mat: m.wireBlue },
      { g: wireGeometry([[-3.6, 12.6, 1.5], [0, 14.2, -3], [3.2, 12.8, -6.6]], 0.1), mat: m.wireBlue },
      ...[-1, 1].flatMap((sx) => [-1, 1].map((sz) => ({ g: wireGeometry([[5.5 * sx * 0.6 + 4, 12.6, -7], [sx * 12, 11, sz * 9], [sx * 16.5, 7.2, sz * wheelZ]], 0.12), mat: sz > 0 ? m.wireRed : m.wireBlack }))),
      { g: wireGeometry([[-8, 12.7, -5], [2, 15.6, -16], [6, 14.2, -23.3]], 0.09), mat: m.wireYellow },
      { g: wireGeometry([[6, 12.7, 6], [9, 17, -10], [15.6, 16.6, -24.6]], 0.09), mat: m.wireGreen },
      { g: wireGeometry([[-4, 12.6, 1], [0, 6, -20], [0, 3.3, -26.2]], 0.1), mat: m.wireBlack },
    ],
    [m],
  );

  return (
    <group>
      {/* ——— drive: wheels and motors ——— */}
      <Layer k="drive" exploded={exploded} still={still}>
        <Part id="wheels" register={register}>
          {[-1, 1].flatMap((sx) => [-1, 1].map((sz) => <OmniWheel key={`${sx}${sz}`} m={m} x={sx * wheelX} z={sz * wheelZ} />))}
        </Part>
        <Part id="motors" register={register}>
          {[-1, 1].flatMap((sx) =>
            [-1, 1].map((sz) => (
              <group key={`${sx}${sz}`} position={[sx * 14.2, 5, sz * wheelZ]}>
                <Piece geometry={G.motor} material={m.motor} rotation={[0, 0, Math.PI / 2]} />
                <Piece geometry={G.gearbox} material={m.gearbox} position={[sx * 4.6, 0, 0]} />
                <Piece geometry={G.shaft} material={m.aluDark} position={[sx * 7.2, 0, 0]} rotation={[0, 0, Math.PI / 2]} />
                <Piece geometry={G.bracket} material={m.aluDark} position={[sx * 3, 1.6, 0]} />
              </group>
            )),
          )}
        </Part>
      </Layer>

      {/* ——— chassis: wheel plate, caster, line sensor ——— */}
      <Layer k="chassis" exploded={exploded} still={still}>
        <Part id="wheelPlate" register={register}>
          <Piece geometry={G.wheelPlate} material={m.alu} position={[0, 8, 0]} />
          {[[-15, -21], [15, -21], [-15, 21], [15, 21], [-15, 0], [15, 0]].map(([x, z]) => (
            <group key={`${x}${z}`}>
              <mesh geometry={G.standoff} material={m.aluDark} position={[x, 9.9, z * 0.8]} scale={[1, 3.2, 1]} castShadow />
            </group>
          ))}
        </Part>
        <Part id="caster" register={register}>
          <Piece geometry={G.casterStem} material={m.aluDark} position={[0, 5.6, 0]} />
          <Piece geometry={G.casterCup} material={m.aluDark} position={[0, 3.4, 0]} />
          <Piece geometry={G.casterBall} material={m.steel} position={[0, 1.6, 0]} />
        </Part>
        <Part id="lineSensor" register={register}>
          <Piece geometry={G.irArm} material={m.aluDark} position={[0, 5.5, -24.6]} />
          <Piece geometry={G.irBoard} material={m.pcbBlack} position={[0, 2.9, -25.6]} />
          {[-4.4, -2.2, 0, 2.2, 4.4].map((x) => (
            <group key={x}>
              <Piece geometry={G.irLed} material={m.chip} position={[x, 2.6, -25.6]} noShadow />
              <mesh geometry={G.led} material={m.redGlow} position={[x + 0.7, 3.1, -26.3]} />
            </group>
          ))}
        </Part>
      </Layer>

      {/* ——— electronics plate ——— */}
      <Layer k="electronicsPlate" exploded={exploded} still={still}>
        <Part id="electronicsPlate" register={register}>
          <Piece geometry={G.elecPlate} material={m.steel} position={[0, 11.6, 0]} />
        </Part>
      </Layer>

      {/* ——— electronics ——— */}
      <Layer k="electronics" exploded={exploded} still={still}>
        <Part id="mega" register={register}>
          <Pcb size={[10.2, 5.4]} color={m.pcbBlue} at={[-7.5, 11.9, 2.4]}>
            <Piece geometry={G.chipL} material={m.chip} position={[0.6, 0.25, 0.2]} />
            <Piece geometry={G.header} material={m.header} position={[0.4, 0.45, -2.25]} />
            <Piece geometry={G.header} material={m.header} position={[0.4, 0.45, 2.25]} />
            <Piece geometry={G.usb} material={m.steel} position={[-4.6, 0.6, -1.4]} />
            <Piece geometry={G.jack} material={m.chip} position={[-4.6, 0.6, 1.5]} />
          </Pcb>
        </Part>
        <Part id="esp" register={register}>
          <Pcb size={[5.2, 2.8]} color={m.pcbBlack} at={[6.2, 11.9, 6.4]}>
            <Piece geometry={G.chipS} material={m.steel} position={[0.8, 0.25, 0]} />
            <Piece geometry={G.headerS} material={m.header} position={[-0.6, 0.45, -1.2]} />
            <Piece geometry={G.headerS} material={m.header} position={[-0.6, 0.45, 1.2]} />
          </Pcb>
        </Part>
        <Part id="driver" register={register}>
          <Pcb size={[4.4, 4.4]} color={m.pcbRed} at={[4.2, 11.9, -6.8]}>
            <Piece geometry={G.heatsink} material={m.chip} position={[0, 1.3, 0.3]} />
            {[-1.4, 0, 1.4].map((x) => <Piece key={x} geometry={G.terminal} material={m.wireBlue} position={[x, 0.55, -1.7]} />)}
          </Pcb>
        </Part>
        <Part id="buck" register={register}>
          <Pcb size={[4.3, 2.1]} color={m.pcbBlue} at={[-8, 11.9, -8]}>
            <Piece geometry={G.coil} material={m.chip} position={[-0.9, 0.5, 0]} />
            <Piece geometry={G.pot} material={m.wireBlue} position={[1.2, 0.5, 0]} />
          </Pcb>
        </Part>
        <Part id="battery" register={register}>
          <Piece geometry={G.battery} material={m.battery} position={[9.6, 13.6, 7.4]} />
          <Piece geometry={G.batteryBand} material={m.batteryLabel} position={[9.6, 13.6, 7.4]} />
        </Part>
        <group>
          {wires.map((w, i) => <mesh key={i} geometry={w.g} material={w.mat} castShadow />)}
        </group>
      </Layer>

      {/* ——— pink deck + status display ——— */}
      <Layer k="deck" exploded={exploded} still={still}>
        <Part id="deck" register={register}>
          <Piece geometry={G.deck} material={m.pink} position={[0, 16.2, 0]} />
          {[[-15, -18], [15, -18], [-15, 18], [15, 18]].map(([x, z]) => (
            <mesh key={`${x}${z}`} geometry={G.standoff} material={m.aluDark} position={[x, 14.2, z]} scale={[1, 4.2, 1]} castShadow />
          ))}
        </Part>
        <Part id="lcd" register={register}>
          <group position={[6.5, 14.4, -23.6]}>
            <Piece geometry={G.lcdBody} material={m.pcbGreen} />
            <mesh geometry={G.lcdScreen} material={G.lcdMat} position={[0, 0, -0.27]} rotation={[0, Math.PI, 0]} />
          </group>
        </Part>
      </Layer>

      {/* ——— payload deck ——— */}
      <Layer k="payload" exploded={exploded} still={still}>
        <Part id="payload" register={register}>
          <Piece geometry={G.payload} material={m.alu} position={[0, 19.6, 0]} />
          {[[-12.5, -19], [12.5, -19], [-12.5, 19], [12.5, 19]].map(([x, z]) => (
            <group key={`${x}${z}`}>
              <mesh geometry={G.standoff} material={m.aluDark} position={[x, 17.8, z]} scale={[1, 2.6, 1]} castShadow />
              <Piece geometry={G.bolt} material={m.bolt} position={[x, 20.3, z]} />
            </group>
          ))}
        </Part>
      </Layer>

      {/* ——— clear enclosure ——— */}
      <Layer k="enclosure" exploded={exploded} still={still}>
        <group visible={casing}>
          <Part id="enclosure" register={register}>
            <Piece geometry={G.side} material={m.acrylic} position={[20.25, 0, 0]} edges />
            <Piece geometry={G.side} material={m.acrylic} position={[-20.75, 0, 0]} edges />
            <Piece geometry={G.face} material={m.acrylic} position={[0, 15.75, -25.25]} edges />
            <Piece geometry={G.face} material={m.acrylic} position={[0, 15.75, 25.25]} edges />
            <Piece geometry={G.lid} material={m.acrylic} position={[0, 21.75, 0]} edges />
            {[[-18, -23], [18, -23], [-18, 23], [18, 23]].map(([x, z]) => (
              <Piece key={`${x}${z}`} geometry={G.nut} material={m.bolt} position={[x, 22.4, z]} />
            ))}
          </Part>
        </group>
      </Layer>

      {/* ——— front-mounted sensors and controls ——— */}
      <Layer k="sensors" exploded={exploded} still={still}>
        <Part id="ultrasonic" register={register}>
          <group position={[-3, 18.1, -24]}>
            <Piece geometry={G.servo} material={m.wireBlue} position={[0, -1.7, 0.4]} />
            <Piece geometry={G.servoHorn} material={m.white} position={[0, -0.5, 0.2]} />
            <Piece geometry={G.usBoard} material={m.pcbBlue} />
            {[-1.25, 1.25].map((x) => (
              <group key={x}>
                <Piece geometry={G.usEye} material={m.sensorEye} position={[x, 0, -0.6]} rotation={[Math.PI / 2, 0, 0]} />
                <mesh geometry={G.usMesh} material={m.sensorMesh} position={[x, 0, -1.23]} rotation={[Math.PI / 2, 0, 0]} />
              </group>
            ))}
          </group>
        </Part>
        <Part id="rfid" register={register}>
          <group position={[15.6, 16.6, -25.75]}>
            <Piece geometry={G.rfid} material={m.pcbRed} />
            <mesh geometry={G.rfidCoil} material={m.pin} position={[0, 0, -0.1]} rotation={[0, 0, Math.PI / 4]} />
            <mesh geometry={G.led} material={m.redGlow} position={[1.5, 1.5, -0.2]} rotation={[Math.PI / 2, 0, 0]} />
          </group>
        </Part>
        <Part id="kill" register={register}>
          <group position={[-14.5, 14.6, -25.9]} rotation={[Math.PI / 2, 0, 0]}>
            <Piece geometry={G.killBase} material={m.chip} />
            <Piece geometry={G.killCap} material={m.red} position={[0, -0.85, 0]} />
          </group>
        </Part>
      </Layer>
    </group>
  );
}

/* ------------------------------------------------------------------ camera rig */
function Ready({ onReady }: { onReady?: () => void }) {
  const done = useRef(false);
  useFrame(() => {
    if (!done.current) { done.current = true; requestAnimationFrame(() => onReady?.()); }
  });
  return null;
}

/* ------------------------------------------------------------------ canvas */
export default function AgvScene(p: SceneProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      frameloop={p.active ? "always" : "never"}
      camera={{ position: CAMERA_HOME.toArray(), fov: 30, near: 1, far: 600 }}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}
      onPointerMissed={() => p.onSelect(null)}
      aria-label="Interactive 3D model of the ACME robot"
    >
      <Inner {...p} />
    </Canvas>
  );
}

function Inner(p: SceneProps) {
  const m = useMaterials();
  const parts = useRef(new Map<string, THREE.Object3D>());
  const register = useMemo(() => (id: string, o: THREE.Object3D | null) => { if (o) parts.current.set(id, o); }, []);
  const interacting = useRef(false);
  const idle = useRef<number | undefined>(undefined);
  const autoRotate = useRef(!p.still);
  useCursor(Boolean(p.hovered));

  // focus the camera on the selected part (centre of its bounding box, after the explode animation settles)
  const focus = useRef<THREE.Vector3 | null>(null);
  useEffect(() => {
    if (!p.selected) { focus.current = null; return; }
    const t = window.setTimeout(() => {
      const o = parts.current.get(p.selected!);
      if (!o) return;
      const b = new THREE.Box3().setFromObject(o);
      const c = b.getCenter(new THREE.Vector3());
      focus.current = (p.exploded ? TARGET_EXPLODED : TARGET).clone().lerp(c, 0.7);
    }, p.still ? 0 : 450);
    return () => window.clearTimeout(t);
  }, [p.selected, p.exploded, p.still]);

  return (
    <SelCtx.Provider value={{ selected: p.selected, hovered: p.hovered }}>
      <PartHandlers.Provider value={{ onSelect: p.onSelect, onHover: p.onHover }}>
        <ambientLight intensity={0.35} />
        <directionalLight
          position={[40, 80, 30]}
          intensity={1.6}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-45}
          shadow-camera-right={45}
          shadow-camera-top={45}
          shadow-camera-bottom={-45}
          shadow-bias={-0.0004}
        />
        <directionalLight position={[-50, 30, -40]} intensity={0.45} color="#c9d6ff" />
        {/* studio reflections, built locally (no HDR download) */}
        <Environment resolution={256} frames={1}>
          <Lightformer form="rect" intensity={3} color="#ffffff" position={[0, 60, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[90, 90, 1]} />
          <Lightformer form="rect" intensity={1.6} color="#f2f0ea" position={[-70, 25, 20]} rotation={[0, Math.PI / 2, 0]} scale={[60, 30, 1]} />
          <Lightformer form="rect" intensity={1.2} color="#dfe6ff" position={[70, 20, -20]} rotation={[0, -Math.PI / 2, 0]} scale={[60, 30, 1]} />
          <Lightformer form="ring" intensity={0.8} color="#ffffff" position={[0, 20, -80]} scale={30} />
        </Environment>

        <Robot m={m} exploded={p.exploded} casing={p.casing} still={p.still} register={register} />
        <RigWithRef focusRef={focus} exploded={p.exploded} zoom={p.zoom} resetKey={p.resetKey} still={p.still} interacting={interacting} />

        <ContactShadows position={[0, 0.01, 0]} scale={140} blur={2.6} far={40} opacity={0.42} resolution={1024} color="#1b2546" />

        <OrbitControls
          makeDefault
          enablePan={false}
          enableZoom={false}
          enableDamping
          dampingFactor={0.08}
          minPolarAngle={0.25}
          maxPolarAngle={1.42}
          autoRotate={autoRotate.current}
          autoRotateSpeed={0.55}
          onStart={() => {
            interacting.current = true;
            autoRotate.current = false;
            window.clearTimeout(idle.current);
          }}
          onEnd={() => {
            interacting.current = false;
            if (!p.still) idle.current = window.setTimeout(() => { autoRotate.current = true; }, 7000);
          }}
        />
        <AutoRotateSync on={autoRotate} still={p.still} paused={Boolean(p.selected)} />
        <Ready onReady={p.onReady} />
      </PartHandlers.Provider>
    </SelCtx.Provider>
  );
}

/** Camera: eases the orbit target toward the selected part and the distance toward the zoom level. */
function RigWithRef({ focusRef, exploded, zoom, resetKey, still, interacting }: { focusRef: MutableRefObject<THREE.Vector3 | null>; exploded: boolean; zoom: number; resetKey: number; still: boolean; interacting: MutableRefObject<boolean> }) {
  const controls = useThree((s) => s.controls) as unknown as OrbitControlsImpl | null;
  const camera = useThree((s) => s.camera);
  const baseDist = CAMERA_HOME.distanceTo(TARGET);

  useEffect(() => {
    camera.position.copy(CAMERA_HOME);
    if (controls) { controls.target.copy(TARGET); controls.update(); }
  }, [resetKey, camera, controls]);

  useFrame((_, dt) => {
    if (!controls) return;
    const k = still ? 1 : 1 - Math.exp(-5 * dt);
    controls.target.lerp(focusRef.current ?? (exploded ? TARGET_EXPLODED : TARGET), k);
    if (!interacting.current) {
      const off = camera.position.clone().sub(controls.target);
      off.setLength(THREE.MathUtils.lerp(off.length(), baseDist * zoom * (exploded ? 1.5 : 1), k));
      camera.position.copy(controls.target).add(off);
    }
  });
  return null;
}

function AutoRotateSync({ on, still, paused }: { on: MutableRefObject<boolean>; still: boolean; paused: boolean }) {
  const controls = useThree((s) => s.controls) as unknown as OrbitControlsImpl | null;
  useFrame(() => {
    if (controls) controls.autoRotate = !still && !paused && on.current;
  });
  return null;
}

