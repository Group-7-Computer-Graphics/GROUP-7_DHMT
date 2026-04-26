import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const BackgroundEffects = () => {
  const config = {
    // Thiên thạch rơi liên tục
    meteorCount: 80, 
    meteorMinSpeed: 2,   // Tốc độ rơi tối thiểu
    meteorMaxSpeed: 5,   // Tốc độ rơi tối đa
    spawnZ: -1500,       // Điểm xuất phát ở xa
    limitZ: 500,         // Điểm biến mất (vượt qua camera)
    
    // Sao băng
    shootingStarCount: 30,
  };

  const meteorRef = useRef<THREE.Group>(null);
  const shootingStarRef = useRef<THREE.Group>(null);

  // 1. Khởi tạo dữ liệu ngẫu nhiên cho từng viên đá
  const meteorData = useMemo(() => {
    return Array.from({ length: config.meteorCount }).map(() => ({
      x: (Math.random() - 0.5) * 2000,
      y: (Math.random() - 0.5) * 2000,
      z: Math.random() * (config.limitZ - config.spawnZ) + config.spawnZ,
      scale: Math.random() * 5 + 2,
      speed: Math.random() * (config.meteorMaxSpeed - config.meteorMinSpeed) + config.meteorMinSpeed,
      rotSpeed: Math.random() * 0.02
    }));
  }, []);

  useFrame((state, delta) => {
    // Logic Thiên thạch rơi liên tục
    meteorRef.current?.children.forEach((child: any, i) => {
      // Bay về phía camera (trục Z tăng dần)
      child.position.z += child.userData.speed;
      
      // Tự xoay viên đá
      child.rotation.x += child.userData.rotSpeed;
      child.rotation.y += child.userData.rotSpeed;

      // Nếu bay quá camera (limitZ), reset ra phía xa (spawnZ)
      if (child.position.z > config.limitZ) {
        child.position.z = config.spawnZ;
        // Reset luôn X và Y ngẫu nhiên để không bị lặp lại đường cũ
        child.position.x = (Math.random() - 0.5) * 2000;
        child.position.y = (Math.random() - 0.5) * 2000;
      }
    });

    // Logic Sao băng rơi chéo
    shootingStarRef.current?.children.forEach((star: any) => {
      const speed = star.userData.speed || 15;
      star.position.x -= speed;
      star.position.y -= speed * 0.4;
      star.material.opacity = 0.4 + Math.abs(Math.sin(state.clock.elapsedTime * 10)) * 0.6;

      if (star.position.x < -1200) {
        star.position.x = 1200 + Math.random() * 500;
        star.position.y = 800 + Math.random() * 500;
      }
    });
  });

  return (
    <group>
      {/* Cơn mưa Thiên thạch */}
      <group ref={meteorRef}>
        {meteorData.map((data, i) => (
          <mesh 
            key={i} 
            position={[data.x, data.y, data.z]} 
            scale={data.scale}
            userData={{ speed: data.speed, rotSpeed: data.rotSpeed }}
          >
            <icosahedronGeometry args={[1, 0]} />
            <meshStandardMaterial 
              color="#e3e1e1" 
              flatShading={true} 
              metalness={0.2} 
              roughness={0.9} 
              emissive="#493c2a"    // Tự phát ra ánh sáng xám nhẹ (giúp hiện hình trong bóng tối)
    emissiveIntensity={1} // Độ mạnh của ánh sáng tự thân
            />
          </mesh>
        ))}
      </group>

      {/* Sao băng */}
      <group ref={shootingStarRef}>
        {Array.from({ length: config.shootingStarCount }).map((_, i) => (
          <mesh 
            key={i} 
            position={[(Math.random() - 0.5) * 2000, Math.random() * 1000, -800]}
            rotation={[0, 0, Math.PI / 8]}
            userData={{ speed: 15 + Math.random() * 10 }}
          >
            <boxGeometry args={[60, 0.8, 1]} />
            <meshBasicMaterial 
              color="#ffffff" 
              transparent 
              opacity={0.8} 
              blending={THREE.AdditiveBlending} 
            />
          </mesh>
        ))}
      </group>
    </group>
  );
};

export default BackgroundEffects;