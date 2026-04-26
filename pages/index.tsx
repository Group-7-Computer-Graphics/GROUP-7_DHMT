import React, { useState, useEffect, Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import { Stars, PerspectiveCamera, OrbitControls, Line } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
// @ts-ignore
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { HUDControls } from "../src/components/HUDControls";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { AsteroidBelt } from "../src/components/AsteroidBelt";

//Trang thêm
import Head from 'next/head';
//======


import Sun from "../src/components/planets/Sun";
import Earth from "../src/components/planets/Earth";
import Mars from "../src/components/planets/Mars";
import Jupiter from "../src/components/planets/Jupiter";
import Saturn from "../src/components/planets/saturn";
import Mercury from "../src/components/planets/mecury";
import Neptune from "../src/components/planets/neptune";
import Uranus from "../src/components/planets/uranus";
import Venus from "../src/components/planets/venus";

// ─── DỮ LIỆU HÀNH TINH ────────────────────────────────────────────────────────
const planetData: Record<string, any> = {
  "#mercury": {
    name: " MERCURY", type: "PLANET",
    visit: "Mercury is the smallest planet in our solar system and the closest to the Sun. It experiences extreme temperature fluctuations, freezing at night and scorching during the day.",
    encyclopedia: "A terrestrial planet with a heavily cratered surface, much like Earth's Moon. It has no moons and almost no atmosphere to retain heat.",
    structure: "Mercury has a large, dense metallic core that makes up about 85% of its radius, surrounded by a rocky mantle and a thin solid crust.",
    question: "Hành tinh nào gần Mặt Trời nhất?",
    options: ["A. Sao Kim", "B. Sao Thủy", "C. Sao Hỏa", "D. Sao Mộc"],
    correctAnswer: 1,
  },
  "#venus": {
    name: "VENUS", type: "PLANET",
    visit: "Often called Earth's twin due to its similar size, but its surface is a toxic, superheated wasteland with crushing atmospheric pressure.",
    encyclopedia: "The second planet from the Sun, featuring a thick atmosphere rich in carbon dioxide and clouds of sulfuric acid that trap heat in a runaway greenhouse effect.",
    structure: "Similar to Earth, Venus has an iron core, a rocky mantle, and a silicate crust. Its surface is dominated by volcanic features.",
    question: "Hành tinh nào nóng nhất hệ Mặt Trời?",
    options: ["A. Sao Thủy", "B. Trái Đất", "C. Sao Kim", "D. Sao Hỏa"],
    correctAnswer: 2,
  },
  "#earth": {
    name: "EARTH", type: "PLANET",
    visit: "Our home planet, the third from the Sun, and the only place we know of so far that's inhabited by living things.",
    encyclopedia: "Earth is a water world with 71% of its surface covered by oceans. It has a dynamic atmosphere that sustains life and protects us from meteoroids.",
    structure: "Earth is composed of four main layers: a solid inner core, a liquid outer core, a thick rocky mantle, and a rocky crust.",
    question: "Hành tinh nào chúng ta đang sống?",
    options: ["A. Sao Hỏa", "B. Trái Đất", "C. Sao Kim", "D. Sao Thổ"],
    correctAnswer: 1,
  },
  "#mars": {
    name: "MARS", type: "PLANET",
    visit: "The Red Planet, a dusty, cold, desert world with a very thin atmosphere. It is one of the most explored bodies in our solar system.",
    encyclopedia: "The fourth planet from the Sun. It features surface elements reminiscent of both the impact craters of the Moon and the valleys, deserts, and polar ice caps of Earth.",
    structure: "Mars has a dense core of iron, nickel, and sulfur, surrounded by a rocky mantle and a crust made of volcanic rock. Its red color comes from iron oxide (rust).",
    question: "Hành tinh nào được gọi là \"hành tinh đỏ\"?",
    options: ["A. Sao Mộc", "B. Sao Hỏa", "C. Sao Kim", "D. Sao Thủy"],
    correctAnswer: 1,
  },
  "#jupiter": {
    name: "JUPITER", type: "GAS GIANT",
    visit: "The largest planet in our solar system. It is a massive gas giant with swirling cloud stripes and massive storms, including the Great Red Spot.",
    encyclopedia: "The fifth planet from the Sun. It has dozens of moons and a dark, barely-visible ring system. It acts as a massive vacuum cleaner for the solar system.",
    structure: "Primarily composed of hydrogen and helium. It lacks a well-defined solid surface, transitioning gradually from gas to a vast ocean of liquid metallic hydrogen.",
    question: "Hành tinh nào lớn nhất hệ Mặt Trời?",
    options: ["A. Sao Thổ", "B. Sao Hải Vương", "C. Sao Mộc", "D. Sao Thiên Vương"],
    correctAnswer: 2,
  },
  "#saturn": {
    name: "SATURN", type: "GAS GIANT",
    visit: "Adorned with a dazzling, complex system of icy rings, Saturn is widely considered the most beautiful planet in our solar system.",
    encyclopedia: "The sixth planet from the Sun and the second-largest. It is a gas giant with an extensive moon system, including Titan, which has its own thick atmosphere.",
    structure: "Made mostly of hydrogen and helium. It likely has a dense, rocky core surrounded by a deep layer of liquid metallic hydrogen.",
    question: "Hành tinh nào có vành đai nổi bật nhất?",
    options: ["A. Sao Mộc", "B. Sao Thổ", "C. Sao Kim", "D. Sao Hỏa"],
    correctAnswer: 1,
  },
  "#uranus": {
    name: "URANUS", type: "ICE GIANT",
    visit: "An ice giant that is unique because it rotates on its side. It has a distinct pale blue-green color.",
    encyclopedia: "The seventh planet from the Sun. It was the first planet found with the aid of a telescope. It has 27 known moons and faint rings.",
    structure: "Mostly composed of flowing icy materials (water, ammonia, methane) above a small rocky core. Its atmosphere contains hydrogen, helium, and methane.",
    question: "Hành tinh nào có màu xanh do khí methane?",
    options: ["A. Sao Kim", "B. Sao Thiên Vương", "C. Sao Hỏa", "D. Sao Thủy"],
    correctAnswer: 1,
  },
  "#neptune": {
    name: "NEPTUNE", type: "ICE GIANT",
    visit: "Dark, cold, and whipped by supersonic winds, Neptune is the last of the major planets in our solar system.",
    encyclopedia: "The eighth and most distant major planet orbiting our Sun. It is an ice giant with a faint ring system and 14 known moons.",
    structure: "Its structure is similar to Uranus, consisting of a hot, dense fluid or 'icy' mantle (water, ammonia, and methane) over an Earth-sized solid core.",
    question: "Hành tinh xa Mặt Trời nhất là gì?",
    options: ["A. Sao Thiên Vương", "B. Sao Hải Vương", "C. Sao Thổ", "D. Sao Mộc"],
    correctAnswer: 1,
  },
};

// ─── CẤU HÌNH QUỸ ĐẠO ────────────────────────────────────────────────────────
// ✅ BỎ ufoOffset (UFO giờ đứng thẳng trên hành tinh)
// ✅ THÊM ufoScale cho từng hành tinh để kích thước phù hợp
const ORBIT_CONFIG: Record<
  string,
  {
    radius: number;
    speed: number;
    camOffset: [number, number, number];
    ufoHeight: number;
    ufoScale: number;
  }
> = {
  "#mercury": { radius: 80,   speed: 0.50, camOffset: [0, 10, 30],  ufoHeight: 7,  ufoScale: 0.22 },
  "#venus":   { radius: 140,  speed: 0.35, camOffset: [0, 10, 35],  ufoHeight: 9,  ufoScale: 0.26 },
  "#earth":   { radius: 210,  speed: 0.25, camOffset: [0, 10, 35],  ufoHeight: 10, ufoScale: 0.26 },
  "#mars":    { radius: 300,  speed: 0.20, camOffset: [0, 10, 35],  ufoHeight: 8,  ufoScale: 0.22 },
  "#jupiter": { radius: 480,  speed: 0.10, camOffset: [0, 30, 100], ufoHeight: 32, ufoScale: 0.75 },
  "#saturn":  { radius: 680,  speed: 0.08, camOffset: [0, 30, 100], ufoHeight: 36, ufoScale: 0.75 },
  "#uranus":  { radius: 880,  speed: 0.05, camOffset: [0, 20, 80],  ufoHeight: 22, ufoScale: 0.42 },
  "#neptune": { radius: 1050, speed: 0.03, camOffset: [0, 20, 80],  ufoHeight: 20, ufoScale: 0.38 },
};

// ─── NÚT BẤM PHONG CÁCH VIỄN TƯỞNG ─────────────────────────────────────────
function MenuButton({
  text,
  onClick,
  highlight = false,
}: {
  text: string;
  onClick?: () => void;
  highlight?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "16px 20px",
        backgroundColor: highlight ? "rgba(0, 243, 255, 0.15)" : "rgba(0, 0, 0, 0.4)",
        border: "none",
        borderLeft: `3px solid ${highlight ? "#00f3ff" : "rgba(0, 243, 255, 0.3)"}`,
        borderRight: "1px solid rgba(0, 243, 255, 0.1)",
        color: highlight ? "#fff" : "#b3e5fc",
        fontSize: "14px",
        fontWeight: "bold",
        letterSpacing: "3px",
        cursor: "pointer",
        textAlign: "left",
        textTransform: "uppercase",
        clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)",
        transition: "all 0.3s ease",
        boxShadow: highlight ? "inset 0 0 15px rgba(0, 243, 255, 0.2)" : "none",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "rgba(0, 243, 255, 0.25)";
        e.currentTarget.style.color = "#fff";
        e.currentTarget.style.borderLeft = "3px solid #00f3ff";
        e.currentTarget.style.boxShadow = "inset 0 0 15px rgba(0, 243, 255, 0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = highlight
          ? "rgba(0, 243, 255, 0.15)"
          : "rgba(0, 0, 0, 0.4)";
        e.currentTarget.style.color = highlight ? "#fff" : "#b3e5fc";
        e.currentTarget.style.borderLeft = `3px solid ${
          highlight ? "#00f3ff" : "rgba(0, 243, 255, 0.3)"
        }`;
        e.currentTarget.style.boxShadow = highlight
          ? "inset 0 0 15px rgba(0, 243, 255, 0.2)"
          : "none";
      }}
    >
      {text}
    </button>
  );
}

