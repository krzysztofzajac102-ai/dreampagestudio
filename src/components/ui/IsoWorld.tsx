"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useMemo, useRef } from "react";
import type { MotionValue } from "framer-motion";

/*
  Izometryczny świat 3D w stylu vectrfl.com.
  Kamera ortograficzna jedzie wzdłuż osi X przez strefy:
  miasto (hero) → trasy (01) → fabryka/chłodnie (02) → magazyny (03) → siatka kafli (04).
  Pozycję kamery steruje scrollYProgress (MotionValue 0..1) przekazany z HeroProcess.
*/

const BG = "#0a0a14"; // jak tło produkcyjnej strony
const BUILDING = "#2e3458";
const BUILDING_DARK = "#1e2340";
const GROUND = "#0d0e1c";
const ACCENT = "#f43f5e"; // trasy
const INDIGO = "#6366f1"; // akcent logo / diamenty
const GLOW = "#67e8f9"; // świecące kafle

const PATH_POINTS = [
  new THREE.Vector3(0, 4.6, 0), // hero — miasto nisko w kadrze
  new THREE.Vector3(16, 1.6, 0), // 01 trasy
  new THREE.Vector3(34, 1.6, 0), // 02 fabryka + chłodnie
  new THREE.Vector3(54, 1.6, 0), // 03 magazyny
  new THREE.Vector3(74, 1.7, 0), // 04 kafle — wyższy cel = wieża pełniej w kadrze
];

const ISO_OFFSET = new THREE.Vector3(15, 13, 15);
const PATH_CURVE = new THREE.CatmullRomCurve3(PATH_POINTS, false, "catmullrom", 0.4);
/* Kamera kończy podróż przy 92% scrolla i STOI — krok 04 jest czytany
   przy w pełni widocznej, spokojnej scenie (bez wygaszania w trakcie) */
const CAM_END = 0.92;
const camParam = (p: number) => Math.min(THREE.MathUtils.clamp(p, 0, 1) / CAM_END, 1);

function CameraRig({ progress }: { progress: MotionValue<number> }) {
  const { camera, size } = useThree();
  const curve = PATH_CURVE;
  const target = useRef(PATH_POINTS[0].clone());
  const point = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const p = THREE.MathUtils.clamp(progress.get(), 0, 1);
    curve.getPoint(camParam(p), point);
    target.current.lerp(point, 0.1);

    camera.position.set(
      target.current.x + ISO_OFFSET.x,
      target.current.y + ISO_OFFSET.y,
      target.current.z + ISO_OFFSET.z
    );
    camera.lookAt(target.current);

    // zoom z uwzględnieniem WYSOKOŚCI okna — na niskich viewportach
    // (laptopy, przeglądarka w VS Code) kadr bez tego był gigantycznie przybliżony
    const base = THREE.MathUtils.clamp(
      Math.min(size.width / 36, size.height / 24),
      15,
      44
    );
    // cinematyczny push-in na finiszu (po zatrzymaniu kamery)
    const a = THREE.MathUtils.clamp((p - 0.92) / 0.08, 0, 1);
    const zoom = base * (1 + 0.1 * (a * a * (3 - 2 * a)));
    if (Math.abs((camera as THREE.OrthographicCamera).zoom - zoom) > 0.05) {
      (camera as THREE.OrthographicCamera).zoom = zoom;
      camera.updateProjectionMatrix();
    }
  });

  return null;
}

/* Światło rzucające cienie — podąża za celem kamery, żeby mapa cieni
   była zawsze ciasna i ostra niezależnie od strefy */
function ShadowLight({ progress }: { progress: MotionValue<number> }) {
  const lightRef = useRef<THREE.DirectionalLight>(null);
  const targetObj = useMemo(() => new THREE.Object3D(), []);
  const point = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    PATH_CURVE.getPoint(camParam(progress.get()), point);
    if (lightRef.current) {
      lightRef.current.position.set(point.x + 10, 17, point.z + 6);
      if (lightRef.current.target !== targetObj) lightRef.current.target = targetObj;
    }
    targetObj.position.set(point.x, 0, point.z);
    targetObj.updateMatrixWorld();
  });

  return (
    <>
      <directionalLight
        ref={lightRef}
        castShadow
        intensity={1.9}
        color="#dde5ff"
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-24}
        shadow-camera-right={24}
        shadow-camera-top={24}
        shadow-camera-bottom={-24}
        shadow-camera-near={1}
        shadow-camera-far={70}
        shadow-bias={-0.0004}
      />
      <primitive object={targetObj} />
    </>
  );
}

