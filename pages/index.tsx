import React, { useState, useEffect, Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import { Stars, PerspectiveCamera, OrbitControls, Line } from "@react-three/drei"; 
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

import { AsteroidBelt } from "../src/components/AsteroidBelt";
import { HUDControls } from "../src/components/HUDControls"; 
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import IntroScreen from "../src/components/IntroScreen";

// @ts-ignore
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

import Sun from "../src/components/planets/Sun";
import Earth from "../src/components/planets/Earth";
import Mars from "../src/components/planets/Mars";
import Jupiter from "../src/components/planets/Jupiter";
import Saturn from "../src/components/planets/saturn"; 
import Mercury from "../src/components/planets/mecury";
import Neptune from "../src/components/planets/neptune"; 
import Uranus from "../src/components/planets/uranus";   
import Venus from "../src/components/planets/venus";      
import StarBackground from "../src/components/StarBackground"; 

// --- 1. DATA CÁC HÀNH TINH ---
const planetData: Record<string, any> = {
  "#mercury": {
    name: " MERCURY", type: "PLANET",
    visit: "Mercury is the smallest planet in our solar system and the closest to the Sun. It experiences extreme temperature fluctuations, freezing at night and scorching during the day.",
    encyclopedia: "A terrestrial planet with a heavily cratered surface, much like Earth's Moon. It has no moons and almost no atmosphere to retain heat.",
    structure: "Mercury has a large, dense metallic core that makes up about 85% of its radius, surrounded by a rocky mantle and a thin solid crust.",
    question: "Hành tinh nào gần Mặt Trời nhất?", options: ["A. Sao Kim", "B. Sao Thủy", "C. Sao Hỏa", "D. Sao Mộc"], correctAnswer: 1
  },
  "#venus": {
    name: "VENUS", type: "PLANET",
    visit: "Often called Earth's twin due to its similar size, but its surface is a toxic, superheated wasteland with crushing atmospheric pressure.",
    encyclopedia: "The second planet from the Sun, featuring a thick atmosphere rich in carbon dioxide and clouds of sulfuric acid that trap heat in a runaway greenhouse effect.",
    structure: "Similar to Earth, Venus has an iron core, a rocky mantle, and a silicate crust. Its surface is dominated by volcanic features.",
    question: "Hành tinh nào nóng nhất hệ Mặt Trời?", options: ["A. Sao Thủy", "B. Trái Đất", "C. Sao Kim", "D. Sao Hỏa"], correctAnswer: 2
  },
  "#earth": {
    name: "EARTH", type: "PLANET",
    visit: "Our home planet, the third from the Sun, and the only place we know of so far that's inhabited by living things.",
    encyclopedia: "Earth is a water world with 71% of its surface covered by oceans. It has a dynamic atmosphere that sustains life and protects us from meteoroids.",
    structure: "Earth is composed of four main layers: a solid inner core, a liquid outer core, a thick rocky mantle, and a rocky crust.",
    question: "Hành tinh nào chúng ta đang sống?", options: ["A. Sao Hỏa", "B. Trái Đất", "C. Sao Kim", "D. Sao Thổ"], correctAnswer: 1
  },
  "#mars": {
    name: "MARS", type: "PLANET",
    visit: "The Red Planet, a dusty, cold, desert world with a very thin atmosphere. It is one of the most explored bodies in our solar system.",
    encyclopedia: "The fourth planet from the Sun. It features surface elements reminiscent of both the impact craters of the Moon and the valleys, deserts, and polar ice caps of Earth.",
    structure: "Mars has a dense core of iron, nickel, and sulfur, surrounded by a rocky mantle and a crust made of volcanic rock. Its red color comes from iron oxide (rust).",
    question: "Hành tinh nào được gọi là “hành tinh đỏ”?", options: ["A. Sao Mộc", "B. Sao Hỏa", "C. Sao Kim", "D. Sao Thủy"], correctAnswer: 1
  },
  "#jupiter": {
    name: "JUPITER", type: "GAS GIANT",
    visit: "The largest planet in our solar system. It is a massive gas giant with swirling cloud stripes and massive storms, including the Great Red Spot.",
    encyclopedia: "The fifth planet from the Sun. It has dozens of moons and a dark, barely-visible ring system. It acts as a massive vacuum cleaner for the solar system.",
    structure: "Primarily composed of hydrogen and helium. It lacks a well-defined solid surface, transitioning gradually from gas to a vast ocean of liquid metallic hydrogen.",
    question: "Hành tinh nào lớn nhất hệ Mặt Trời?", options: ["A. Sao Thổ", "B. Sao Hải Vương", "C. Sao Mộc", "D. Sao Thiên Vương"], correctAnswer: 2
  },
  "#saturn": {
    name: "SATURN", type: "GAS GIANT",
    visit: "Adorned with a dazzling, complex system of icy rings, Saturn is widely considered the most beautiful planet in our solar system.",
    encyclopedia: "The sixth planet from the Sun and the second-largest. It is a gas giant with an extensive moon system, including Titan, which has its own thick atmosphere.",
    structure: "Made mostly of hydrogen and helium. It likely has a dense, rocky core surrounded by a deep layer of liquid metallic hydrogen.",
    question: "Hành tinh nào có vành đai nổi bật nhất?", options: ["A. Sao Mộc", "B. Sao Thổ", "C. Sao Kim", "D. Sao Hỏa"], correctAnswer: 1
  },
  "#uranus": {
    name: "URANUS", type: "ICE GIANT",
    visit: "An ice giant that is unique because it rotates on its side. It has a distinct pale blue-green color.",
    encyclopedia: "The seventh planet from the Sun. It was the first planet found with the aid of a telescope. It has 27 known moons and faint rings.",
    structure: "Mostly composed of flowing icy materials (water, ammonia, methane) above a small rocky core. Its atmosphere contains hydrogen, helium, and methane.",
    question: "Hành tinh nào có màu xanh do khí methane?", options: ["A. Sao Kim", "B. Sao Thiên Vương", "C. Sao Hỏa", "D. Sao Thủy"], correctAnswer: 1
  },
  "#neptune": {
    name: "NEPTUNE", type: "ICE GIANT",
    visit: "Dark, cold, and whipped by supersonic winds, Neptune is the last of the major planets in our solar system.",
    encyclopedia: "The eighth and most distant major planet orbiting our Sun. It is an ice giant with a faint ring system and 14 known moons.",
    structure: "Its structure is similar to Uranus, consisting of a hot, dense fluid or 'icy' mantle (water, ammonia, and methane) over an Earth-sized solid core.",
    question: "Hành tinh xa Mặt Trời nhất là gì?", options: ["A. Sao Thiên Vương", "B. Sao Hải Vương", "C. Sao Thổ", "D. Sao Mộc"], correctAnswer: 1
  }
};

const ORBIT_CONFIG: Record<string, { radius: number, speed: number, camOffset: [number, number, number] }> = {
  "#mercury":  { radius: 80,   speed: 0.5,  camOffset: [0, 10, 30] },
  "#venus":    { radius: 140,  speed: 0.35, camOffset: [0, 10, 35] },
  "#earth":    { radius: 210,  speed: 0.25, camOffset: [0, 10, 35] },
  "#mars":     { radius: 300,  speed: 0.2,  camOffset: [0, 10, 35] },
  "#jupiter":  { radius: 480,  speed: 0.1,  camOffset: [0, 30, 100] },
  "#saturn":   { radius: 680,  speed: 0.08, camOffset: [0, 30, 100] },
  "#uranus":   { radius: 880,  speed: 0.05, camOffset: [0, 20, 80] },
  "#neptune":  { radius: 1050, speed: 0.03, camOffset: [0, 20, 80] },
};

// --- 2. CÁC COMPONENT GIAO DIỆN UI ---
function MenuButton({ text, onClick, highlight = false }: { text: string, onClick?: () => void, highlight?: boolean }) {
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
        fontSize: "14px", fontWeight: "bold", letterSpacing: "3px",
        cursor: "pointer", textAlign: "left", textTransform: "uppercase",
        clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)",
        transition: "all 0.3s ease",
        boxShadow: highlight ? "inset 0 0 15px rgba(0, 243, 255, 0.2)" : "none"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "rgba(0, 243, 255, 0.25)";
        e.currentTarget.style.color = "#fff";
        e.currentTarget.style.borderLeft = "3px solid #00f3ff";
        e.currentTarget.style.boxShadow = "inset 0 0 15px rgba(0, 243, 255, 0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = highlight ? "rgba(0, 243, 255, 0.15)" : "rgba(0, 0, 0, 0.4)";
        e.currentTarget.style.color = highlight ? "#fff" : "#b3e5fc";
        e.currentTarget.style.borderLeft = `3px solid ${highlight ? "#00f3ff" : "rgba(0, 243, 255, 0.3)"}`;
        e.currentTarget.style.boxShadow = highlight ? "inset 0 0 15px rgba(0, 243, 255, 0.2)" : "none";
      }}
    >
      {text}
    </button>
  );
}