// ─── BẢNG THÔNG TIN ───────────────────────────────────────────────────────────
function PlanetInfoPanel({
  currentHash,
  onCorrect,
  onWrong,
}: {
  currentHash: string;
  onCorrect: () => void;
  onWrong: () => void;
}) {
  const [activeView, setActiveView] = useState<string>("menu");
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const data = planetData[currentHash];

  useEffect(() => {
    setActiveView("menu");
    setSelectedAnswer(null);
  }, [currentHash]);

  if (!data) return null;

  const handleAnswerClick = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    if (index === data.correctAnswer) {
      setTimeout(() => onCorrect(), 1500);
    } else {
      onWrong();
      setTimeout(() => setSelectedAnswer(null), 800);
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentHash}
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -300, opacity: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        style={{
          position: "absolute",
          top: "8%",
          left: "60px",
          width: "380px",
          zIndex: 10,
          color: "white",
          fontFamily: "sans-serif",
          background: `repeating-linear-gradient(0deg, rgba(0,0,0,0.1), rgba(0,0,0,0.1) 1px, transparent 1px, transparent 2px),
            linear-gradient(135deg, rgba(2,11,26,0.85) 0%, rgba(0,34,68,0.6) 100%)`,
          border: "1px solid rgba(0, 243, 255, 0.3)",
          borderTop: "3px solid #00f3ff",
          borderBottom: "3px solid #00f3ff",
          boxShadow:
            "0 0 40px rgba(0, 243, 255, 0.2), inset 0 0 20px rgba(0, 243, 255, 0.1)",
          borderRadius: "4px",
          padding: "30px",
          backdropFilter: "blur(15px)",
          clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 25px), calc(100% - 25px) 100%, 0 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "10px",
            color: "#00f3ff",
            marginBottom: "15px",
            opacity: 0.8,
            letterSpacing: "2px",
            textTransform: "uppercase",
          }}
        >
          <span>SYS.DAT // {currentHash.replace("#", "")}</span>
          <span>[ UFO LINKED ]</span>
        </div>

        <div
          style={{
            textAlign: "center",
            marginBottom: "30px",
            borderBottom: "1px dashed rgba(0, 243, 255, 0.4)",
            paddingBottom: "15px",
            position: "relative",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "44px",
              fontWeight: "900",
              letterSpacing: "6px",
              color: "#e0f7fa",
              textShadow: "0 0 20px #00f3ff, 0 0 40px #00f3ff",
            }}
          >
            {data.name}
          </h1>
          <p style={{ margin: "5px 0 0 0", fontSize: "14px", color: "#00f3ff", letterSpacing: "8px" }}>
            {data.type}
          </p>
          <div
            style={{
              position: "absolute",
              bottom: "-3px",
              left: "0",
              width: "5px",
              height: "5px",
              backgroundColor: "#00f3ff",
              boxShadow: "0 0 10px #00f3ff",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-3px",
              right: "0",
              width: "5px",
              height: "5px",
              backgroundColor: "#00f3ff",
              boxShadow: "0 0 10px #00f3ff",
            }}
          />
        </div>

        {activeView === "menu" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <MenuButton text="VISIT"           onClick={() => setActiveView("visit")} />
            <MenuButton text="ENCYCLOPEDIA"    onClick={() => setActiveView("encyclopedia")} />
            <MenuButton text="STRUCTURE"       onClick={() => setActiveView("structure")} />
            <MenuButton text="QUESTION (QUIZ)" highlight onClick={() => setActiveView("quiz")} />
          </motion.div>
        )}

        {["visit", "encyclopedia", "structure"].includes(activeView) && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h3
              style={{
                marginTop: 0,
                color: "#00f3ff",
                fontSize: "16px",
                textTransform: "uppercase",
                letterSpacing: "2px",
              }}
            >
              {activeView}
            </h3>
            <p
              style={{
                fontSize: "15px",
                lineHeight: "1.6",
                color: "#d0e8f2",
                marginBottom: "25px",
                fontWeight: "300",
              }}
            >
              {data[activeView]}
            </p>
            <MenuButton text="BACK TO MENU" onClick={() => setActiveView("menu")} highlight />
          </motion.div>
        )}

        {activeView === "quiz" && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <h3
              style={{
                marginTop: 0,
                color: "#00f3ff",
                fontSize: "16px",
                textTransform: "uppercase",
              }}
            >
              Quiz / System Test
            </h3>
            <p style={{ fontSize: "16px", lineHeight: "1.5", marginBottom: "20px", color: "#e0f7fa" }}>
              {data.question}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
              {data.options.map((option: string, index: number) => {
                let bgColor = "rgba(0,0,0,0.4)";
                let borderColor = "rgba(0, 243, 255, 0.2)";
                let textColor = "white";
                if (selectedAnswer !== null) {
                  if (index === data.correctAnswer) {
                    bgColor = "rgba(0,255,0,0.2)";
                    borderColor = "#00ff00";
                    textColor = "#00ff00";
                  } else if (index === selectedAnswer) {
                    bgColor = "rgba(255,0,0,0.4)";
                    borderColor = "#ff0000";
                    textColor = "#ff0000";
                  }
                }
                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerClick(index)}
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      backgroundColor: bgColor,
                      border: `1px solid ${borderColor}`,
                      color: textColor,
                      cursor: selectedAnswer === null ? "pointer" : "default",
                      borderRadius: "4px",
                      transition: "all 0.3s",
                      clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)",
                    }}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            {selectedAnswer !== null && (
              <MenuButton
                text="BACK TO MENU"
                onClick={() => { setActiveView("menu"); setSelectedAnswer(null); }}
                highlight
              />
            )}
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