function Building({
  position,
  size,
  color = BUILDING,
}: {
  position: [number, number, number];
  size: [number, number, number];
  color?: string;
}) {
  return (
    <mesh position={[position[0], position[1] + size[1] / 2, position[2]]} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.9} metalness={0.02} />
    </mesh>
  );
}

function ShadowBlob({
  position,
  radius,
}: {
  position: [number, number, number];
  radius: number;
}) {
  return (
    <mesh position={[position[0], 0.012, position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[radius, 24]} />
      <meshBasicMaterial color="#000000" transparent opacity={0.28} />
    </mesh>
  );
}

function WindTurbine({ position }: { position: [number, number, number] }) {
  const blades = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (blades.current) blades.current.rotation.z += dt * 1.4;
  });
  return (
    <group position={position} rotation={[0, Math.PI / 4, 0]}>
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.1, 3, 8]} />
        <meshStandardMaterial color={BUILDING} roughness={0.9} />
      </mesh>
      <group ref={blades} position={[0, 3, 0.12]}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} rotation={[0, 0, (i * Math.PI * 2) / 3]} position={[0, 0, 0]} castShadow>
            <boxGeometry args={[0.09, 1.7, 0.03]} />
            <meshStandardMaterial color={BUILDING} roughness={0.9} />
          </mesh>
        ))}
      </group>
      <ShadowBlob position={position} radius={0.7} />
    </group>
  );
}

