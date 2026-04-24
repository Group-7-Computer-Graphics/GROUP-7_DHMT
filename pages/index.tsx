import React, { useState, useEffect, Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, PerspectiveCamera, OrbitControls, Line } from "@react-three/drei"; 
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

// Import các hành tinh (Giữ nguyên của ông)
import Sun from "../src/components/planets/Sun";
import Earth from "../src/components/planets/Earth";
import Mars from "../src/components/planets/Mars";
import Jupiter from "../src/components/planets/Jupiter";
import Saturn from "../src/components/planets/saturn"; 
import Mercury from "../src/components/planets/mecury";
import Neptune from "../src/components/planets/neptune"; 
import Uranus from "../src/components/planets/uranus";   
import Venus from "../src/components/planets/venus";      

//Vân Thêm khai báo type cho planetData 
const planetData: Record<string, any> = {
  "#mercury": {
    name: " MERCURY", type: "PLANET",
    visit: "Mercury is the smallest planet in our solar system and the closest to the Sun. It experiences extreme temperature fluctuations, freezing at night and scorching during the day.",
    encyclopedia: "A terrestrial planet with a heavily cratered surface, much like Earth's Moon. It has no moons and almost no atmosphere to retain heat.",
    structure: "Mercury has a large, dense metallic core that makes up about 85% of its radius, surrounded by a rocky mantle and a thin solid crust.",
    question: "Hành tinh nào gần Mặt Trời nhất?",
    options: ["A. Sao Kim", "B. Sao Thủy", "C. Sao Hỏa", "D. Sao Mộc"],
    correctAnswer: 1
  },
  "#venus": {
    name: "VENUS", type: "PLANET",
    visit: "Often called Earth's twin due to its similar size, but its surface is a toxic, superheated wasteland with crushing atmospheric pressure.",
    encyclopedia: "The second planet from the Sun, featuring a thick atmosphere rich in carbon dioxide and clouds of sulfuric acid that trap heat in a runaway greenhouse effect.",
    structure: "Similar to Earth, Venus has an iron core, a rocky mantle, and a silicate crust. Its surface is dominated by volcanic features.",
    question: "Hành tinh nào nóng nhất hệ Mặt Trời?",
    options: ["A. Sao Thủy", "B. Trái Đất", "C. Sao Kim", "D. Sao Hỏa"],
    correctAnswer: 2
  },
  "#earth": {
    name: "EARTH", type: "PLANET",
    visit: "Our home planet, the third from the Sun, and the only place we know of so far that's inhabited by living things.",
    encyclopedia: "Earth is a water world with 71% of its surface covered by oceans. It has a dynamic atmosphere that sustains life and protects us from meteoroids.",
    structure: "Earth is composed of four main layers: a solid inner core, a liquid outer core, a thick rocky mantle, and a rocky crust.",
    question: "Hành tinh nào chúng ta đang sống?",
    options: ["A. Sao Hỏa", "B. Trái Đất", "C. Sao Kim", "D. Sao Thổ"],
    correctAnswer: 1
  },
  "#mars": {
    name: "MARS", type: "PLANET",
    visit: "The Red Planet, a dusty, cold, desert world with a very thin atmosphere. It is one of the most explored bodies in our solar system.",
    encyclopedia: "The fourth planet from the Sun. It features surface elements reminiscent of both the impact craters of the Moon and the valleys, deserts, and polar ice caps of Earth.",
    structure: "Mars has a dense core of iron, nickel, and sulfur, surrounded by a rocky mantle and a crust made of volcanic rock. Its red color comes from iron oxide (rust).",
    question: "Hành tinh nào được gọi là “hành tinh đỏ”?",
    options: ["A. Sao Mộc", "B. Sao Hỏa", "C. Sao Kim", "D. Sao Thủy"],
    correctAnswer: 1
  },
  "#jupiter": {
    name: "JUPITER", type: "GAS GIANT",
    visit: "The largest planet in our solar system. It is a massive gas giant with swirling cloud stripes and massive storms, including the Great Red Spot.",
    encyclopedia: "The fifth planet from the Sun. It has dozens of moons and a dark, barely-visible ring system. It acts as a massive vacuum cleaner for the solar system.",
    structure: "Primarily composed of hydrogen and helium. It lacks a well-defined solid surface, transitioning gradually from gas to a vast ocean of liquid metallic hydrogen.",
    question: "Hành tinh nào lớn nhất hệ Mặt Trời?",
    options: ["A. Sao Thổ", "B. Sao Hải Vương", "C. Sao Mộc", "D. Sao Thiên Vương"], correctAnswer: 2
  },
  "#saturn": {
    name: "SATURN", type: "GAS GIANT",
    visit: "Adorned with a dazzling, complex system of icy rings, Saturn is widely considered the most beautiful planet in our solar system.",
    encyclopedia: "The sixth planet from the Sun and the second-largest. It is a gas giant with an extensive moon system, including Titan, which has its own thick atmosphere.",
    structure: "Made mostly of hydrogen and helium. It likely has a dense, rocky core surrounded by a deep layer of liquid metallic hydrogen.",
    question: "Hành tinh nào có vành đai nổi bật nhất?",
    options: ["A. Sao Mộc", "B. Sao Thổ", "C. Sao Kim", "D. Sao Hỏa"], correctAnswer: 1
  },
  "#uranus": {
    name: "URANUS", type: "ICE GIANT",
    visit: "An ice giant that is unique because it rotates on its side. It has a distinct pale blue-green color.",
    encyclopedia: "The seventh planet from the Sun. It was the first planet found with the aid of a telescope. It has 27 known moons and faint rings.",
    structure: "Mostly composed of flowing icy materials (water, ammonia, methane) above a small rocky core. Its atmosphere contains hydrogen, helium, and methane.",
    question: "Hành tinh nào có màu xanh do khí methane?",
    options: ["A. Sao Kim", "B. Sao Thiên Vương", "C. Sao Hỏa", "D. Sao Thủy"], correctAnswer: 1
  },
  "#neptune": {
    name: "NEPTUNE", type: "ICE GIANT",
    visit: "Dark, cold, and whipped by supersonic winds, Neptune is the last of the major planets in our solar system.",
    encyclopedia: "The eighth and most distant major planet orbiting our Sun. It is an ice giant with a faint ring system and 14 known moons.",
    structure: "Its structure is similar to Uranus, consisting of a hot, dense fluid or 'icy' mantle (water, ammonia, and methane) over an Earth-sized solid core.",
    question: "Hành tinh xa Mặt Trời nhất là gì?",
    options: ["A. Sao Thiên Vương", "B. Sao Hải Vương", "C. Sao Thổ", "D. Sao Mộc"], correctAnswer: 1
  }
};

