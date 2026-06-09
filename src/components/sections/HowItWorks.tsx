"use client";

import { useRef, useState, useMemo } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

// ─── Data ────────────────────────────────────────────────────────────────────

const STEPS = [
  { num: "01", title: "Rozmawiamy", desc: "15 minut rozmowy, poznaję Twój biznes i cel strony." },
  { num: "02", title: "Projektuję", desc: "Tworzę układ i wygląd dopasowany do Twojej branży." },
  { num: "03", title: "Buduję", desc: "Koduję stronę używając nowoczesnych narzędzi AI." },
  { num: "04", title: "Publikujesz", desc: "Strona online, klienci mogą Cię znaleźć w Google." },
];

// Camera target Y per step (scenes stacked along -Y axis)
const SCENE_Y = [0, -22, -44, -66];

// Scene 1 — city buildings
const BUILDINGS = [
  { x: -2.4, z: -2.4, h: 1.2, w: 0.7 }, { x: -1.0, z: -2.4, h: 2.5, w: 0.85 },
  { x:  0.5, z: -2.4, h: 1.8, w: 0.7  }, { x:  1.9, z: -2.4, h: 0.9, w: 0.65 },
  { x:  3.0, z: -2.4, h: 1.5, w: 0.7  }, { x: -2.4, z: -0.8, h: 2.0, w: 0.8  },
  { x: -0.8, z: -0.8, h: 3.5, w: 1.0  }, { x:  0.8, z: -0.8, h: 3.0, w: 0.9  },
  { x:  2.4, z: -0.8, h: 1.3, w: 0.7  }, { x: -2.4, z:  0.8, h: 0.9, w: 0.6  },
  { x: -0.8, z:  0.8, h: 2.2, w: 0.8  }, { x:  0.8, z:  0.8, h: 2.6, w: 0.8  },
  { x:  2.4, z:  0.8, h: 1.8, w: 0.7  }, { x: -1.4, z:  2.1, h: 0.8, w: 0.6  },
  { x:  0.2, z:  2.1, h: 1.2, w: 0.7  }, { x:  1.9, z:  2.1, h: 1.0, w: 0.6  },
];

const PEOPLE = [
  { x: -0.1, z: 0.1 }, { x: 1.3, z: -0.2 }, { x: -1.7, z: 1.5 },
  { x: 0.9, z: 1.5 }, { x: 2.8, z: 0.1 },
];

// Pre-built curves for flowing lines
const LINE_CURVES = [
  [[-2.5,1.5,-2],[-0.5,2.2,-0.5],[1.0,1.8,0.5],[2.5,1.2,1.5]] as [number,number,number][],
  [[-1.0,3.1,-1],[0.5,2.0,0],[2.0,1.4,-1],[3.0,0.8,-2]]       as [number,number,number][],
  [[-2.0,1.0,1],[0.0,1.5,0.5],[1.0,2.5,-0.5],[2.0,3.0,-1]]    as [number,number,number][],
].map(pts => {
  const curve = new THREE.CatmullRomCurve3(pts.map(p => new THREE.Vector3(p[0], p[1], p[2])));
  return { curve, points: curve.getPoints(60) };
});

// Scene 2 — dot grid
const S2_DOTS = Array.from({ length: 9 }, (_, r) =>
  Array.from({ length: 9 }, (_, c) => ({ x: (c - 4) * 0.82, z: (r - 4) * 0.82, k: `${r}${c}` }))
).flat();
const S2_CURVE = new THREE.CatmullRomCurve3(
  [[-4,0.1,0],[-2,0.1,-1.5],[0,0.1,0],[2,0.1,1.5],[4,0.1,0]].map(p => new THREE.Vector3(p[0],p[1],p[2]))
);
const S2_CURVE_PTS = S2_CURVE.getPoints(80);

// Scene 3 — tile grid
const S3_TILES = Array.from({ length: 6 }, (_, r) =>
  Array.from({ length: 6 }, (_, c) => {
    const cx = c - 2.5, cz = r - 2.5;
    const dist = Math.sqrt(cx * cx + cz * cz);
    return { x: cx * 1.05, z: cz * 1.05, glow: Math.max(0, 1.2 - dist * 0.42), k: `${r}${c}` };
  })
).flat();

// Scene 4 — diamonds
const DIAMONDS = Array.from({ length: 4 }, (_, i) => {
  const a = (i / 4) * Math.PI * 2;
  return { x: Math.cos(a) * 2.6, z: Math.sin(a) * 2.6 };
});

// ─── Camera rig ───────────────────────────────────────────────────────────────

