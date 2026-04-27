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
    shootingStarCount: 25, // Tăng nhẹ để ngắm cho sướng
  };

  const meteorRef = useRef<THREE.Group>(null);
  const shootingStarRef = useRef<THREE.Group>(null);

  // -- TẠO TEXTURE VỆT SÁNG MỀM MẠI (Không cần file ảnh ngoài) --
  const streakTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, 512, 64); // Xóa phông nền thành trong suốt
      
      // Đổ bóng phát sáng (Glow)
      ctx.shadowColor = "white";
      ctx.shadowBlur = 15;
      ctx.fillStyle = "white";

      // Vẽ hình giọt nước kéo dài: Đuôi nhọn (trái) -> Đầu to bo tròn (phải)
      ctx.beginPath();
      ctx.moveTo(20, 32); 
      ctx.lineTo(480, 26); 
      ctx.arc(480, 32, 6, -Math.PI / 2, Math.PI / 2); 
      ctx.lineTo(20, 32); 
      ctx.fill();
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    return tex;
  }, []);

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

  // 2. KHỞI TẠO DỮ LIỆU SAO BĂNG ĐA HƯỚNG BẢN ĐẸP
  const shootingStarData = useMemo(() => {
    // Các dải màu cosmic (Trắng, Xanh nhạt, Vàng nhạt, Tím nhạt)
    const cosmicColors = ["#ffffff", "#aaccff", "#ffddaa", "#eebbff"];

    return Array.from({ length: config.shootingStarCount }).map(() => {
      const angle = Math.random() * Math.PI * 2; 
      const speed = 15 + Math.random() * 20;
      return {
        x: (Math.random() - 0.5) * 2500,
        y: (Math.random() - 0.5) * 2500,
        z: -800 + Math.random() * 400, // Thêm chiều sâu cho quỹ đạo
        speed: speed,
        velX: Math.cos(angle) * speed,
        velY: Math.sin(angle) * speed,
        angle: angle,
        
        // Custom cho mỗi ngôi sao
        color: cosmicColors[Math.floor(Math.random() * cosmicColors.length)],
        length: 80 + Math.random() * 100, // Chiều dài ngẫu nhiên
        thickness: 2 + Math.random() * 4, // Độ dày ngẫu nhiên
      };
    });
  }, [config.shootingStarCount]);

  useFrame((state) => {
    // Logic Thiên thạch
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

      // Nhịp độ lấp lánh mềm mại hơn (cộng thêm angle để không chớp tắt cùng lúc)
      star.material.opacity = 0.6 + Math.abs(Math.sin(state.clock.elapsedTime * 3 + star.userData.angle)) * 0.4;

      if (Math.abs(star.position.x) > 1500 || Math.abs(star.position.y) > 1500) {
        star.position.x = (Math.random() - 0.5) * 2500;
        star.position.y = (Math.random() - 0.5) * 2500;
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
              emissive="#5d5756"
              emissiveIntensity={0.5}
            />
          </mesh>
        ))}
      </group>

      {/* Group Sao băng ĐA HƯỚNG SIÊU THỰC */}
      <group ref={shootingStarRef}>
        {shootingStarData.map((data, i) => (
          <mesh
            key={`star-${i}`}
            position={[data.x, data.y, data.z]}
            rotation={[0, 0, data.angle]} 
            userData={{ velX: data.velX, velY: data.velY, speed: data.speed, angle: data.angle }}
          >
            {/* Chuyển từ Khối hộp (Box) sang Mặt phẳng (Plane) để gắn Texture */}
            <planeGeometry args={[data.length, data.thickness]} />
            
            <meshBasicMaterial
              map={streakTexture}
              color={data.color}
              transparent={true}
              opacity={0.8}
              depthWrite={false} // Khử viền đen khi đè lên nhau
              blending={THREE.AdditiveBlending} // Hiệu ứng cộng dồn ánh sáng (Glow)
            />
          </mesh>
        ))}
      </group>
    </group>
  );
};

export default BackgroundEffects;