// ─── ĐƯỜNG QUỸ ĐẠO ───────────────────────────────────────────────────────────
function OrbitLine({ radius }: { radius: number }) {
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 128; i++) {
      const angle = (i / 128) * 2 * Math.PI;
      pts.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
    }
    return pts;
  }, [radius]);
  return <Line points={points} color="white" lineWidth={1} transparent opacity={0.25} />;
}

// ─── TRỤC QUAY CHO HÀNH TINH ─────────────────────────────────────────────────
// ✅ FIX: Lưu góc tích lũy vào anglesRef để UFO đọc cùng góc với hành tinh
function OrbitGroup({
  speed,
  children,
  planetHash,
  anglesRef,
}: {
  speed: number;
  children: React.ReactNode;
  planetHash?: string;
  anglesRef?: React.MutableRefObject<Record<string, number>>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    if (planetHash && anglesRef) {
      // Tích lũy góc giống như UFO sẽ đọc
      anglesRef.current[planetHash] = (anglesRef.current[planetHash] ?? 0) + speed * delta;
      groupRef.current.rotation.y = anglesRef.current[planetHash];
    } else {
      groupRef.current.rotation.y += speed * delta;
    }
  });
  return <group ref={groupRef}>{children}</group>;
}

// ─── ĐUÔI SÁNG UFO — KIỂU PHUN LỬA TÊN LỬA ──────────────────────────────────
// ✅ THAY THẾ UFOTrail + UFOLightning bằng hiệu ứng phun lửa hình nón
const TRAIL_RAW_MAX  = 80;   // độ sâu tối đa của ring buffer
const TRAIL_STEPS    = 50;   // số điểm sau khi smooth bằng CatmullRom
const TRAIL_MAX_W    = 2.8;  // bán kính tối đa của nón ở đuôi (world units)
const TRAIL_OUTER_N  = 4;    // số đường outer (N/S/E/W)

