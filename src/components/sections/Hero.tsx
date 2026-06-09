"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const WA_LINK = "https://wa.me/48TWOJNUMER";
const WORDS = "Twoja firma zasługuje na stronę, która sprzedaje.".split(" ");

// ─── Deterministic city data (no Math.random in render) ───────────────────────

function srand(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

const BCOLORS = [
  "#1e2840", "#212e4a", "#253354", "#2a3a58", "#1c2639", "#243050",
];

const CITY_BUILDINGS = Array.from({ length: 49 }, (_, i) => {
  const ix = (i % 7) - 3;
  const iz = Math.floor(i / 7) - 3;
  if (Math.abs(ix) <= 1 && Math.abs(iz) <= 1) return null;
  const h = 1.2 + srand(ix * 13 + iz * 7) * 5.5;
  const color = BCOLORS[Math.abs(ix * 3 + iz * 7) % BCOLORS.length];
  return { x: ix * 2.0, z: iz * 2.0, h, color };
}).filter(Boolean) as Array<{ x: number; z: number; h: number; color: string }>;

const PEOPLE: [number, number, number][] = [
  [1.0, 0, 1.5],
  [-1.2, 0, 0.6],
  [0.6, 0, -1.8],
  [-0.5, 0, -1.0],
  [1.8, 0, -0.4],
];

const TOWERS: [number, number, number][] = [
  [-7, 0, -7],
  [7, 0, 7],
  [-7, 0, 7],
  [7, 0, -7],
];

// ─── Camera look-at ───────────────────────────────────────────────────────────

function CameraSetup() {
  const { camera } = useThree();
  useEffect(() => {
    camera.lookAt(0, 0, 0);
  }, [camera]);
  return null;
}

// ─── City mesh ────────────────────────────────────────────────────────────────

function CityScene() {
  const groupRef = useRef<THREE.Group>(null!);

  const geometries = useMemo(
    () =>
      CITY_BUILDINGS.map(({ h }) => {
        const box = new THREE.BoxGeometry(1.2, h, 1.2);
        return { box, edges: new THREE.EdgesGeometry(box) };
      }),
    [],
  );

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const s = groupRef.current.scale.y;
    if (s < 0.998) {
      groupRef.current.scale.y = THREE.MathUtils.lerp(s, 1, delta * 1.4);
    } else {
      groupRef.current.scale.y = 1;
    }
  });

  return (
    <group ref={groupRef} scale={[1, 0.001, 1]}>
      {/* Base plate */}
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[20, 0.1, 20]} />
        <meshStandardMaterial color="#1a2236" />
      </mesh>

      {/* Buildings */}
      {CITY_BUILDINGS.map(({ x, z, h, color }, i) => (
        <group key={i} position={[x, h / 2, z]}>
          <mesh geometry={geometries[i].box}>
            <meshStandardMaterial color={color} flatShading />
          </mesh>
          <lineSegments geometry={geometries[i].edges}>
            <lineBasicMaterial color="#6366f1" transparent opacity={0.4} />
          </lineSegments>
        </group>
      ))}

      {/* People */}
      {PEOPLE.map((pos, i) => (
        <mesh key={i} position={[pos[0], 0.55, pos[2]]}>
          <capsuleGeometry args={[0.12, 0.45, 4, 8]} />
          <meshStandardMaterial color="#4a5568" />
        </mesh>
      ))}

      {/* Antenna towers */}
      {TOWERS.map((pos, i) => (
        <mesh key={i} position={[pos[0], 3.5, pos[2]]}>
          <cylinderGeometry args={[0.1, 0.15, 7, 8]} />
          <meshStandardMaterial color="#2d3f60" />
        </mesh>
      ))}
    </group>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

export default function Hero() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ background: "#080b14" }}
    >
      {/* 3D canvas — fills entire section behind text */}
      <div className="absolute inset-0 z-0">
        <Canvas
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
          camera={{ fov: 45, position: [0, 20, 26], near: 0.1, far: 120 }}
        >
          <CameraSetup />
          <ambientLight intensity={0.4} color="#ffffff" />
          <directionalLight position={[5, 10, 5]} intensity={0.8} color="#ffffff" />
          <pointLight position={[0, 5, 0]} color="#6366f1" intensity={2} />
          <pointLight position={[-5, 3, -5]} color="#3b82f6" intensity={1} />
          <fog attach="fog" args={["#080b14", 28, 55]} />
          <CityScene />
        </Canvas>
      </div>

      {/* Gradient vignette — dark top for text, dark bottom for transition */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, #080b14 0%, rgba(8,11,20,0.55) 22%, transparent 44%, transparent 62%, #080b14 100%)",
        }}
      />

      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "backdrop-blur-md bg-[#080b14]/80 border-b border-white/[0.06]"
            : ""
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="font-semibold text-white text-base tracking-tight">
            DreamPageStudio
          </span>
          <div className="hidden sm:flex items-center gap-6">
            <a
              href="#oferta"
              className="text-sm text-[#94a3b8] hover:text-white transition-colors"
            >
              Oferta
            </a>
            <a
              href="#faq"
              className="text-sm text-[#94a3b8] hover:text-white transition-colors"
            >
              FAQ
            </a>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition-colors text-white text-sm font-medium"
            >
              Napisz na WhatsApp
            </a>
          </div>
        </div>
      </nav>

      {/* Text content — centered, sits above the city */}
      <div className="relative z-20 flex flex-col items-center justify-center flex-1 min-h-screen px-6 text-center pb-32">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-sm mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          Strony od 599 zł &middot; Gotowe w 5 dni
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-white max-w-4xl leading-[1.1] mb-6">
          {WORDS.map((word, i) => (
            <motion.span
              key={i}
              className="inline-block mr-[0.22em] last:mr-0"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.25 + i * 0.07,
                duration: 0.5,
                ease: "easeOut",
              }}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="text-lg md:text-xl text-[#94a3b8] max-w-xl mb-10 leading-relaxed"
        >
          Profesjonalne strony internetowe od 599 zł. Gotowe w 5 dni.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.5 }}
        >
          <motion.a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="relative inline-flex items-center px-8 py-4 rounded-xl bg-indigo-600 text-white font-semibold text-lg overflow-hidden"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2 }}
          >
            <motion.span
              className="absolute inset-0 bg-indigo-400/30 rounded-xl"
              animate={{ opacity: [0, 0.6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="relative">Napisz na WhatsApp →</span>
          </motion.a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-px h-10 bg-gradient-to-b from-transparent to-[#4b5563]" />
        <div className="w-1.5 h-1.5 rounded-full bg-[#4b5563]" />
      </motion.div>
    </section>
  );
}