// Dán đoạn này ngay dưới planetData
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

// --- NÚT BẤM PHONG CÁCH VIỄN TƯỞNG ---
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
        clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)", // Vát góc
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

// --- BẢNG THÔNG TIN ĐÃ FIX VỊ TRÍ & TRANG TRÍ CỰC NGẦU ---
function PlanetInfoPanel({ currentHash }: { currentHash: string }) {
  const [activeView, setActiveView] = useState<string>("menu");
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const data = planetData[currentHash];

  useEffect(() => { setActiveView("menu"); setSelectedAnswer(null); }, [currentHash]);

  if (!data) return null;

  const handleAnswerClick = (index: number) => {
    if (selectedAnswer === null) setSelectedAnswer(index);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentHash}
        initial={{ x: -300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -300, opacity: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        style={{
          // 1. ĐÃ SỬA VỊ TRÍ: Đẩy lên 8% từ cạnh trên, không còn bị sát đáy nữa
          position: "absolute", top: "8%", left: "60px", 
          width: "380px", zIndex: 10, color: "white", fontFamily: "sans-serif",
          
          // 2. TRANG TRÍ NỀN: Kết hợp kính mờ và hiệu ứng đường quét (Scanlines)
          background: `
            repeating-linear-gradient(
              0deg,
              rgba(0, 0, 0, 0.1),
              rgba(0, 0, 0, 0.1) 1px,
              transparent 1px,
              transparent 2px
            ),
            linear-gradient(135deg, rgba(2, 11, 26, 0.85) 0%, rgba(0, 34, 68, 0.6) 100%)
          `,
          border: "1px solid rgba(0, 243, 255, 0.3)",
          borderTop: "3px solid #00f3ff", // Vạch sáng dày ở trên
          borderBottom: "3px solid #00f3ff", // Vạch sáng dày ở dưới
          boxShadow: "0 0 40px rgba(0, 243, 255, 0.2), inset 0 0 20px rgba(0, 243, 255, 0.1)",
          borderRadius: "4px", padding: "30px", backdropFilter: "blur(15px)",
          // 3. TRANG TRÍ HÌNH DÁNG: Vát góc dưới bên phải kiểu UI phi thuyền
          clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 25px), calc(100% - 25px) 100%, 0 100%)"
        }}
      >
        {/* TRANG TRÍ: Hiển thị trạng thái hệ thống giả lập */}
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#00f3ff", marginBottom: "15px", opacity: 0.8, letterSpacing: "2px", textTransform: "uppercase" }}>
          <span>SYS.DAT // {currentHash.replace("#", "")}</span>
          <span>[ SCANNING... ]</span>
        </div>

        {/* TIÊU ĐỀ: Thêm viền đứt đoạn và hiệu ứng phát sáng neon mạnh hơn */}
        <div style={{ textAlign: "center", marginBottom: "30px", borderBottom: "1px dashed rgba(0, 243, 255, 0.4)", paddingBottom: "15px", position: "relative" }}>
          <h1 style={{ margin: 0, fontSize: "44px", fontWeight: "900", letterSpacing: "6px", color: "#e0f7fa", textShadow: "0 0 20px #00f3ff, 0 0 40px #00f3ff" }}>
            {data.name}
          </h1>
          <p style={{ margin: "5px 0 0 0", fontSize: "14px", color: "#00f3ff", letterSpacing: "8px" }}>
            {data.type}
          </p>
          {/* TRANG TRÍ: 2 chấm sáng ở góc viền */}
          <div style={{ position: "absolute", bottom: "-3px", left: "0", width: "5px", height: "5px", backgroundColor: "#00f3ff", boxShadow: "0 0 10px #00f3ff" }}></div>
          <div style={{ position: "absolute", bottom: "-3px", right: "0", width: "5px", height: "5px", backgroundColor: "#00f3ff", boxShadow: "0 0 10px #00f3ff" }}></div>
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
            <h3 style={{ marginTop: 0, color: "#00f3ff", fontSize: "16px", textTransform: "uppercase", letterSpacing: "2px" }}>
              {activeView}
            </h3>
            <p style={{ fontSize: "15px", lineHeight: "1.6", color: "#d0e8f2", marginBottom: "25px", fontWeight: "300" }}>
              {data[activeView]}
            </p>
            <MenuButton text="BACK TO MENU" onClick={() => setActiveView("menu")} highlight />
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
                  if (index === data.correctAnswer) { bgColor = "rgba(0, 255, 0, 0.2)"; borderColor = "#00ff00"; textColor = "#00ff00"; }
                  else if (index === selectedAnswer) { bgColor = "rgba(255, 0, 0, 0.2)"; borderColor = "#ff0000"; textColor = "#ff0000"; }
                }
                return (
                  <button
                    key={index} onClick={() => handleAnswerClick(index)}
                    style={{ padding: "12px", textAlign: "left", backgroundColor: bgColor, border: `1px solid ${borderColor}`, color: textColor, cursor: selectedAnswer === null ? "pointer" : "default", borderRadius: "4px", transition: "all 0.3s", clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)" }}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            {selectedAnswer !== null && <MenuButton text="BACK TO MENU" onClick={() => { setActiveView("menu"); setSelectedAnswer(null); }} highlight />}
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

// --- 1. COMPONENT VẼ ĐƯỜNG QUỸ ĐẠO ---
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

// --- 2. COMPONENT TRỤC QUAY CHO HÀNH TINH ---
function OrbitGroup({ speed, children }: { speed: number, children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * speed;
    }
  });
  return <group ref={groupRef}>{children}</group>;
}