function RocketTrail({
  posRef,
  velRef,
  currentHash,
}: {
  posRef: React.MutableRefObject<THREE.Vector3>;
  velRef: React.MutableRefObject<THREE.Vector3>;
  currentHash: string;
}) {
  // ── Ring buffer vị trí thô ──────────────────────────────────────────────
  const rawBuffer = useRef<THREE.Vector3[]>(
    Array.from({ length: TRAIL_RAW_MAX }, () => new THREE.Vector3())
  );
  const rawCount       = useRef(0);
  const lastRecordedPos = useRef(new THREE.Vector3(Infinity, Infinity, Infinity));

  // ── CatmullRom curve (tái sử dụng, không new mỗi frame) ────────────────
  const curve = useMemo(() => new THREE.CatmullRomCurve3([], false, "catmullrom", 0.5), []);

  // ── Scratch vectors (tránh GC trong hot path) ───────────────────────────
  const _vel   = useRef(new THREE.Vector3());
  const _perpA = useRef(new THREE.Vector3());
  const _perpB = useRef(new THREE.Vector3());
  const _pt    = useRef(new THREE.Vector3());
  const outerDirs = useRef<THREE.Vector3[]>(
    Array.from({ length: TRAIL_OUTER_N }, () => new THREE.Vector3())
  );

  // ── Helper tạo geometry với position + color ────────────────────────────
  const makeGeo = (n: number) => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    g.setAttribute("color",    new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    g.setDrawRange(0, 0);
    return g;
  };

  // ── Geometries: 1 core + TRAIL_OUTER_N outer lines ──────────────────────
  const coreGeo   = useMemo(() => makeGeo(TRAIL_STEPS), []);
  const outerGeos = useMemo(
    () => Array.from({ length: TRAIL_OUTER_N }, () => makeGeo(TRAIL_STEPS)),
    []
  );

  // ── Materials ────────────────────────────────────────────────────────────
  const coreMat = useMemo(() => new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }), []);

  const outerMat = useMemo(() => new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.55,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }), []);

  // ── Reset khi đổi hành tinh ──────────────────────────────────────────────
  useEffect(() => {
    rawCount.current = 0;
    lastRecordedPos.current.set(Infinity, Infinity, Infinity);
    coreGeo.setDrawRange(0, 0);
    outerGeos.forEach((g) => g.setDrawRange(0, 0));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentHash]);

  // ── Frame loop ────────────────────────────────────────────────────────────
  useFrame(({ clock }) => {
    const worldPos = posRef.current;
    if (!worldPos) return;

    const t     = clock.getElapsedTime();
    const speed = velRef.current.length();

    // Chỉ ghi điểm mới khi UFO di chuyển đủ xa (giảm jitter lúc đứng yên)
    const MIN_DIST = 0.04;
    if (worldPos.distanceTo(lastRecordedPos.current) > MIN_DIST) {
      if (rawCount.current < TRAIL_RAW_MAX) {
        rawBuffer.current[rawCount.current].copy(worldPos);
        rawCount.current++;
      } else {
        for (let i = 0; i < TRAIL_RAW_MAX - 1; i++) {
          rawBuffer.current[i].copy(rawBuffer.current[i + 1]);
        }
        rawBuffer.current[TRAIL_RAW_MAX - 1].copy(worldPos);
      }
      lastRecordedPos.current.copy(worldPos);
    }

    if (rawCount.current < 3) return;

    // Chiều dài trail tỉ lệ với tốc độ
    const speedRatio  = Math.min(speed / 0.35, 1.0);
    const targetDepth = Math.max(6, Math.round(6 + speedRatio * (TRAIL_RAW_MAX - 6)));
    const usedCount   = Math.min(rawCount.current, targetDepth);
    const offset      = rawCount.current - usedCount;

    // activePts[0] = cũ nhất (đuôi), activePts[last] = UFO (mới nhất)
    const activePts = rawBuffer.current.slice(offset, rawCount.current);
    if (activePts.length < 3) return;

    curve.points = activePts;
    const steps = Math.min(TRAIL_STEPS, activePts.length * 4);

    // ── Tính hướng vuông góc với vận tốc UFO ────────────────────────────
    _vel.current.copy(velRef.current);
    const velLen = _vel.current.length();
    if (velLen < 0.0005) return;
    _vel.current.divideScalar(velLen);

    // Chọn vector "up" tham chiếu không song song với vận tốc
    const refUp = Math.abs(_vel.current.y) < 0.95
      ? new THREE.Vector3(0, 1, 0)
      : new THREE.Vector3(1, 0, 0);

    _perpA.current.crossVectors(_vel.current, refUp).normalize();
    _perpB.current.crossVectors(_vel.current, _perpA.current).normalize();

    // 4 hướng: +A, -A, +B, -B (tạo hình nón có tiết diện vuông)
    outerDirs.current[0].copy(_perpA.current);
    outerDirs.current[1].copy(_perpA.current).negate();
    outerDirs.current[2].copy(_perpB.current);
    outerDirs.current[3].copy(_perpB.current).negate();

    // ── Ghi core line (đường trung tâm sáng) ─────────────────────────────
    //    u = 0 → đuôi (cũ nhất), u = 1 → UFO (mới nhất)
    const corePosAttr = coreGeo.attributes.position as THREE.BufferAttribute;
    const coreColAttr = coreGeo.attributes.color    as THREE.BufferAttribute;

    for (let i = 0; i < steps; i++) {
      const u  = i / (steps - 1);         // 0 = đuôi, 1 = UFO
      const pt = curve.getPoint(u, _pt.current);
      // Độ sáng: mạnh gần UFO, tắt ở đuôi
      const alpha = Math.pow(u, 0.9);

      corePosAttr.setXYZ(i, pt.x, pt.y, pt.z);
      // Màu: trắng-cyan sáng gần UFO → cyan tối ở đuôi
      coreColAttr.setXYZ(i, alpha * 0.85, alpha * 0.98, alpha * 1.0);
    }
    coreGeo.setDrawRange(0, steps);
    corePosAttr.needsUpdate = true;
    coreColAttr.needsUpdate = true;

    // ── Ghi outer lines (hình nón mở rộng về phía đuôi) ──────────────────
    outerGeos.forEach((geo, di) => {
      const dir     = outerDirs.current[di];
      const posAttr = geo.attributes.position as THREE.BufferAttribute;
      const colAttr = geo.attributes.color    as THREE.BufferAttribute;

      for (let i = 0; i < steps; i++) {
        const u  = i / (steps - 1);       // 0 = đuôi, 1 = UFO
        const pt = curve.getPoint(u, _pt.current);

        // Bán kính nón: lớn ở đuôi (u=0), thu về 0 ở UFO (u=1)
        const coneU  = 1 - u;
        const radius = TRAIL_MAX_W * Math.pow(coneU, 0.60);
        // Shimmer nhẹ theo thời gian
        const shimmer = 1.0 + 0.06 * Math.sin(t * 18 + i * 0.6 + di * 1.57);

        const ox = dir.x * radius * shimmer;
        const oy = dir.y * radius * shimmer;
        const oz = dir.z * radius * shimmer;

        posAttr.setXYZ(i, pt.x + ox, pt.y + oy, pt.z + oz);

        // Màu outer: cyan nhạt, mờ dần về đuôi
        const alpha = Math.pow(u, 1.1) * 0.55;
        colAttr.setXYZ(i, alpha * 0.05, alpha * 0.72, alpha * 1.0);
      }

      geo.setDrawRange(0, steps);
      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;
    });
  });

  return (
    <>
      {/* Core: trắng-cyan sáng */}
      {/* @ts-ignore */}
      <line geometry={coreGeo} material={coreMat} />
      {/* Outer cone: cyan mờ tạo hiệu ứng phun lửa */}
      {outerGeos.map((geo, i) => (
        // @ts-ignore
        <line key={i} geometry={geo} material={outerMat} />
      ))}
    </>
  );
}

