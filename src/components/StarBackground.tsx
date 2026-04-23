import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

const StarBackground: React.FC = () => {
  // 1. Load ảnh texture từ thư mục public/icons
  const texture = useTexture("/icons/background.jpg");
  const sphereRef = useRef<THREE.Mesh>(null);

  // 2. (Tùy chọn) Cho bầu trời xoay nhè nhẹ để tạo cảm giác vũ trụ đang chuyển động
  useFrame(() => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += 0.0002;
    }
  });

  return (
    <mesh ref={sphereRef}>
      {/* 3. Tạo một khối cầu khổng lồ (bán kính 5000) bao quanh toàn bộ hệ mặt trời */}
      <sphereGeometry args={[5000, 64, 64]} />
      
      {/* 4. Dán ảnh vào bề mặt. 
          Quan trọng: side={THREE.BackSide} giúp dán ảnh ở MẶT TRONG của khối cầu, 
          vì camera của chúng ta đang đứng ở bên trong nhìn ra ngoài. 
      */}
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
};

export default StarBackground;