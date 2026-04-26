import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";

const BackgroundEffects = () => {
  // 1. Load texture đá từ đường dẫn local
  // Ông hãy để file ảnh 'thienthach.jpg' vào folder public/icons/ nhé
  const rockTexture = useTexture("/icons/thienthach.jpg");
  rockTexture.wrapS = rockTexture.wrapT = THREE.RepeatWrapping;

  const config = {
    // Thiên thạch 3D
    meteorCount: 60,       // Giảm số lượng để tăng hiệu năng khi dùng Mesh
    meteorMinSpeed: 2,
    meteorMaxSpeed: 7,
    spawnZ: -1800,
    limitZ: 600,

    // Sao băng (vẫn giữ nguyên làm điểm nhấn)
    shootingStarCount: 20,
  };

  const meteorRef = useRef<THREE.Group>(null);
  const shootingStarRef = useRef<THREE.Group>(null);

  // 2. Tạo dữ liệu 3D cho từng cục đá
  const meteorData = useMemo(() => {
    return Array.from({ length: config.meteorCount }).map(() => ({
      x: (Math.random() - 0.5) * 2500,
      y: (Math.random() - 0.5) * 2000,
      z: Math.random() * (config.limitZ - config.spawnZ) + config.spawnZ,
      // Tạo hình dạng 3D góc cạnh khác nhau bằng scale ngẫu nhiên
      scale: new THREE.Vector3(
        Math.random() * 8 + 4,
        Math.random() * 8 + 4,
        Math.random() * 8 + 4
      ),
      // Xoay ngẫu nhiên
      rotation: [
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI,
      ] as [number, number, number],
      speed:
        Math.random() * (config.meteorMaxSpeed - config.meteorMinSpeed) +
        config.meteorMinSpeed,
      rotSpeed: (Math.random() - 0.5) * 0.02,
    }));
  }, []);

  useFrame((state, delta) => {
    // Logic cho Thiên thạch 3D
    meteorRef.current?.children.forEach((child: any) => {
      // Bay về phía camera
      child.position.z += child.userData.speed;
      // Tự xoay
      child.rotation.x += child.userData.rotSpeed;
      child.rotation.y += child.userData.rotSpeed;

      // Reset vị trí
      if (child.position.z > config.limitZ) {
        child.position.z = config.spawnZ;
        child.position.x = (Math.random() - 0.5) * 2500;
        child.position.y = (Math.random() - 0.5) * 2000;
      }
    });

    // Logic cho Sao băng (giữ nguyên)
    shootingStarRef.current?.children.forEach((star: any) => {
      const speed = star.userData.speed || 15;
      star.position.x -= speed;
      star.position.y -= speed * 0.4;
      star.material.opacity =
        0.4 + Math.abs(Math.sin(state.clock.elapsedTime * 10)) * 0.6;
      if (star.position.x < -1400) {
        star.position.x = 1400 + Math.random() * 500;
        star.position.y = 800 + Math.random() * 500;
      }
    });
  });

  return (
    <group>
      {/* 3. Group Thiên thạch 3D chân thực */}
      <group ref={meteorRef}>
        {meteorData.map((data, i) => (
          <mesh
            key={i}
            position={[data.x, data.y, data.z]}
            scale={data.scale} // Áp dụng scale 3D khác nhau
            rotation={data.rotation} // Áp dụng xoay ngẫu nhiên ban đầu
            userData={{ speed: data.speed, rotSpeed: data.rotSpeed }}
          >
            {/* Sử dụng detail=1 để giữ góc cạnh của đá tảng, không quá tròn */}
            <icosahedronGeometry args={[1, 1]} />

            <meshStandardMaterial
              map={rockTexture} // Dán texture đá
              color="#bfb5a2" // Màu đá tông nâu xám trung tính
              flatShading={true} // Bật cái này để nhìn rõ các hốc đá và góc cạnh 3D
              roughness={1} // Đá thì không nên bóng quá
              metalness={0.1}
              // Hiệu ứng emissive nhẹ để nhìn rõ vân đá trong đêm tối
              emissive="#c97467"
              emissiveIntensity={0.5}
            />
          </mesh>
        ))}
      </group>

      {/* Sao băng - Giữ nguyên */}
      <group ref={shootingStarRef}>
        {Array.from({ length: config.shootingStarCount }).map((_, i) => (
          <mesh
            key={i}
            position={[
              (Math.random() - 0.5) * 2500,
              Math.random() * 1000,
              -800,
            ]}
            rotation={[0, 0, Math.PI / 8]}
            userData={{ speed: 18 + Math.random() * 10 }}
          >
            <boxGeometry args={[80, 0.5, 0.5]} />
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