// --- 3. CAMERA CONTROLLER ĐÃ THÊM TÍNH NĂNG ĐẨY HÀNH TINH SANG PHẢI ---
function CameraController({ currentHash }: { currentHash: string }) {
  const { camera, controls } = useThree() as any;
  const isUserDragging = useRef(false);

  // ==========================================================
  // ĐÂY LÀ PHÉP MÀU: MÁNH KHÓE ĐẨY HÀNH TINH SANG PHẢI
  // ==========================================================
  useEffect(() => {
    const updateOffset = () => {
      if (currentHash !== "#overview") {
        // Shift camera sang trái 20% màn hình (0.2), ép vật thể bay sang phải
        const shift = window.innerWidth * 0.2; 
        camera.setViewOffset(window.innerWidth, window.innerHeight, -shift, 0, window.innerWidth, window.innerHeight);
      } else {
        camera.clearViewOffset(); // Reset căn giữa khi về màn hình tổng (Mặt Trời)
      }
      camera.updateProjectionMatrix();
    };
    
    updateOffset();
    window.addEventListener("resize", updateOffset);
    return () => window.removeEventListener("resize", updateOffset);
  }, [currentHash, camera]);
  // ==========================================================

  const orbitConfig: Record<string, { radius: number, speed: number, camOffset: [number, number, number] }> = useMemo(() => ({
    "#mercury":  { radius: 80,   speed: 0.5,  camOffset: [0, 10, 30] },
    "#venus":    { radius: 140,  speed: 0.35, camOffset: [0, 10, 35] },
    "#earth":    { radius: 210,  speed: 0.25, camOffset: [0, 10, 35] },
    "#mars":     { radius: 300,  speed: 0.2,  camOffset: [0, 10, 35] },
    "#jupiter":  { radius: 480,  speed: 0.1,  camOffset: [0, 30, 100] },
    "#saturn":   { radius: 680,  speed: 0.08, camOffset: [0, 30, 100] },
    "#uranus":   { radius: 880,  speed: 0.05, camOffset: [0, 20, 80] },
    "#neptune":  { radius: 1050, speed: 0.03, camOffset: [0, 20, 80] },
  }), []);

  // Bắt sự kiện khi người dùng click/chạm vào màn hình để xoay cam
  useEffect(() => {
    if (!controls) return;
    const onStartDrag = () => { isUserDragging.current = true; };
    controls.addEventListener("start", onStartDrag);
    return () => controls.removeEventListener("start", onStartDrag);
  }, [controls]);

  // Reset lại trạng thái khi bấm sang hành tinh khác
  useEffect(() => {
    isUserDragging.current = false;
  }, [currentHash]);

  useFrame(({ clock }) => {
    if (!controls) return;

    const time = clock.getElapsedTime();
    let targetCenter = new THREE.Vector3(0, 0, 0); 
    let targetCamPos = new THREE.Vector3(250, 150, 500); 

    if (currentHash !== "#overview" && orbitConfig[currentHash]) {
      const config = orbitConfig[currentHash];
      const angle = time * config.speed; 
      
      const planetX = Math.sin(angle) * config.radius;
      const planetZ = Math.cos(angle) * config.radius;
      
      targetCenter.set(planetX, 0, planetZ);

      targetCamPos.set(
        planetX + config.camOffset[0],
        config.camOffset[1],
        planetZ + config.camOffset[2]
      );
    }

    // 1. Luôn cho tâm ngắm (target) bám theo hành tinh đang chạy
    controls.target.lerp(targetCenter, 0.05);

    // 2. CHỈ ép vị trí camera khi người dùng chưa tự ý xoay tay
    if (!isUserDragging.current) {
      camera.position.lerp(targetCamPos, 0.05);
    }

    // 3. Cập nhật thay đổi
    controls.update();
  });

  return null;
}