function CoolingTower({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const profile = useMemo(() => {
    const pts: THREE.Vector2[] = [];
    const radii = [1.15, 0.95, 0.72, 0.62, 0.66, 0.72];
    radii.forEach((r, i) => pts.push(new THREE.Vector2(r, (i / (radii.length - 1)) * 3.4)));
    return pts;
  }, []);
  return (
    <group position={position} scale={scale}>
      <mesh castShadow>
        <latheGeometry args={[profile, 28]} />
        <meshStandardMaterial color={BUILDING} roughness={0.92} side={THREE.DoubleSide} />
      </mesh>
      <ShadowBlob position={[0, 0, 0]} radius={1.5} />
    </group>
  );
}

/* Czerwona trasa prowadząca przez CAŁĄ podróż (miasto → fabryka → magazyny
   → platforma finałowa). Rysuje się scrollem przez wszystkie 4 kroki
   (drawRange na TubeGeometry) ze świecącą końcówką. */
const ROUTE_CURVE = new THREE.CatmullRomCurve3([
  new THREE.Vector3(4.5, 0.06, 3),
  new THREE.Vector3(9, 0.06, -2.5),
  new THREE.Vector3(15, 0.06, 3),
  new THREE.Vector3(21, 0.06, -3.5),
  new THREE.Vector3(27, 0.06, -4.6),
  new THREE.Vector3(33, 0.06, -5.4), // północą obok fabryki
  new THREE.Vector3(40, 0.06, -4.6),
  new THREE.Vector3(46, 0.06, -5.2),
  new THREE.Vector3(53, 0.06, -4.9), // wzdłuż magazynów
  new THREE.Vector3(56.5, 0.06, -4.6),
  new THREE.Vector3(58.8, 0.06, -3.3), // krawędź platformy kafli (omija halę)
]);
const ROUTE_START = 0.12;
const ROUTE_END = 0.88; // linia dociera na platformę tuż przed zatrzymaniem kamery

function RouteLine({ progress }: { progress: MotionValue<number> }) {
  const tipRef = useRef<THREE.Mesh>(null);
  const tipMat = useRef<THREE.MeshBasicMaterial>(null);
  const point = useMemo(() => new THREE.Vector3(), []);
  const geometry = useMemo(() => new THREE.TubeGeometry(ROUTE_CURVE, 360, 0.09, 6), []);

  useFrame(({ clock }) => {
    const p = progress.get();
    const local = THREE.MathUtils.clamp((p - ROUTE_START) / (ROUTE_END - ROUTE_START), 0, 1);
    const index = geometry.index;
    if (index) geometry.setDrawRange(0, Math.floor(index.count * local));

    // świecąca końcówka jedzie z czołem linii — getPointAt (długość łuku),
    // bo TubeGeometry próbkuje krzywą właśnie po długości łuku
    if (tipRef.current) {
      ROUTE_CURVE.getPointAt(local, point);
      tipRef.current.position.set(point.x, 0.12, point.z);
      // po dotarciu na platformę kropka zostaje jako pulsujący "beacon"
      const active = local > 0.001;
      tipRef.current.visible = active;
      if (tipMat.current) {
        const pulse = 0.75 + Math.sin(clock.elapsedTime * 5) * 0.25;
        tipMat.current.opacity = active ? pulse : 0;
      }
    }
  });

  return (
    <group>
      <mesh geometry={geometry}>
        <meshBasicMaterial color={ACCENT} />
      </mesh>
      <mesh ref={tipRef} visible={false}>
        <sphereGeometry args={[0.22, 12, 12]} />
        <meshBasicMaterial ref={tipMat} color={ACCENT} transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

function ContainerStack({
  position,
  rows = 2,
  cols = 3,
  layers = 2,
}: {
  position: [number, number, number];
  rows?: number;
  cols?: number;
  layers?: number;
}) {
  const items = useMemo(() => {
    const out: [number, number, number][] = [];
    for (let l = 0; l < layers; l++)
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++) out.push([c * 1.15, l * 0.62 + 0.31, r * 0.7]);
    return out;
  }, [rows, cols, layers]);
  return (
    <group position={position}>
      {items.map((p, i) => (
        <mesh key={i} position={p} castShadow receiveShadow>
          <boxGeometry args={[1.05, 0.58, 0.62]} />
          <meshStandardMaterial color={i % 3 === 0 ? BUILDING_DARK : BUILDING} roughness={0.92} />
        </mesh>
      ))}
    </group>
  );
}

function Warehouse({
  position,
  length = 4.5,
}: {
  position: [number, number, number];
  length?: number;
}) {
  return (
    <group position={position}>
      <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
        <boxGeometry args={[length, 1.1, 2.2]} />
        <meshStandardMaterial color={BUILDING} roughness={0.92} />
      </mesh>
      {/* dach — piramida (stożek o 4 segmentach) rozciągnięta wzdłuż hali */}
      <group position={[0, 1.1, 0]} scale={[length / 2.2, 1, 1]}>
        <mesh position={[0, 0.3, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[1.56, 0.6, 4]} />
          <meshStandardMaterial color={BUILDING_DARK} roughness={0.92} flatShading />
        </mesh>
      </group>
      <ShadowBlob position={[0, 0, 0]} radius={length * 0.55} />
    </group>
  );
}

/* Strefa 04 — finał: spokojna radialna fala od centrum (jak kręgi na wodzie),
   świecące płytki, centralna "budowana strona" i równy pierścień kostek */
const TILE_COUNT = 15;
const TILE_SPACING = 2.0;
const TILE_HALF = ((TILE_COUNT - 1) * TILE_SPACING) / 2;
const tileWave = (ix: number, iz: number, t: number) => {
  const dx = ix * TILE_SPACING - TILE_HALF;
  const dz = iz * TILE_SPACING - TILE_HALF;
  const dist = Math.sqrt(dx * dx + dz * dz);
  const falloff = Math.max(0, 1 - dist / 18);
  return 0.1 + Math.sin(t * 1.6 - dist * 0.55) * 0.045 * falloff;
};

function TileGrid({
  position,
  progress,
}: {
  position: [number, number, number];
  progress: MotionValue<number>;
}) {
  const instRef = useRef<THREE.InstancedMesh>(null);
  const glowMeshes = useRef<THREE.Mesh[]>([]);
  const glowMats = useRef<THREE.MeshStandardMaterial[]>([]);
  const orbit = useRef<THREE.Group>(null);
  const ringRefs = useRef<THREE.Mesh[]>([]);
  const ringMats = useRef<THREE.MeshBasicMaterial[]>([]);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // bliżej centrum, symetryczniej — czytelna kompozycja zamiast losowości
  const glowTiles: [number, number][] = useMemo(
    () => [
      [-3, 0],
      [3, 0],
      [0, -3],
      [0, 3],
      [-2, -2],
      [2, 2],
    ],
    []
  );
  // indeksy komórek zajętych przez świecące kafle — bazowy kafel jest tam
  // CHOWANY, żeby dwa pudełka się nie przenikały (źródło migotania i "halo")
  const glowCells = useMemo(
    () => new Set(glowTiles.map(([gx, gz]) => (gx + 7) * TILE_COUNT + (gz + 7))),
    [glowTiles]
  );

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const p = progress.get();

    // radialna fala od centrum — jak kręgi na wodzie
    if (instRef.current) {
      let i = 0;
      for (let ix = 0; ix < TILE_COUNT; ix++)
        for (let iz = 0; iz < TILE_COUNT; iz++) {
          const hidden = glowCells.has(ix * TILE_COUNT + iz);
          dummy.position.set(
            ix * TILE_SPACING - TILE_HALF,
            hidden ? -60 : tileWave(ix, iz, t),
            iz * TILE_SPACING - TILE_HALF
          );
          dummy.updateMatrix();
          instRef.current.setMatrixAt(i++, dummy.matrix);
        }
      instRef.current.instanceMatrix.needsUpdate = true;
    }

    // świecące kafle ZASTĘPUJĄ bazowe — płyną dokładnie z falą + pulsują
    glowTiles.forEach(([gx, gz], i) => {
      const mesh = glowMeshes.current[i];
      const mat = glowMats.current[i];
      if (mesh) mesh.position.y = tileWave(gx + 7, gz + 7, t);
      if (mat) mat.emissiveIntensity = 0.55 + Math.sin(t * 1.8 + i * 1.05) * 0.3;
    });

    // równy pierścień kostek — jedna wysokość, spokojny obrót
    if (orbit.current) orbit.current.rotation.y = t * 0.3;

    // pierścienie "dotarcia" — rozchodzą się od wieży po przyjeździe kamery
    const arrived = p >= 0.86;
    ringRefs.current.forEach((ring, i) => {
      if (!ring) return;
      ring.visible = arrived;
      if (!arrived) return;
      const phase = (t * 0.42 + i / 3) % 1;
      const scale = 1 + phase * 11;
      ring.scale.set(scale, scale, 1);
      const mat = ringMats.current[i];
      if (mat) mat.opacity = (1 - phase) * 0.4;
    });
  });

  return (
    <group position={position}>
      <instancedMesh
        ref={instRef}
        args={[undefined, undefined, TILE_COUNT * TILE_COUNT]}
        receiveShadow
      >
        <boxGeometry args={[1.65, 0.2, 1.65]} />
        <meshStandardMaterial color={BUILDING} roughness={0.92} />
      </instancedMesh>

      {glowTiles.map(([gx, gz], i) => (
        <mesh
          key={i}
          ref={(m) => {
            if (m) glowMeshes.current[i] = m;
          }}
          position={[gx * TILE_SPACING, 0.1, gz * TILE_SPACING]}
        >
          <boxGeometry args={[1.65, 0.2, 1.65]} />
          <meshStandardMaterial
            ref={(m) => {
              if (m) glowMats.current[i] = m;
            }}
            color={GLOW}
            emissive="#22d3ee"
            emissiveIntensity={0.7}
            roughness={0.45}
          />
        </mesh>
      ))}

      {/* pierścienie pulsu po dotarciu — animacja 3D finału */}
      {[0, 1, 2].map((i) => (
        <mesh
          key={`ring-${i}`}
          ref={(m) => {
            if (m) ringRefs.current[i] = m;
          }}
          visible={false}
          position={[0, 0.24, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[0.92, 1.06, 48]} />
          <meshBasicMaterial
            ref={(m) => {
              if (m) ringMats.current[i] = m;
            }}
            color={i % 2 === 0 ? "#22d3ee" : INDIGO}
            transparent
            opacity={0}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* centralna "strona w budowie" — wieża z lekko obróconych pięter */}
      <group position={[0, 0, 0]}>
        {[
          { s: 3.2, h: 1.2, y: 0.8, rot: 0, c: BUILDING },
          { s: 2.4, h: 1.0, y: 1.9, rot: Math.PI / 12, c: BUILDING_DARK },
          { s: 1.7, h: 0.85, y: 2.85, rot: Math.PI / 6, c: BUILDING },
          { s: 1.05, h: 0.7, y: 3.65, rot: Math.PI / 4, c: BUILDING_DARK },
        ].map((tier, i) => (
          <mesh key={i} position={[0, tier.y, 0]} rotation={[0, tier.rot, 0]} castShadow>
            <boxGeometry args={[tier.s, tier.h, tier.s]} />
            <meshStandardMaterial color={tier.c} roughness={0.88} />
          </mesh>
        ))}
        <FloatingDiamond position={[0, 5.2, 0]} phase={0.5} />
        <ShadowBlob position={[0, 0, 0]} radius={2.6} />
      </group>

      {/* równy pierścień małych kostek wokół wieży */}
      <group ref={orbit}>
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i / 8) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[Math.cos(a) * 3.5, 1.3, Math.sin(a) * 3.5]}
              rotation={[Math.PI / 4, 0, Math.PI / 4]}
              castShadow
            >
              <boxGeometry args={[0.42, 0.42, 0.42]} />
              <meshStandardMaterial
                color={i % 2 === 0 ? INDIGO : GLOW}
                emissive={i % 2 === 0 ? INDIGO : GLOW}
                emissiveIntensity={0.25}
                roughness={0.5}
              />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

function FloatingDiamond({
  position,
  phase,
}: {
  position: [number, number, number];
  phase: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    ref.current.position.y = position[1] + Math.sin(t * 1.2 + phase) * 0.3;
    ref.current.rotation.y = t * 0.5 + phase;
  });
  return (
    <mesh ref={ref} position={position} rotation={[Math.PI / 4, 0, Math.PI / 4]} castShadow>
      <boxGeometry args={[0.9, 0.9, 0.9]} />
      <meshStandardMaterial color={INDIGO} roughness={0.45} emissive={INDIGO} emissiveIntensity={0.45} />
    </mesh>
  );
}

function CityZone() {
  // gęsty klaster wieżowców wokół (0,0) + niska zabudowa dookoła
  const towers: { p: [number, number, number]; s: [number, number, number] }[] = [
    { p: [0, 0, 0], s: [1.8, 6.4, 1.8] },
    { p: [-2.4, 0, 1.6], s: [1.6, 4.2, 1.6] },
    { p: [2.2, 0, -1.8], s: [1.7, 5.2, 1.7] },
    { p: [-1.8, 0, -2.6], s: [1.5, 3.2, 1.5] },
    { p: [2.6, 0, 1.9], s: [1.4, 2.6, 1.4] },
    { p: [-4.4, 0, -0.6], s: [1.3, 2.2, 1.3] },
    { p: [0.4, 0, 3.2], s: [1.3, 1.8, 1.3] },
    { p: [4.6, 0, 0.2], s: [1.2, 1.6, 1.2] },
    { p: [-3.8, 0, 3.4], s: [1.4, 3.6, 1.4] },
    { p: [4.4, 0, -3.2], s: [1.5, 4.4, 1.5] },
    { p: [1.0, 0, -4.6], s: [1.3, 2.6, 1.3] },
    { p: [-6.2, 0, 1.6], s: [1.2, 1.5, 1.2] },
    { p: [6.4, 0, 2.4], s: [1.2, 2.1, 1.2] },
    { p: [-0.9, 0, 5.3], s: [1.2, 1.4, 1.2] },
    { p: [-4.9, 0, -3.9], s: [1.3, 1.9, 1.3] },
    { p: [6.6, 0, -1.6], s: [1.1, 1.3, 1.1] },
    // niskie bloki / pawilony
    { p: [3.5, 0, 4.7], s: [2.4, 0.8, 1.4] },
    { p: [-6.6, 0, -1.9], s: [1.8, 0.9, 1.2] },
    { p: [-2.2, 0, -5.4], s: [2.0, 0.7, 1.3] },
    { p: [7.2, 0, 0.6], s: [1.4, 0.6, 2.0] },
    { p: [-7.8, 0, 3.2], s: [1.5, 0.7, 1.5] },
    { p: [5.6, 0, -5.4], s: [1.7, 1.1, 1.2] },
    { p: [0.4, 0, 7.0], s: [1.3, 0.9, 1.8] },
    { p: [-3.6, 0, 6.4], s: [1.1, 1.6, 1.1] },
    { p: [8.4, 0, -3.0], s: [1.2, 0.8, 1.2] },
    { p: [-8.2, 0, -4.6], s: [1.4, 1.2, 1.4] },
  ];
  return (
    <group>
      {towers.map((t, i) => (
        <group key={i}>
          <Building position={t.p} size={t.s} color={i % 3 === 2 ? BUILDING_DARK : BUILDING} />
          {/* nadbudówki i anteny na wyższych wieżach — łamią monotonię brył */}
          {t.s[1] >= 4 && (
            <>
              <mesh
                position={[t.p[0] + t.s[0] * 0.18, t.s[1] + 0.22, t.p[2] - t.s[2] * 0.15]}
                castShadow
              >
                <boxGeometry args={[t.s[0] * 0.45, 0.44, t.s[2] * 0.45]} />
                <meshStandardMaterial color={BUILDING_DARK} roughness={0.9} />
              </mesh>
              <mesh position={[t.p[0] - t.s[0] * 0.22, t.s[1] + 0.55, t.p[2] + t.s[2] * 0.2]} castShadow>
                <cylinderGeometry args={[0.025, 0.04, 1.1, 6]} />
                <meshStandardMaterial color={BUILDING_DARK} roughness={0.8} />
              </mesh>
            </>
          )}
          {t.s[1] >= 2 && t.s[1] < 4 && (
            <mesh position={[t.p[0], t.s[1] + 0.14, t.p[2]]} castShadow>
              <boxGeometry args={[t.s[0] * 0.4, 0.28, t.s[2] * 0.4]} />
              <meshStandardMaterial color={BUILDING_DARK} roughness={0.9} />
            </mesh>
          )}
          <ShadowBlob position={t.p} radius={Math.max(t.s[0], t.s[2]) * 1.1} />
        </group>
      ))}
      {/* turbiny wiatrowe po prawej */}
      <WindTurbine position={[8.5, 0, 4.5]} />
      <WindTurbine position={[10.5, 0, 2]} />
      <WindTurbine position={[9.5, 0, 6.8]} />
      <WindTurbine position={[12, 0, 5.2]} />
      <WindTurbine position={[11.3, 0, 8.4]} />
      {/* kontenery z tyłu */}
      <ContainerStack position={[-6, 0, 4]} rows={2} cols={3} layers={2} />
      <ContainerStack position={[-8.6, 0, -0.8]} rows={2} cols={2} layers={1} />
    </group>
  );
}

/* Wypełnienie pustki między miastem a fabryką (strefa trasy, x 12–28) */
function RouteZone() {
  return (
    <group>
      <group position={[14, 0, 5.5]}>
        <Building position={[0, 0, 0]} size={[1.6, 1.4, 1.2]} />
        <Building position={[1.9, 0, 0.5]} size={[1.2, 0.8, 1.2]} color={BUILDING_DARK} />
        <ShadowBlob position={[0.8, 0, 0.2]} radius={2} />
      </group>
      <Warehouse position={[20.5, 0, -6]} length={3.4} />
      <ContainerStack position={[25.5, 0, 4.5]} rows={2} cols={3} layers={1} />
      <WindTurbine position={[17.5, 0, 7]} />
      <WindTurbine position={[23.5, 0, -8]} />
      <group position={[27.5, 0, -5]}>
        <Building position={[0, 0, 0]} size={[1.4, 1.1, 1.4]} />
        <ShadowBlob position={[0, 0, 0]} radius={1.3} />
      </group>
    </group>
  );
}

function FactoryZone() {
  return (
    <group position={[34, 0, 0]}>
      {/* hala fabryczna z indygo akcentem */}
      <group position={[-1.5, 0, -1.5]}>
        <Building position={[0, 0, 0]} size={[4.2, 2.4, 3]} />
        <Building position={[0, 2.4, 0.4]} size={[1.6, 0.9, 1.6]} color={BUILDING_DARK} />
        <mesh position={[0, 3.5, 0.4]} rotation={[Math.PI / 4, Math.PI / 4, 0]} castShadow>
          <boxGeometry args={[0.55, 0.55, 0.55]} />
          <meshStandardMaterial color={INDIGO} roughness={0.5} />
        </mesh>
        <ShadowBlob position={[0, 0, 0]} radius={2.8} />
      </group>
      <CoolingTower position={[3.2, 0, 2.4]} />
      <CoolingTower position={[5.6, 0, 0.4]} scale={0.75} />
      <ContainerStack position={[-5.5, 0, 3]} rows={3} cols={4} layers={2} />
      <ContainerStack position={[1.5, 0, -4.5]} rows={2} cols={5} layers={1} />
      <WindTurbine position={[-7, 0, -3]} />
    </group>
  );
}

function WarehouseZone() {
  return (
    <group position={[54, 0, 0]}>
      <Warehouse position={[-3, 0, -2.5]} />
      <Warehouse position={[-3, 0, 0.8]} />
      <Warehouse position={[-3, 0, 4.1]} length={3.6} />
      <Warehouse position={[3.5, 0, -1]} length={5.5} />
      <Warehouse position={[3.5, 0, 2.6]} length={5.5} />
      <ContainerStack position={[8, 0, -4.5]} rows={2} cols={3} layers={3} />
      <ContainerStack position={[-8, 0, 2]} rows={3} cols={2} layers={2} />
      {/* wieża ciśnień */}
      <group position={[7.5, 0, 4.5]}>
        <mesh position={[0, 1.4, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 2.8, 6]} />
          <meshStandardMaterial color={BUILDING_DARK} roughness={0.9} />
        </mesh>
        <mesh position={[0, 3, 0]} castShadow>
          <cylinderGeometry args={[0.7, 0.5, 0.9, 12]} />
          <meshStandardMaterial color={BUILDING} roughness={0.9} />
        </mesh>
        <ShadowBlob position={[0, 0, 0]} radius={0.9} />
      </group>
    </group>
  );
}

function Scene({ progress }: { progress: MotionValue<number> }) {
  return (
    <>
      {/* miękkie wypełnienie + kontrastowy klucz z cieniami + zimny kontr od tyłu */}
      <hemisphereLight args={["#9aa8de", "#0a0a14", 0.72]} />
      <ShadowLight progress={progress} />
      <directionalLight position={[-8, 6, -10]} intensity={0.5} color="#4356a0" />

      {/* podłoże */}
      <mesh position={[36, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[600, 300]} />
        <meshStandardMaterial color={GROUND} roughness={1} />
      </mesh>

      <CityZone />
      <RouteZone />
      <RouteLine progress={progress} />
      <FactoryZone />
      <WarehouseZone />
      <TileGrid position={[74, 0, 0]} progress={progress} />
    </>
  );
}

export default function IsoWorld({ progress }: { progress: MotionValue<number> }) {
  // na telefonach cienie off — oszczędność GPU
  const shadows =
    typeof window === "undefined" || !window.matchMedia("(pointer: coarse)").matches;

  return (
    <Canvas
      orthographic
      shadows={shadows ? { type: THREE.PCFSoftShadowMap } : false}
      dpr={[1, 1.75]}
      camera={{ zoom: 34, position: [15, 17.6, 15], near: -100, far: 400 }}
      gl={{ antialias: true, alpha: false }}
      onCreated={({ gl, scene }) => {
        gl.setClearColor(BG);
        scene.fog = new THREE.Fog(BG, 30, 70);
      }}
      style={{ position: "absolute", inset: 0 }}
      aria-hidden
    >
      <CameraRig progress={progress} />
      <Scene progress={progress} />
    </Canvas>
  );
}