function CameraRig({ step }: { step: number }) {
  useFrame((state, delta) => {
    const targetY = SCENE_Y[step] + 7;
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, delta * 3.5);
    state.camera.position.x = 8;
    state.camera.position.z = 8;
    state.camera.lookAt(0, state.camera.position.y - 7, 0);
  });
  return null;
}

// ─── Shared lights ────────────────────────────────────────────────────────────

function GlobalLights() {
  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 10, 4]} intensity={0.7} />
      <directionalLight position={[-3, 5, -4]} intensity={0.2} color="#aabbff" />
    </>
  );
}

// ─── Scene 1: City ────────────────────────────────────────────────────────────

function FlowingLine({ curve, pts, speed, offset }: {
  curve: THREE.CatmullRomCurve3;
  pts: THREE.Vector3[];
  speed: number;
  offset: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    const t = ((state.clock.getElapsedTime() * speed + offset) % 1 + 1) % 1;
    const pos = curve.getPoint(t);
    if (groupRef.current) groupRef.current.position.copy(pos);
  });
  return (
    <group>
      <Line points={pts.map(p => [p.x, p.y, p.z] as [number,number,number])} color="#ff4444" lineWidth={2.5} />
      <group ref={groupRef}>
        <mesh><sphereGeometry args={[0.1, 8, 8]} /><meshBasicMaterial color="#ff4444" /></mesh>
        <pointLight color="#ff6666" intensity={1.5} distance={1.5} />
      </group>
    </group>
  );
}

function Scene1({ y }: { y: number }) {
  return (
    <group position={[0, y, 0]}>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#d4e4f0" />
      </mesh>
      {/* Grid lines */}
      {[-3,-1.5,0,1.5,3].map((v,i) => (
        <group key={i}>
          <mesh rotation={[-Math.PI/2,0,0]} position={[v,0.003,0]}><planeGeometry args={[0.01,10]} /><meshBasicMaterial color="#c0d4e8" /></mesh>
          <mesh rotation={[-Math.PI/2,0,0]} position={[0,0.003,v]}><planeGeometry args={[10,0.01]} /><meshBasicMaterial color="#c0d4e8" /></mesh>
        </group>
      ))}
      {/* Buildings */}
      {BUILDINGS.map((b, i) => (
        <mesh key={i} position={[b.x, b.h / 2, b.z]}>
          <boxGeometry args={[b.w, b.h, b.w]} />
          <meshStandardMaterial color="#c8d4e0" flatShading />
        </mesh>
      ))}
      {/* People */}
      {PEOPLE.map((p, i) => (
        <mesh key={i} position={[p.x, 0.25, p.z]}>
          <capsuleGeometry args={[0.08, 0.2, 4, 8]} />
          <meshStandardMaterial color="#7a8fa0" />
        </mesh>
      ))}
      {/* Flowing red lines */}
      {LINE_CURVES.map(({ curve, points }, i) => (
        <FlowingLine key={i} curve={curve} pts={points} speed={0.18 + i * 0.04} offset={i * 0.33} />
      ))}
    </group>
  );
}

// ─── Scene 2: Dot Grid + Blue Line ────────────────────────────────────────────

function Scene2({ y }: { y: number }) {
  const dotRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    const t = (state.clock.getElapsedTime() * 0.28) % 1;
    const pos = S2_CURVE.getPoint(t);
    if (dotRef.current) dotRef.current.position.copy(pos);
  });
  return (
    <group position={[0, y, 0]}>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#d8e6f2" />
      </mesh>
      {/* Dots */}
      {S2_DOTS.map(d => (
        <mesh key={d.k} position={[d.x, 0.05, d.z]}>
          <sphereGeometry args={[0.06, 6, 6]} />
          <meshStandardMaterial color="#9ab0c4" />
        </mesh>
      ))}
      {/* Blue line */}
      <Line points={S2_CURVE_PTS.map(p => [p.x, p.y, p.z] as [number,number,number])} color="#4466ff" lineWidth={3} />
      {/* Traveling dot */}
      <group ref={dotRef}>
        <mesh><sphereGeometry args={[0.15, 12, 12]} /><meshBasicMaterial color="#4466ff" /></mesh>
        <pointLight color="#4488ff" intensity={3} distance={2.5} />
      </group>
      {/* Industrial towers */}
      {[[-3.5,-3.2],[3.5,-3.2]].map(([tx, tz], i) => (
        <group key={i} position={[tx, 0, tz]}>
          <mesh position={[0, 1.5, 0]}><cylinderGeometry args={[0.35, 0.25, 3, 8]} /><meshStandardMaterial color="#b0c4d8" /></mesh>
          <mesh position={[0, 3.1, 0]}><cylinderGeometry args={[0.38, 0.3, 0.25, 8]} /><meshStandardMaterial color="#a0b4c8" /></mesh>
        </group>
      ))}
    </group>
  );
}