export default function SolarSystem() {
  const [currentHash, setCurrentHash] = useState("#overview");
  const [controlsEnabled, setControlsEnabled] = useState(true);

  const planetHashes = ["#overview", "#mercury", "#venus", "#earth", "#mars", "#jupiter", "#saturn", "#uranus", "#neptune"];

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash || "#overview");
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleWheel = (e: React.WheelEvent) => {
    const currentIndex = planetHashes.indexOf(currentHash);
    if (e.deltaY > 50 && currentIndex < planetHashes.length - 1) {
      window.location.hash = planetHashes[currentIndex + 1];
    } else if (e.deltaY < -50 && currentIndex > 0) {
      window.location.hash = planetHashes[currentIndex - 1];
    }
  };

  return (
    <div 
      onWheel={handleWheel}
      style={{ width: "100vw", height: "100vh", backgroundColor: "black", overflow: "hidden" }}
    >
      <Canvas gl={{ antialias: true }} dpr={[1, 2]}>
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
            onStart={() => {
              controlsEnabled && setControlsEnabled(true);
            }}
          />

          <CameraController currentHash={currentHash} />

          <ambientLight intensity={0.1} /> 
          <pointLight position={[0, 0, 0]} intensity={20} color="#fff8e1" distance={3000} />
          
          <Stars radius={3000} depth={150} count={20000} factor={7} saturation={0} fade speed={1} />

          <Sun isActive={currentHash === "#overview"} />

          {/* QUỸ ĐẠO MỜ */}
          <OrbitLine radius={80} />
          <OrbitLine radius={140} />
          <OrbitLine radius={210} />
          <OrbitLine radius={300} />
          <OrbitLine radius={480} />
          <OrbitLine radius={680} />
          <OrbitLine radius={880} />
          <OrbitLine radius={1050} />

          {/* HÀNH TINH BAY QUANH MẶT TRỜI */}
          <OrbitGroup speed={0.5}><Mercury isActive={currentHash === "#mercury"} setControlsEnabled={setControlsEnabled} onClick={() => window.location.hash = "#mercury"} /></OrbitGroup>
          <OrbitGroup speed={0.35}><Venus isActive={currentHash === "#venus"} setControlsEnabled={setControlsEnabled} onClick={() => window.location.hash = "#venus"} /></OrbitGroup>
          <OrbitGroup speed={0.25}><Earth isActive={currentHash === "#earth"} setControlsEnabled={setControlsEnabled} onClick={() => window.location.hash = "#earth"} /></OrbitGroup>
          <OrbitGroup speed={0.2}><Mars isActive={currentHash === "#mars"} setControlsEnabled={setControlsEnabled} onClick={() => window.location.hash = "#mars"} /></OrbitGroup>
          <OrbitGroup speed={0.1}><Jupiter isActive={currentHash === "#jupiter"} setControlsEnabled={setControlsEnabled} onClick={() => window.location.hash = "#jupiter"} /></OrbitGroup>
          <OrbitGroup speed={0.08}><Saturn isActive={currentHash === "#saturn"} setControlsEnabled={setControlsEnabled} onClick={() => window.location.hash = "#saturn"} /></OrbitGroup>
          <OrbitGroup speed={0.05}><Uranus isActive={currentHash === "#uranus"} setControlsEnabled={setControlsEnabled} onClick={() => window.location.hash = "#uranus"} /></OrbitGroup>
          <OrbitGroup speed={0.03}><Neptune isActive={currentHash === "#neptune"} setControlsEnabled={setControlsEnabled} onClick={() => window.location.hash = "#neptune"} /></OrbitGroup>

        </Suspense>
      </Canvas>

      //Vân
      {currentHash !== "#overview" && (
        <PlanetInfoPanel currentHash={currentHash} />
      )}

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
    </div>
  );
}