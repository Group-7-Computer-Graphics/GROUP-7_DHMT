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
  return <Line points={points} color="white" lineWidth={1.8} transparent opacity={0.3} />;
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

// --- 3. CAMERA CONTROLLER ĐÃ FIX LỖI GIẬT CAM ---
function CameraController({ currentHash }: { currentHash: string }) {
  const { camera, controls } = useThree() as any;
  // Thêm cờ nhận biết người dùng đang kéo chuột
  const isUserDragging = useRef(false);

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