// --- BẢNG THÔNG TIN ĐÃ FIX THÊM TÍNH NĂNG NHẢY HÀNH TINH KHI TRẢ LỜI ĐÚNG ---
// --- BẢNG THÔNG TIN (ĐÃ THÊM TÍNH NĂNG KHÓA UFO KHI SAI) ---
function PlanetInfoPanel({ currentHash, setIsShaking }: { currentHash: string, setIsShaking: any }) {
  const [activeView, setActiveView] = useState<string>("menu");
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const data = planetData[currentHash];

  // Reset khi đổi hành tinh
  useEffect(() => { 
    setActiveView("menu"); 
    setSelectedAnswer(null); 
    setIsShaking(false); 
  }, [currentHash, setIsShaking]);

  if (!data) return null;

  const handleAnswerClick = (index: number) => {
    // Cho phép chọn lại nếu trước đó chọn sai
    setSelectedAnswer(index);
    
    if (index === data.correctAnswer) {
      // NẾU CHỌN ĐÚNG
      setIsShaking(false); // Tắt rung, tắt đèn đỏ ngay lập tức
      
      setTimeout(() => {
        const planetHashes = ["#overview", "#mercury", "#venus", "#earth", "#mars", "#jupiter", "#saturn", "#uranus", "#neptune"];
        const currentIndex = planetHashes.indexOf(currentHash);
        
        if (currentIndex !== -1 && currentIndex < planetHashes.length - 1) {
          // Nhảy sang hành tinh tiếp theo
          window.location.hash = planetHashes[currentIndex + 1];
        } else {
          window.location.hash = "#overview"; 
        }
      }, 1500); 
    } else {
      // NẾU CHỌN SAI
      setIsShaking(true); // Bật rung và đèn đỏ
    }
  };

 return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentHash} // QUAN TRỌNG: Phải có key này thì nó mới không bị lặp đè lên nhau
        initial={{ x: -300, opacity: 0 }} 
        animate={{ x: 0, opacity: 1 }} 
        exit={{ x: -300, opacity: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        style={{
          position: "absolute", top: "8%", left: "60px", 
          width: "380px", zIndex: 10, color: "white", fontFamily: "sans-serif",
          background: `repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1) 1px, transparent 1px, transparent 2px), linear-gradient(135deg, rgba(2, 11, 26, 0.85) 0%, rgba(0, 34, 68, 0.6) 100%)`,
          border: "1px solid rgba(0, 243, 255, 0.3)", borderTop: "3px solid #00f3ff", borderBottom: "3px solid #00f3ff",
          boxShadow: "0 0 40px rgba(0, 243, 255, 0.2), inset 0 0 20px rgba(0, 243, 255, 0.1)",
          borderRadius: "4px", padding: "30px", backdropFilter: "blur(15px)",
          clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 25px), calc(100% - 25px) 100%, 0 100%)"
        }}
      >
        {/* --- NỘI DUNG BÊN TRONG CỦA ÔNG (GIỮ NGUYÊN) --- */}
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#00f3ff", marginBottom: "15px", opacity: 0.8, letterSpacing: "2px", textTransform: "uppercase" }}>
          <span>SYS.DAT // {currentHash.replace("#", "")}</span>
          <span>[ SCANNING... ]</span>
        </div>

        <div style={{ textAlign: "center", marginBottom: "30px", borderBottom: "1px dashed rgba(0, 243, 255, 0.4)", paddingBottom: "15px", position: "relative" }}>
          <h1 style={{ margin: 0, fontSize: "44px", fontWeight: "900", letterSpacing: "6px", color: "#e0f7fa", textShadow: "0 0 20px #00f3ff, 0 0 40px #00f3ff" }}>
            {data.name}
          </h1>
          <p style={{ margin: "5px 0 0 0", fontSize: "14px", color: "#00f3ff", letterSpacing: "8px" }}>{data.type}</p>
        </div>

        {activeView === "menu" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <MenuButton text="VISIT" onClick={() => setActiveView("visit")} />
            <MenuButton text="ENCYCLOPEDIA" onClick={() => setActiveView("encyclopedia")} />
            <MenuButton text="STRUCTURE" onClick={() => setActiveView("structure")} />
            <MenuButton text="QUESTION (QUIZ)" highlight onClick={() => setActiveView("quiz")} />
          </motion.div>
        )}

        {["visit", "encyclopedia", "structure"].includes(activeView) && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h3 style={{ marginTop: 0, color: "#00f3ff", fontSize: "16px", textTransform: "uppercase", letterSpacing: "2px" }}>{activeView}</h3>
            <p style={{ fontSize: "15px", lineHeight: "1.6", color: "#d0e8f2", marginBottom: "25px", fontWeight: "300" }}>{data[activeView]}</p>
            <MenuButton text="BACK TO MENU" onClick={() => { setActiveView("menu"); setIsShaking(false); }} highlight />
          </motion.div>
        )}

        {activeView === "quiz" && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <h3 style={{ marginTop: 0, color: "#00f3ff", fontSize: "16px", textTransform: "uppercase" }}>Quiz / System Test</h3>
            <p style={{ fontSize: "16px", lineHeight: "1.5", marginBottom: "20px", color: "#e0f7fa" }}>{data.question}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
              {data.options.map((option: string, index: number) => {
                let bgColor = "rgba(0, 0, 0, 0.4)";
                let borderColor = "rgba(0, 243, 255, 0.2)";
                let textColor = "white";
                if (selectedAnswer !== null) {
                  if (index === data.correctAnswer && selectedAnswer === index) { bgColor = "rgba(0, 255, 0, 0.2)"; borderColor = "#00ff00"; textColor = "#00ff00"; }
                  else if (index === selectedAnswer && index !== data.correctAnswer) { bgColor = "rgba(255, 0, 0, 0.2)"; borderColor = "#ff0000"; textColor = "#ff0000"; }
                }
                return (
                  <button
                    key={index} onClick={() => handleAnswerClick(index)}
                    style={{ padding: "12px", textAlign: "left", backgroundColor: bgColor, border: `1px solid ${borderColor}`, color: textColor, cursor: "pointer", borderRadius: "4px", transition: "all 0.3s", clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)" }}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            
            {selectedAnswer !== null && selectedAnswer === data.correctAnswer && (
              <p style={{ color: "#00ff00", textAlign: "center", fontSize: "12px", marginTop: "10px", fontWeight: "bold" }}>CORRECT! JUMPING...</p>
            )}
            {selectedAnswer !== null && selectedAnswer !== data.correctAnswer && (
              <p style={{ color: "#ff0000", textAlign: "center", fontSize: "12px", marginTop: "10px", fontWeight: "bold", letterSpacing: "2px" }}>⚠️ SYSTEM LOCKED! UFO ALERT!</p>
            )}

            <div style={{ marginTop: "15px" }}>
              <MenuButton text="BACK TO MENU" onClick={() => { setActiveView("menu"); setSelectedAnswer(null); setIsShaking(false); }} highlight />
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

// --- 3. CÁC COMPONENT TRONG MÔI TRƯỜNG 3D ---
function OrbitLine({ radius }: { radius: number }) {
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * 2 * Math.PI;
      pts.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
    }
    return pts;
  }, [radius]);
  return <Line points={points} color="white" lineWidth={2} transparent opacity={0.4} />;
}

function OrbitGroup({ speed, children }: { speed: number, children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += speed * delta;
    }
  });
  return <group ref={groupRef}>{children}</group>;
}

function UFO({ currentHash, isShaking }: { currentHash: string, isShaking: boolean }) {
  const ufoRef = useRef<THREE.Group>(null);
  const obj = useLoader(OBJLoader, '/models/ufo.obj');
  const [colorMap, normalMap, specMap, glowMap] = useLoader(THREE.TextureLoader, [
    '/models/ufo_diffuse.png',
    '/models/ufo_normal.png',
    '/models/ufo_spec.png',
    '/models/ufo_diffuse_glow.png'
  ]);
  
  useMemo(() => {
    obj.traverse((child: any) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          normalMap: normalMap,        
          emissiveMap: glowMap,        
          color: new THREE.Color("#ffffff"), 
          emissive: new THREE.Color("#ffffff"), 
          emissiveIntensity: 1.5,      
          metalness: 0.4, 
          roughness: 0.3  
        });
      }
    });
  }, [obj, normalMap, glowMap]); 

  useFrame(({ clock }) => {
    if (!ufoRef.current) return;
    const time = clock.getElapsedTime();
    let targetPos = new THREE.Vector3(0, 50, 100);

    if (currentHash !== "#overview" && ORBIT_CONFIG[currentHash]) {
      const config = ORBIT_CONFIG[currentHash];
      const angle = time * config.speed;
      const planetX = Math.sin(angle) * config.radius;
      const planetZ = Math.cos(angle) * config.radius;

      // UFO bay hộ tống bên cạnh hành tinh
      targetPos.set(planetX + 15, 8, planetZ + 15);
    }

    // Nếu bị khóa (isShaking), UFO sẽ đứng khựng lại và rung, không lerp theo hành tinh nữa
    if (isShaking) {
      ufoRef.current.position.x += (Math.random() - 0.5) * 1.5;
      ufoRef.current.position.y += (Math.random() - 0.5) * 1.5;
      ufoRef.current.position.z += (Math.random() - 0.5) * 1.5;
    } else {
      ufoRef.current.position.lerp(targetPos, 0.08);
      ufoRef.current.position.y += Math.sin(time * 2) * 0.2;
    }
    
    ufoRef.current.rotation.y += isShaking ? 0.15 : 0.02; // Quay nhanh hơn khi bị lỗi
  });

  return (
    <group ref={ufoRef}>
      <primitive object={obj} scale={0.4} />
      
      {/* Đèn mặc định màu xanh dương khi bình thường */}
      {!isShaking && (
        <pointLight position={[0, 5, 0]} intensity={50} color="#00f3ff" distance={30} />
      )}

      {/* HIỆU ỨNG KHI TRẢ LỜI SAI: Đèn đỏ rực dưới đáy và xung quanh */}
      {isShaking && (
        <>
          {/* Luồng sáng đỏ cực mạnh hắt xuống dưới hành tinh */}
          <pointLight position={[0, -10, 0]} intensity={500} color="#ff0000" distance={100} />
          {/* Ánh sáng đỏ bao quanh thân tàu */}
          <pointLight position={[0, 5, 0]} intensity={200} color="#ff0000" distance={50} />
          {/* Hiệu ứng chớp nháy cảnh báo */}
          <pointLight position={[0, 0, 0]} intensity={Math.sin(Date.now() * 0.02) * 100 + 100} color="#ff0000" distance={40} />
        </>
      )}
    </group>
  );
}