// ─── Scene 3: Tile Grid ───────────────────────────────────────────────────────

function Scene3({ y }: { y: number }) {
  const lineRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (lineRef.current) {
      lineRef.current.position.x = -3.5 + ((state.clock.getElapsedTime() * 1.2) % 7);
    }
  });
  return (
    <group position={[0, y, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]}>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#d8e6f2" />
      </mesh>
      {S3_TILES.map(tile => (
        <RoundedBox key={tile.k} args={[0.88, 0.12, 0.88]} radius={0.06} smoothness={3} position={[tile.x, 0, tile.z]}>
          <meshStandardMaterial
            color={tile.glow > 0.3 ? "#4466ff" : "#b8c8d8"}
            emissive={tile.glow > 0.3 ? "#2244cc" : "#000000"}
            emissiveIntensity={tile.glow * 0.7}
          />
        </RoundedBox>
      ))}
      {/* Center figure */}
      <mesh position={[0, 0.32, 0]}>
        <capsuleGeometry args={[0.12, 0.35, 4, 8]} />
        <meshStandardMaterial color="#2244cc" emissive="#2244cc" emissiveIntensity={0.4} />
      </mesh>
      <pointLight position={[0, 2, 0]} color="#4466ff" intensity={2.5} distance={4} />
      {/* Traveling line */}
      <group ref={lineRef}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.035, 0.035, 1.8, 6]} />
          <meshBasicMaterial color="#4466ff" />
        </mesh>
        <pointLight color="#4466ff" intensity={1.5} distance={1.8} />
      </group>
    </group>
  );
}

// ─── Scene 4: Arrow + Diamonds ────────────────────────────────────────────────

