import React, { useState, useEffect, Suspense, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, PerspectiveCamera, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// Import các hành tinh
import Sun from "../src/components/planets/Sun";
import Earth from "../src/components/planets/Earth";
import Mars from "../src/components/planets/Mars";
import Jupiter from "../src/components/planets/Jupiter";
import Saturn from "../src/components/planets/saturn"; 
import Mercury from "../src/components/planets/mecury";
import Neptune from "../src/components/planets/neptune"; 
import Uranus from "../src/components/planets/uranus";   
import Venus from "../src/components/planets/venus";     

// 1. Component điều khiển Camera bay và xoay tâm nhìn
function CameraController({ currentHash }: { currentHash: string }) {
  const { camera, controls } = useThree() as any;
  const lastHash = useRef(currentHash);

  const targetPositions: Record<string, { cameraPos: [number, number, number], target: [number, number, number] }> = {
    "#overview": { cameraPos: [250, 150, 500], target: [0, 0, 0] },
    "#mercury":  { cameraPos: [0, 10, 110],    target: [0, 0, 80] },
    "#venus":    { cameraPos: [0, 10, 175],    target: [0, 0, 140] },
    "#earth":    { cameraPos: [0, 10, 245],    target: [0, 0, 210] },
    "#mars":     { cameraPos: [0, 10, 335],    target: [0, 0, 300] },
    "#jupiter":  { cameraPos: [0, 30, 580],    target: [0, 0, 480] },
    "#saturn":   { cameraPos: [0, 30, 780],    target: [0, 0, 680] },
    "#uranus":   { cameraPos: [0, 20, 960],    target: [0, 0, 880] },
    "#neptune":  { cameraPos: [0, 20, 1130],   target: [0, 0, 1050] },
  };

  useFrame(() => {
    if (controls) {
      const config = targetPositions[currentHash] || targetPositions["#overview"];
      const targetVec = new THREE.Vector3(...config.cameraPos);
      const targetCenter = new THREE.Vector3(...config.target);

      // NẾU HASH THAY ĐỔI (Người dùng vừa cuộn chuột sang hành tinh mới)
      if (lastHash.current !== currentHash) {
        // Bay mượt tới vị trí chính diện mới
        camera.position.lerp(targetVec, 0.05);
        controls.target.lerp(targetCenter, 0.05);
        
        // Nếu đã bay gần tới nơi (khoảng cách < 0.5) thì xác nhận xong lượt chuyển
        if (camera.position.distanceTo(targetVec) < 0.5) {
          lastHash.current = currentHash;
        }
        controls.update();
      } 
      // NẾU ĐANG Ở YÊN MỘT HÀNH TINH: Trả lại quyền tự do hoàn toàn cho OrbitControls
      else if (controls.active) {
        controls.update();
      }
    }
  });

  return null;
}

export default function SolarSystem() {
  const [currentHash, setCurrentHash] = useState("#overview");
  const [controlsEnabled, setControlsEnabled] = useState(true);

  // Thứ tự hành tinh để cuộn
  const planetHashes = ["#overview", "#mercury", "#venus", "#earth", "#mars", "#jupiter", "#saturn", "#uranus", "#neptune"];

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash || "#overview");
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // 2. Logic xử lý vuốt chuột để chuyển Hash
  const handleWheel = (e: React.WheelEvent) => {
    // Chặn việc nhảy quá nhanh
    const currentIndex = planetHashes.indexOf(currentHash);
    if (e.deltaY > 50 && currentIndex < planetHashes.length - 1) {
      window.location.hash = planetHashes[currentIndex + 1];
    } else if (e.deltaY < -50 && currentIndex > 0) {
      window.location.hash = planetHashes[currentIndex - 1];
    }
  };

  return (
    <div 
      onWheel={handleWheel} // Bắt sự kiện vuốt chuột ở đây
      style={{ width: "100vw", height: "100vh", backgroundColor: "black", overflow: "hidden" }}
    >
      <Canvas gl={{ antialias: true }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault fov={50} far={10000} />
          
          {/* OrbitControls: Cho phép xoay ngắm bao quát */}
          <OrbitControls 
            makeDefault 
            enablePan={false} 
            minDistance={10} 
            maxDistance={3000}
            enableDamping={true}
			dampingFactor={0.05} // Giúp xoay chuột mượt hơn, có độ quán tính
			rotateSpeed={0.8}
            onStart={() => {
     // Khi ông bắt đầu nhấn chuột xoay hoặc zoom
              controlsEnabled && setControlsEnabled(true);
            }}
          />

          <CameraController currentHash={currentHash} />

          <ambientLight intensity={0.1} /> 
          <pointLight position={[0, 0, 0]} intensity={20} color="#fff8e1" distance={3000} />
          <Stars radius={300} depth={60} count={15000} factor={7} saturation={0} fade speed={1} />

          {/* Các hành tinh */}
          <Sun isActive={currentHash === "#overview"} />
          <Mercury isActive={currentHash === "#mercury"} setControlsEnabled={setControlsEnabled} onClick={() => window.location.hash = "#mercury"} />
          <Venus isActive={currentHash === "#venus"} setControlsEnabled={setControlsEnabled} onClick={() => window.location.hash = "#venus"} />
          <Earth isActive={currentHash === "#earth"} setControlsEnabled={setControlsEnabled} onClick={() => window.location.hash = "#earth"} />
          <Mars isActive={currentHash === "#mars"} setControlsEnabled={setControlsEnabled} onClick={() => window.location.hash = "#mars"} />
          <Jupiter isActive={currentHash === "#jupiter"} setControlsEnabled={setControlsEnabled} onClick={() => window.location.hash = "#jupiter"} />
          <Saturn isActive={currentHash === "#saturn"} setControlsEnabled={setControlsEnabled} onClick={() => window.location.hash = "#saturn"} />
          <Uranus isActive={currentHash === "#uranus"} setControlsEnabled={setControlsEnabled} onClick={() => window.location.hash = "#uranus"} />
          <Neptune isActive={currentHash === "#neptune"} setControlsEnabled={setControlsEnabled} onClick={() => window.location.hash = "#neptune"} />

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