// ─── MÔ HÌNH ĐĨA BAY (UFO) ───────────────────────────────────────────────────
// ✅ FIX: Đọc góc tích lũy từ anglesRef → luôn đồng bộ với hành tinh
// ✅ FIX: Đứng thẳng trên đầu hành tinh (không tự quỹ đạo riêng nữa)
// ✅ FIX: Scale UFO khác nhau cho từng hành tinh
function UFO({
  currentHash,
  isShaking,
  worldPosRef,
  velWorldRef,
  anglesRef,
}: {
  currentHash: string;
  isShaking: boolean;
  worldPosRef: React.MutableRefObject<THREE.Vector3>;
  velWorldRef: React.MutableRefObject<THREE.Vector3>;
  anglesRef: React.MutableRefObject<Record<string, number>>;
}) {
  const ufoRef = useRef<THREE.Group>(null);

  const prevPosition  = useRef(new THREE.Vector3());
  const velocity      = useRef(new THREE.Vector3());
  const smoothedBank  = useRef(new THREE.Euler());
  const shouldSnap    = useRef(true);
  const prevHash      = useRef(currentHash);
  const _target       = useRef(new THREE.Vector3());

  const obj = useLoader(OBJLoader, "/models/ufo.obj");
  const [, normalMap, , glowMap] = useLoader(THREE.TextureLoader, [
    "/models/ufo_diffuse.png",
    "/models/ufo_normal.png",
    "/models/ufo_spec.png",
    "/models/ufo_diffuse_glow.png",
  ]);

  useMemo(() => {
    obj.traverse((child: any) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          normalMap,
          emissiveMap:       glowMap,
          color:             new THREE.Color("#ffffff"),
          emissive:          new THREE.Color("#ffffff"),
          emissiveIntensity: 1.2,
          metalness: 0.1,
          roughness: 0.6,
        });
      }
    });
  }, [obj, normalMap, glowMap]);

  useEffect(() => {
    if (prevHash.current !== currentHash) {
      shouldSnap.current = true;
      prevHash.current   = currentHash;
    }
  }, [currentHash]);

  useFrame(({ clock }) => {
    if (!ufoRef.current) return;
    const time = clock.getElapsedTime();

    // ── Tính vị trí mục tiêu ────────────────────────────────────────────
    _target.current.set(0, 30, 80); // mặc định: overview

    if (currentHash !== "#overview" && ORBIT_CONFIG[currentHash]) {
      const cfg = ORBIT_CONFIG[currentHash];
      // ✅ Đọc góc tích lũy từ OrbitGroup (cùng góc với hành tinh thật)
      const angle   = anglesRef.current[currentHash] ?? 0;
      const planetX = Math.sin(angle) * cfg.radius;
      const planetZ = Math.cos(angle) * cfg.radius;
      // UFO đứng thẳng ngay trên đỉnh hành tinh
      _target.current.set(planetX, cfg.ufoHeight, planetZ);
    }

    // ── Snap ngay khi đổi hành tinh (không kéo qua khoảng trống) ────────
    if (shouldSnap.current) {
      ufoRef.current.position.copy(_target.current);
      prevPosition.current.copy(_target.current);
      velocity.current.set(0, 0, 0);
      shouldSnap.current = false;
    }

    // ── Lerp mượt về target ──────────────────────────────────────────────
    prevPosition.current.copy(ufoRef.current.position);
    ufoRef.current.position.lerp(_target.current, 0.10);

    // ── Tính vận tốc để banking ──────────────────────────────────────────
    velocity.current.subVectors(ufoRef.current.position, prevPosition.current);

    // ── Bob lên xuống + quay ─────────────────────────────────────────────
    ufoRef.current.position.y += Math.sin(time * 2.2) * 0.09;
    ufoRef.current.rotation.y += 0.022;

    // ── Banking (nghiêng theo hướng di chuyển) ───────────────────────────
    const targetBankZ = -velocity.current.x * 0.55;
    const targetBankX = -velocity.current.z * 0.55;
    smoothedBank.current.x = THREE.MathUtils.lerp(smoothedBank.current.x, targetBankX, 0.08);
    smoothedBank.current.z = THREE.MathUtils.lerp(smoothedBank.current.z, targetBankZ, 0.08);
    ufoRef.current.rotation.x = smoothedBank.current.x;
    ufoRef.current.rotation.z = smoothedBank.current.z;

    // ── Rung lắc khi trả lời sai ─────────────────────────────────────────
    if (isShaking) {
      ufoRef.current.position.x += (Math.random() - 0.5) * 4;
      ufoRef.current.position.y += (Math.random() - 0.5) * 4;
      ufoRef.current.position.z += (Math.random() - 0.5) * 4;
    }

    // ── Xuất vị trí & vận tốc để trail dùng ─────────────────────────────
    worldPosRef.current.copy(ufoRef.current.position);
    velWorldRef.current.copy(velocity.current);
  });

  // Scale UFO phù hợp với từng hành tinh
  const ufoScale =
    currentHash !== "#overview" && ORBIT_CONFIG[currentHash]
      ? ORBIT_CONFIG[currentHash].ufoScale
      : 0.38;

  return (
    <group ref={ufoRef}>
      <primitive object={obj} scale={ufoScale} position={[0, 0, 0]} />
      <pointLight position={[0, 10, 0]}   intensity={100} color="#ffffff" distance={30} />
      <pointLight position={[10, -5, 10]} intensity={50}  color="#ffffff" distance={30} />
      {isShaking && (
        <pointLight position={[0, 0, 0]} color="#ff0000" intensity={200} distance={80} />
      )}
    </group>
  );
}