function Scene4({ y }: { y: number }) {
  const arrowShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-1.8, -0.27); s.lineTo(0.1, -0.27); s.lineTo(0.1, -0.62);
    s.lineTo(1.8, 0); s.lineTo(0.1, 0.62); s.lineTo(0.1, 0.27);
    s.lineTo(-1.8, 0.27); s.closePath();
    return s;
  }, []);

  const arrowGeo = useMemo(() => new THREE.ExtrudeGeometry(arrowShape, {
    depth: 0.32, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 2,
  }), [arrowShape]);

  const ringRef = useRef<THREE.Group>(null);
  const dotGrid = useMemo(() => Array.from({ length: 7 }, (_, r) =>
    Array.from({ length: 7 }, (_, c) => ({ x: (c-3)*1.1, z: (r-3)*1.1, k:`${r}${c}` }))
  ).flat(), []);

  useFrame((_, delta) => {
    if (ringRef.current) ringRef.current.rotation.y += delta * 0.38;
  });

  return (
    <group position={[0, y, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.45, 0]}>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color="#d8e6f2" />
      </mesh>
      {dotGrid.map(d => (
        <mesh key={d.k} position={[d.x, -0.42, d.z]}>
          <sphereGeometry args={[0.05, 6, 6]} />
          <meshStandardMaterial color="#9ab0c4" />
        </mesh>
      ))}
      {/* Arrow */}
      <mesh geometry={arrowGeo} position={[-1.8, 0.15, -0.16]}>
        <meshStandardMaterial color="#3344cc" emissive="#2233aa" emissiveIntensity={0.25} />
      </mesh>
      {/* Rotating diamonds */}
      <group ref={ringRef}>
        {DIAMONDS.map((d, i) => (
          <mesh key={i} position={[d.x, 0.2, d.z]} rotation={[Math.PI/4, 0, Math.PI/4]}>
            <boxGeometry args={[0.55, 0.55, 0.18]} />
            <meshStandardMaterial color="#3344cc" emissive="#2233aa" emissiveIntensity={0.3} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// ─── Left panel ───────────────────────────────────────────────────────────────

function StepsList({ active }: { active: number }) {
  return (
    <div className="w-full max-w-xs">
      <p className="text-xs font-mono tracking-widest uppercase text-indigo-600 mb-4">Jak to działa</p>
      <h2 className="text-3xl md:text-4xl font-semibold tracking-tight leading-tight text-[#1a2a3a] mb-10">
        Prosta droga<br /><span className="text-[#6080a0]">do Twojej strony</span>
      </h2>
      <div className="space-y-6">
        {STEPS.map((step, i) => {
          const on = i === active;
          return (
            <motion.div key={i} animate={{ opacity: on ? 1 : 0.38 }} transition={{ duration: 0.35 }} className="flex gap-4 items-start">
              {/* Number badge */}
              <motion.div
                animate={{ backgroundColor: on ? "#ffffff" : "transparent", borderColor: on ? "#6366f1" : "#c8d8e8" }}
                transition={{ duration: 0.3 }}
                className="flex-shrink-0 w-9 h-9 rounded-lg border-2 flex items-center justify-center"
              >
                <span className={`text-xs font-mono font-bold ${on ? "text-indigo-600" : "text-[#6080a0]"}`}>{step.num}</span>
              </motion.div>
              {/* Content */}
              <div>
                <motion.p
                  animate={{ fontSize: on ? "1.2rem" : "0.95rem" }}
                  transition={{ duration: 0.3 }}
                  className="font-semibold text-[#1a2a3a] leading-snug"
                >
                  {step.title}
                </motion.p>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div
                      key="desc"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="mt-2 pl-3 border-l-2 border-indigo-400">
                        <p className="text-sm text-[#4a6070] leading-relaxed">{step.desc}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Mobile fallback ──────────────────────────────────────────────────────────

function MobileSteps() {
  return (
    <section className="md:hidden py-20 px-6" style={{ background: "linear-gradient(to bottom, #dce6f0, #e8eef4)" }}>
      <p className="text-xs font-mono tracking-widest uppercase text-indigo-600 mb-3">Jak to działa</p>
      <h2 className="text-3xl font-semibold tracking-tight text-[#1a2a3a] mb-10">
        Prosta droga<br /><span className="text-[#6080a0]">do Twojej strony</span>
      </h2>
      <div className="space-y-7">
        {STEPS.map((s, i) => (
          <div key={i} className="flex gap-4">
            <div className="flex-shrink-0 w-9 h-9 rounded-lg border-2 border-indigo-300 bg-white flex items-center justify-center">
              <span className="text-xs font-mono font-bold text-indigo-600">{s.num}</span>
            </div>
            <div>
              <p className="font-semibold text-[#1a2a3a]">{s.title}</p>
              <p className="text-sm text-[#4a6070] mt-1">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function HowItWorks() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActiveStep(Math.min(Math.floor(v * 4), 3));
  });

  return (
    <>
      <MobileSteps />

      {/* Dark → light transition */}
      <div className="hidden md:block h-20 bg-gradient-to-b from-[#0d0d0d] to-[#dce6f0]" />

      {/* Desktop sticky scroll */}
      <div ref={wrapperRef} className="hidden md:block relative" style={{ height: "500vh" }}>
        <div
          className="sticky top-0 h-screen flex overflow-hidden"
          style={{ background: "linear-gradient(135deg, #dce6f0 0%, #e8eef4 100%)" }}
        >
          {/* LEFT: Steps */}
          <div className="w-[38%] flex items-center justify-end pr-8 lg:pr-14 xl:pr-20 z-10">
            <StepsList active={activeStep} />
          </div>

          {/* Divider */}
          <div className="w-px bg-[#c8d8e8] self-stretch my-16" />

          {/* RIGHT: 3D Canvas */}
          <div className="flex-1 relative">
            <Canvas
              orthographic
              camera={{ zoom: 48, near: 0.1, far: 300, position: [8, 7, 8] }}
              gl={{ alpha: true, antialias: true }}
              style={{ background: "transparent" }}
            >
              <CameraRig step={activeStep} />
              <GlobalLights />
              <Scene1 y={SCENE_Y[0]} />
              <Scene2 y={SCENE_Y[1]} />
              <Scene3 y={SCENE_Y[2]} />
              <Scene4 y={SCENE_Y[3]} />
            </Canvas>

            {/* Step label */}
            <div className="absolute bottom-10 left-8 pointer-events-none">
              <AnimatePresence mode="wait">
                <motion.p
                  key={activeStep}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="text-xs font-mono text-[#6080a0]"
                >
                  {STEPS[activeStep].num} — {STEPS[activeStep].title}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Scroll hint */}
            <AnimatePresence>
              {activeStep === 0 && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute bottom-10 right-8 flex items-center gap-1.5 text-xs text-[#8a9ab0] pointer-events-none"
                >
                  <motion.span animate={{ y: [0, 4, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>↓</motion.span>
                  przewiń
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Light → dark transition */}
      <div className="hidden md:block h-20 bg-gradient-to-b from-[#e8eef4] to-[#0d0d0d]" />
    </>
  );
}