function CameraController({ currentHash, isCinematic }: { currentHash: string, isCinematic: boolean }) {
  const { camera, controls } = useThree() as any;
  
  // 1. Dùng Ref để lưu trạng thái không gây re-render
  const userHasInteracted = useRef(false);
  const isUserDragging = useRef(false);

  // Reset trạng thái khi người dùng đổi hành tinh hoặc bật/tắt Cinematic
  useEffect(() => {
    userHasInteracted.current = false;
  }, [currentHash, isCinematic]);

  useEffect(() => {
    if (!controls) return;

    const onStartDrag = () => { 
      isUserDragging.current = true; 
      userHasInteracted.current = true; // Đã đụng vào là tính tương tác luôn
    };
    const onEndDrag = () => { 
      isUserDragging.current = false; 
    };

    controls.addEventListener("start", onStartDrag);
    controls.addEventListener("end", onEndDrag);

    return () => {
      controls.removeEventListener("start", onStartDrag);
      controls.removeEventListener("end", onEndDrag);
    };
  }, [controls]);

  useFrame((state) => {
    if (!controls) return;

    // A. CHẾ ĐỘ CINEMATIC (Chỉ chạy khi máy đang cầm lái)
    if (isCinematic && !userHasInteracted.current) {
      const t = state.clock.getElapsedTime() * 0.05;
      camera.position.x = Math.sin(t) * 1500;
      camera.position.z = Math.cos(t) * 1500;
      camera.position.y = 600;
      controls.target.lerp(new THREE.Vector3(0, 0, 0), 0.05);
      controls.update();
      return;
    }

    // B. CHẾ ĐỘ THEO DÕI HÀNH TINH (Chỉ chạy khi máy đang cầm lái)
    if (!userHasInteracted.current) {
      const time = state.clock.getElapsedTime();
      let targetCenter = new THREE.Vector3(0, 0, 0); 
      let targetCamPos = new THREE.Vector3(500, 300, 800); 

      if (currentHash !== "#overview" && ORBIT_CONFIG[currentHash]) {
        const config = ORBIT_CONFIG[currentHash];
        const angle = time * config.speed; 
        const planetX = Math.sin(angle) * config.radius;
        const planetZ = Math.cos(angle) * config.radius;
        
        // Target nhìn vào hành tinh
        targetCenter.set(planetX + 5, 2, planetZ + 5);
        
        // Camera bám theo với offset
        targetCamPos.set(
          planetX + config.camOffset[0] * 1.2, 
          config.camOffset[1] * 1.2, 
          planetZ + config.camOffset[2] * 1.2
        );
      }
      
      // Lerp mượt mà
      controls.target.lerp(targetCenter, 0.05);
      camera.position.lerp(targetCamPos, 0.05);
    }

    // C. LUÔN CẬP NHẬT CONTROLS (Để xoay tự do không bị khựng)
    controls.update();
  });

  return null;
}
// --- 4. COMPONENT CHÍNH EXPORT ---
export default function SolarSystem() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [currentHash, setCurrentHash] = useState("#overview");
  const [controlsEnabled, setControlsEnabled] = useState(true);
  const [isShaking, setIsShaking] = useState(false); 
  const [solarSpeed, setSolarSpeed] = useState(1); 
  const [bloomIntensity, setBloomIntensity] = useState(1.5); 
  const [isCinematic, setIsCinematic] = useState(false); 

  const [showIntro, setShowIntro] = useState(true);
  const [sceneVisible, setSceneVisible] = useState(false);
  const planetHashes = ["#overview", "#mercury", "#venus", "#earth", "#mars", "#jupiter", "#saturn", "#uranus", "#neptune"];

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash || "#overview");
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleWheel = (e: React.WheelEvent) => {
    if (showIntro) return;
    const currentIndex = planetHashes.indexOf(currentHash);
    if (e.deltaY > 50 && currentIndex < planetHashes.length - 1) {
      window.location.hash = planetHashes[currentIndex + 1];
    } else if (e.deltaY < -50 && currentIndex > 0) {
      window.location.hash = planetHashes[currentIndex - 1];
    }
  };

  const handleEnterScene = () => {
    setShowIntro(false);
    setTimeout(() => {
      setSceneVisible(true);
    }, 500); 
  };

  // NẾU CHƯA TẢI XONG THÌ RETURN MÀN ĐEN (CHỐNG LỖI NEXT.JS SSR)
  if (!isMounted) {
    return <div style={{ width: "100vw", height: "100vh", backgroundColor: "black" }} />;
  }

  // RETURN GIAO DIỆN CHÍNH
  return (
    <div 
      onWheel={handleWheel}
      style={{ 
        width: "100vw", height: "100vh", 
        backgroundImage: "url(/icons/b2.jpg)", 
        backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", 
        backgroundColor: "black", overflow: "hidden", position: "relative" 
      }}
    >
      <motion.div style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}>
        <Canvas 
          gl={{ antialias: false, stencil: false }} 
          dpr={[1, 2]} 
          style={{width: "100%", height :"100%"}}
        >
          <Suspense fallback={null}>
            <PerspectiveCamera makeDefault fov={50} far={10000} />
            
            <OrbitControls 
              makeDefault 
              enablePan={false} 
              minDistance={10} 
              maxDistance={3000}
              enableDamping={true}
              dampingFactor={0.05}
              rotateSpeed={0.8}
              onStart={() => setControlsEnabled(true)}
            />
            <CameraController currentHash={currentHash} isCinematic={isCinematic}/>

            <ambientLight intensity={0.1} /> 
            <pointLight position={[0, 0, 0]} intensity={20} color="#fff8e1" distance={3000} />
            
            {/* --- GOM BẦU TRỜI SAO VÀO NHÓM VÀ CHO XOAY TỪ TỪ --- */}
            <OrbitGroup speed={0.01 * solarSpeed}>
              <StarBackground />
              <Stars radius={3000} depth={150} count={20000} factor={50} saturation={1} fade speed={2} />
            </OrbitGroup>
            <Sun isActive={currentHash === "#overview"} />

            {/* --- ĐĨA BAY UFO ĐÃ ĐƯỢC BẬT LÊN Ở ĐÂY --- */}
            <UFO currentHash={currentHash} isShaking={isShaking} />

            <OrbitLine radius={80} />
            <OrbitLine radius={140} />
            <OrbitLine radius={210} />
            <OrbitLine radius={300} />
            <OrbitLine radius={480} />
            <OrbitLine radius={680} />
            <OrbitLine radius={880} />
            <OrbitLine radius={1050} />

            <OrbitGroup speed={0.5 * solarSpeed}><Mercury isActive={currentHash === "#mercury"} setControlsEnabled={setControlsEnabled} onClick={() => window.location.hash = "#mercury"} /></OrbitGroup>
            <OrbitGroup speed={0.35 * solarSpeed}><Venus isActive={currentHash === "#venus"} setControlsEnabled={setControlsEnabled} onClick={() => window.location.hash = "#venus"} /></OrbitGroup>
            <OrbitGroup speed={0.25 * solarSpeed}><Earth isActive={currentHash === "#earth"} setControlsEnabled={setControlsEnabled} onClick={() => window.location.hash = "#earth"} /></OrbitGroup>
            <OrbitGroup speed={0.2 * solarSpeed}><Mars isActive={currentHash === "#mars"} setControlsEnabled={setControlsEnabled} onClick={() => window.location.hash = "#mars"} /></OrbitGroup>
            
            <AsteroidBelt count={1200} innerRadius={360} outerRadius={420} speedFactor={0.3} />

            <OrbitGroup speed={0.1 * solarSpeed}><Jupiter isActive={currentHash === "#jupiter"} setControlsEnabled={setControlsEnabled} onClick={() => window.location.hash = "#jupiter"} /></OrbitGroup>
            <OrbitGroup speed={0.08 * solarSpeed}><Saturn isActive={currentHash === "#saturn"} setControlsEnabled={setControlsEnabled} onClick={() => window.location.hash = "#saturn"} /></OrbitGroup>
            <OrbitGroup speed={0.05 * solarSpeed}><Uranus isActive={currentHash === "#uranus"} setControlsEnabled={setControlsEnabled} onClick={() => window.location.hash = "#uranus"} /></OrbitGroup>
            <OrbitGroup speed={0.03 * solarSpeed}><Neptune isActive={currentHash === "#neptune"} setControlsEnabled={setControlsEnabled} onClick={() => window.location.hash = "#neptune"} /></OrbitGroup>

            <AsteroidBelt count={4000} innerRadius={1300} outerRadius={1500} speedFactor={0.07} />

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

        <HUDControls
          solarSpeed={solarSpeed}
          setSolarSpeed={setSolarSpeed}
          bloomIntensity={bloomIntensity}
          setBloomIntensity={setBloomIntensity}
          isCinematic={isCinematic}
          setIsCinematic={setIsCinematic}
        />
        {/* BỌC ANIMATEPRESENCE Ở ĐÂY ĐỂ TRÁNH LỖI LẶP UI */}
        <AnimatePresence mode="wait">
          {currentHash !== "#overview" && (
            <PlanetInfoPanel key={currentHash} currentHash={currentHash} setIsShaking={setIsShaking} />
          )}
        </AnimatePresence>
        
        <button 
          onClick={() => window.location.hash = "#overview"}
          style={{
            position: "fixed", bottom: "40px", right: "40px", zIndex: 100,
            padding: "10px 24px", backgroundColor: "rgba(255, 255, 255, 0.1)",
            color: "white", border: "1px solid rgba(255, 255, 255, 0.3)",
            borderRadius: "99px", cursor: "pointer", backdropFilter: "blur(10px)"
          }}
        >
          BACK TO START
        </button>

        <div style={{
          position: "fixed", bottom: "20px", left: "50%", transform: "translateX(-50%)",
          display: "flex", gap: "10px", zIndex: 100, padding: "10px", background: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(10px)", borderRadius: "50px", border: "1px solid rgba(0, 243, 255, 0.2)",
          boxShadow: "0 0 20px rgba(0, 0, 0, 0.5)"
        }}>
          {Object.keys(ORBIT_CONFIG).map((hash) => (
            <button
              key={hash}
              onClick={() => window.location.hash = hash}
              style={{
                padding: "8px 15px",
                backgroundColor: currentHash === hash ? "rgba(0, 243, 255, 0.3)" : "transparent",
                color: currentHash === hash ? "#00f3ff" : "#fff",
                border: "none", borderRadius: "20px", fontSize: "12px", fontWeight: "bold",
                cursor: "pointer", textTransform: "uppercase", transition: "all 0.3s ease",
                borderBottom: currentHash === hash ? "2px solid #00f3ff" : "none"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(0, 243, 255, 0.2)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = currentHash === hash ? "rgba(0, 243, 255, 0.3)" : "transparent"; }}
            >
              {hash.replace("#", "")}
            </button>
          ))}
        </div>

      </motion.div>

      <AnimatePresence>
        {/* {showIntro && ( <IntroScreen onEnter={handleEnterScene} /> )} */}
      </AnimatePresence>
      
    </div>
  );
}