// ─── CAMERA CONTROLLER ───────────────────────────────────────────────────────
// ✅ FIX: Dùng anglesRef để camera cũng đồng bộ với góc hành tinh
function CameraController({
  currentHash,
  isCinematic,
  anglesRef,
}: {
  currentHash: string;
  isCinematic: boolean;
  anglesRef: React.MutableRefObject<Record<string, number>>;
}) {
  const { camera, controls } = useThree() as any;
  const isUserDragging = useRef(false);
  const orbitConfig    = useMemo(() => ORBIT_CONFIG, []);

  useEffect(() => {
    if (!controls) return;
    const onStart = () => { isUserDragging.current = true; };
    controls.addEventListener("start", onStart);
    return () => controls.removeEventListener("start", onStart);
  }, [controls]);

  useEffect(() => { isUserDragging.current = false; }, [currentHash]);

  useFrame((state) => {
    if (!controls) return;

    if (isCinematic) {
      const t = state.clock.getElapsedTime() * 0.08;
      camera.position.x = Math.sin(t) * 1200;
      camera.position.z = Math.cos(t) * 1200;
      camera.position.y = 80 + Math.sin(t * 0.5) * 60;
      camera.lookAt(0, 0, 0);
      controls.target.set(0, 0, 0);
      controls.update();
      return;
    }

    let targetCenter = new THREE.Vector3(0, 0, 0);
    let targetCamPos = new THREE.Vector3(250, 150, 500);

    if (currentHash !== "#overview" && orbitConfig[currentHash]) {
      const cfg   = orbitConfig[currentHash];
      // ✅ Đọc góc tích lũy để camera follow đúng hành tinh
      const angle = anglesRef.current[currentHash] ?? 0;
      const px    = Math.sin(angle) * cfg.radius;
      const pz    = Math.cos(angle) * cfg.radius;
      targetCenter.set(px, 0, pz);
      targetCamPos.set(px + cfg.camOffset[0], cfg.camOffset[1], pz + cfg.camOffset[2]);
    }

    controls.target.lerp(targetCenter, 0.06);
    if (!isUserDragging.current) {
      camera.position.lerp(targetCamPos, 0.04);
    }
    controls.update();
  });

  return null;
}

