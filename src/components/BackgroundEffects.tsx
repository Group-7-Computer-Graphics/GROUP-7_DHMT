import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";

const BackgroundEffects = () => {
  const rockTexture = useTexture("/icons/thienthach.jpg");
  rockTexture.wrapS = rockTexture.wrapT = THREE.RepeatWrapping;

  const config = {
    meteorCount: 50,
    meteorMinSpeed: 2,
    meteorMaxSpeed: 7,
    spawnZ: -1800,
    limitZ: 600,
    shootingStarCount: 16, // Tăng nhẹ cho đẹp
  };

  const meteorRef = useRef<THREE.Group>(null);
  const shootingStarRef = useRef<THREE.Group>(null);

  // 1. Dữ liệu thiên thạch 3D
  const meteorData = useMemo(() => {
    return Array.from({ length: config.meteorCount }).map(() => ({
      x: (Math.random() - 0.5) * 2500,
      y: (Math.random() - 0.5) * 2000,
      z: Math.random() * (config.limitZ - config.spawnZ) + config.spawnZ,
      scale: new THREE.Vector3(
        Math.random() * 8 + 4,
        Math.random() * 8 + 4,
        Math.random() * 8 + 4
      ),
      rotation: [
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI,
      ] as [number, number, number],
      speed: Math.random() * (config.meteorMaxSpeed - config.meteorMinSpeed) + config.meteorMinSpeed,
      rotSpeed: (Math.random() - 0.5) * 0.02,
    }));
  }, []);

  // 2. KHỞI TẠO DỮ LIỆU SAO BĂNG ĐA HƯỚNG
  const shootingStarData = useMemo(() => {
    return Array.from({ length: config.shootingStarCount }).map(() => {
      const angle = Math.random() * Math.PI * 2; // Góc bay bất kỳ 360 độ
      const speed = 15 + Math.random() * 15;
      return {
        x: (Math.random() - 0.5) * 2000,
        y: (Math.random() - 0.5) * 2000,
        z: -800,
        speed: speed,
        velX: Math.cos(angle) * speed,
        velY: Math.sin(angle) * speed,
        angle: angle,
      };
    });
  }, []);

  useFrame((state) => {
    // Logic Thiên thạch (Giữ nguyên)
    meteorRef.current?.children.forEach((child: any) => {
      child.position.z += child.userData.speed;
      child.rotation.x += child.userData.rotSpeed;
      child.rotation.y += child.userData.rotSpeed;
      if (child.position.z > config.limitZ) {
        child.position.z = config.spawnZ;
        child.position.x = (Math.random() - 0.5) * 2500;
        child.position.y = (Math.random() - 0.5) * 2000;
      }
    });

    // Logic Sao băng đa hướng
    shootingStarRef.current?.children.forEach((star: any) => {
      star.position.x += star.userData.velX;
      star.position.y += star.userData.velY;

      star.material.opacity = 0.4 + Math.abs(Math.sin(state.clock.elapsedTime * 15)) * 0.6;

      // Reset khi bay xa quá 1500 đơn vị
      if (Math.abs(star.position.x) > 1500 || Math.abs(star.position.y) > 1500) {
        star.position.x = (Math.random() - 0.5) * 2000;
        star.position.y = (Math.random() - 0.5) * 2000;
        
        // Tạo hướng mới khi reset
        const newAngle = Math.random() * Math.PI * 2;
        star.userData.velX = Math.cos(newAngle) * star.userData.speed;
        star.userData.velY = Math.sin(newAngle) * star.userData.speed;
        star.rotation.z = newAngle;
      }
    });
  });

  return (
    <group>
      {/* Group Thiên thạch */}
      <group ref={meteorRef}>
        {meteorData.map((data, i) => (
          <mesh
            key={i}
            position={[data.x, data.y, data.z]}
            scale={data.scale}
            rotation={data.rotation}
            userData={{ speed: data.speed, rotSpeed: data.rotSpeed }}
          >
            <icosahedronGeometry args={[1, 1]} />
            <meshStandardMaterial
              map={rockTexture}
              color="#bfb5a2"
              flatShading={true}
              roughness={1}
              metalness={0.1}
              emissive="#c97467"
              emissiveIntensity={0.5}
            />
          </mesh>
        ))}
      </group>

      {/* Group Sao băng ĐA HƯỚNG */}
      <group ref={shootingStarRef}>
        {shootingStarData.map((data, i) => (
          <mesh
            key={i}
            position={[data.x, data.y, data.z]}
            rotation={[0, 0, data.angle]} // Xoay mesh theo hướng bay
            userData={{ velX: data.velX, velY: data.velY, speed: data.speed }}
          >
            <boxGeometry args={[100, 0.6, 0.6]} />
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