// ─── COMPONENT CHÍNH ─────────────────────────────────────────────────────────
export default function SolarSystem() {
  const [currentHash,     setCurrentHash]     = useState("#overview");
  const [controlsEnabled, setControlsEnabled] = useState(true);
  const [isShaking,       setIsShaking]       = useState(false);
  const [solarSpeed,      setSolarSpeed]      = useState(1);
  const [bloomIntensity,  setBloomIntensity]  = useState(1.5);
  const [isCinematic,     setIsCinematic]     = useState(false);

  const ufoWorldPos = useRef(new THREE.Vector3());
  const ufoVelWorld = useRef(new THREE.Vector3());

  // ✅ Bộ nhớ góc tích lũy dùng chung giữa OrbitGroup, UFO và Camera
  const planetAngles = useRef<Record<string, number>>({
    "#mercury": 0,
    "#venus":   0,
    "#earth":   0,
    "#mars":    0,
    "#jupiter": 0,
    "#saturn":  0,
    "#uranus":  0,
    "#neptune": 0,
  });

  const planetHashes = [
    "#overview",
    "#mercury", "#venus", "#earth", "#mars",
    "#jupiter", "#saturn", "#uranus", "#neptune",
  ];

  useEffect(() => {
    const handleHashChange = () => setCurrentHash(window.location.hash || "#overview");
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleWheel = (e: React.WheelEvent) => {
    const idx = planetHashes.indexOf(currentHash);
    if (e.deltaY > 50  && idx < planetHashes.length - 1) window.location.hash = planetHashes[idx + 1];
    else if (e.deltaY < -50 && idx > 0)                  window.location.hash = planetHashes[idx - 1];
  };

  const handleWrongAnswer = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  const handleCorrectAnswer = () => {
    const idx = planetHashes.indexOf(currentHash);
    if (idx < planetHashes.length - 1) {
      window.location.hash = planetHashes[idx + 1];
    } else {
      window.location.hash = "#overview";
      setTimeout(() => alert("Chúc mừng Thuyền trưởng! Bạn đã chinh phục toàn bộ Hệ Mặt Trời!"), 500);
    }
  };

  return (
    //Trang thêm
   <>
    <Head>
        <title>Solar System</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
    <div
      onWheel={handleWheel}
      style={{
        width: "100vw", height: "100vh",
        backgroundImage: "url(/icons/b2.jpg)",
        backgroundSize: "cover", backgroundPosition: "center",
        backgroundRepeat: "no-repeat", overflow: "hidden", position: "relative",
      }}
    >
      <Canvas gl={{ antialias: true }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault fov={50} far={10000} />
          <OrbitControls
            makeDefault
            enablePan={false}
            minDistance={10}
            maxDistance={3000}
            enableDamping
            dampingFactor={0.06}
            rotateSpeed={0.8}
          />
          <CameraController
            currentHash={currentHash}
            isCinematic={isCinematic}
            anglesRef={planetAngles}
          />

          {/* ── ÁNH SÁNG ── */}
          <ambientLight intensity={0.1} />
          <pointLight position={[0, 0, 0]} intensity={20} color="#fff8e1" distance={3000} />

          {/* ── SAO NỀN ── */}
          <Stars radius={3000} depth={150} count={20000} factor={50} saturation={1} fade speed={1} />

          {/* ── MẶT TRỜI ── */}
          <Sun isActive={currentHash === "#overview"} />

          {/* ── ĐĨA BAY + ĐUÔI PHUN LỬA ── */}
          <UFO
            currentHash={currentHash}
            isShaking={isShaking}
            worldPosRef={ufoWorldPos}
            velWorldRef={ufoVelWorld}
            anglesRef={planetAngles}
          />
          {/* ✅ RocketTrail thay thế UFOTrail + xóa UFOLightning */}
          <RocketTrail
            posRef={ufoWorldPos}
            velRef={ufoVelWorld}
            currentHash={currentHash}
          />

          {/* ── QUỸ ĐẠO MỜ ── */}
          <OrbitLine radius={80}   />
          <OrbitLine radius={140}  />
          <OrbitLine radius={210}  />
          <OrbitLine radius={300}  />
          <OrbitLine radius={480}  />
          <OrbitLine radius={680}  />
          <OrbitLine radius={880}  />
          <OrbitLine radius={1050} />

          {/* ── HÀNH TINH — truyền planetHash + anglesRef để OrbitGroup đồng bộ góc ── */}
          <OrbitGroup speed={0.50 * solarSpeed} planetHash="#mercury" anglesRef={planetAngles}>
            <Mercury isActive={currentHash === "#mercury"} setControlsEnabled={setControlsEnabled} onClick={() => (window.location.hash = "#mercury")} />
          </OrbitGroup>
          <OrbitGroup speed={0.35 * solarSpeed} planetHash="#venus" anglesRef={planetAngles}>
            <Venus   isActive={currentHash === "#venus"}   setControlsEnabled={setControlsEnabled} onClick={() => (window.location.hash = "#venus")}   />
          </OrbitGroup>
          <OrbitGroup speed={0.25 * solarSpeed} planetHash="#earth" anglesRef={planetAngles}>
            <Earth   isActive={currentHash === "#earth"}   setControlsEnabled={setControlsEnabled} onClick={() => (window.location.hash = "#earth")}   />
          </OrbitGroup>
          <OrbitGroup speed={0.20 * solarSpeed} planetHash="#mars" anglesRef={planetAngles}>
            <Mars    isActive={currentHash === "#mars"}    setControlsEnabled={setControlsEnabled} onClick={() => (window.location.hash = "#mars")}    />
          </OrbitGroup>

          {/* Vành đai tiểu hành tinh */}
          <AsteroidBelt count={1200} innerRadius={360} outerRadius={420} speedFactor={0.3} />

          <OrbitGroup speed={0.10 * solarSpeed} planetHash="#jupiter" anglesRef={planetAngles}>
            <Jupiter isActive={currentHash === "#jupiter"} setControlsEnabled={setControlsEnabled} onClick={() => (window.location.hash = "#jupiter")} />
          </OrbitGroup>
          <OrbitGroup speed={0.08 * solarSpeed} planetHash="#saturn" anglesRef={planetAngles}>
            <Saturn  isActive={currentHash === "#saturn"}  setControlsEnabled={setControlsEnabled} onClick={() => (window.location.hash = "#saturn")}  />
          </OrbitGroup>
          <OrbitGroup speed={0.05 * solarSpeed} planetHash="#uranus" anglesRef={planetAngles}>
            <Uranus  isActive={currentHash === "#uranus"}  setControlsEnabled={setControlsEnabled} onClick={() => (window.location.hash = "#uranus")}  />
          </OrbitGroup>
          <OrbitGroup speed={0.03 * solarSpeed} planetHash="#neptune" anglesRef={planetAngles}>
            <Neptune isActive={currentHash === "#neptune"} setControlsEnabled={setControlsEnabled} onClick={() => (window.location.hash = "#neptune")} />
          </OrbitGroup>

          {/* Vành đai Kuiper */}
          <AsteroidBelt count={4000} innerRadius={1300} outerRadius={1500} speedFactor={0.07} />

          {/* ── HIỆU ỨNG HẬU KỲ ── */}
          <EffectComposer>
            <Bloom
              intensity={bloomIntensity}
              luminanceThreshold={0.2}
              mipmapBlur
              radius={0.5}
            />
          </EffectComposer>
        </Suspense>
      </Canvas>

      {/* ── HUD CONTROLS ── */}
      <HUDControls
        solarSpeed={solarSpeed}
        setSolarSpeed={setSolarSpeed}
        bloomIntensity={bloomIntensity}
        setBloomIntensity={setBloomIntensity}
        isCinematic={isCinematic}
        setIsCinematic={setIsCinematic}
      />

      {/* ── BẢNG THÔNG TIN ── */}
      {currentHash !== "#overview" && (
        <PlanetInfoPanel
          currentHash={currentHash}
          onCorrect={handleCorrectAnswer}
          onWrong={handleWrongAnswer}
        />
      )}

      {/* ── NÚT BACK TO START ── */}
      <button
        onClick={() => (window.location.hash = "#overview")}
        style={{
          position: "fixed", bottom: "40px", right: "40px", zIndex: 100,
          padding: "10px 24px",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          color: "white",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          borderRadius: "99px",
          cursor: "pointer",
          backdropFilter: "blur(10px)",
        }}
      >
        BACK TO START
      </button>

      {/* ── THANH ĐIỀU HƯỚNG DƯỚI CÙNG ── */}
      <div
        style={{
          position: "fixed", bottom: "20px", left: "50%",
          transform: "translateX(-50%)",
          display: "flex", gap: "10px",
          zIndex: 100, padding: "10px",
          background: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(10px)",
          borderRadius: "50px",
          border: "1px solid rgba(0, 243, 255, 0.2)",
          boxShadow: "0 0 20px rgba(0, 0, 0, 0.5)",
        }}
      >
        {Object.keys(ORBIT_CONFIG).map((hash) => (
          <button
            key={hash}
            onClick={() => (window.location.hash = hash)}
            style={{
              padding: "8px 15px",
              backgroundColor: currentHash === hash ? "rgba(0, 243, 255, 0.3)" : "transparent",
              color: currentHash === hash ? "#00f3ff" : "#fff",
              border: "none",
              borderRadius: "20px",
              fontSize: "12px", fontWeight: "bold",
              cursor: "pointer", textTransform: "uppercase",
              transition: "all 0.3s ease",
              borderBottom: currentHash === hash ? "2px solid #00f3ff" : "none",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(0, 243, 255, 0.2)"; }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                currentHash === hash ? "rgba(0, 243, 255, 0.3)" : "transparent";
            }}
          >
            {hash.replace("#", "")}
          </button>
        ))}
      </div>
    </div>
  //Trang thêm
    </>
    //======
  );
}