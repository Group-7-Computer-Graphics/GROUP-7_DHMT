import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface AsteroidBeltProps {
  count: number;
  innerRadius: number;
  outerRadius: number;
  speedFactor: number;
}

export const AsteroidBelt: React.FC<AsteroidBeltProps> = ({ count, innerRadius, outerRadius, speedFactor }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  // 1. XÓA eccentricity hoặc đặt bằng 1 để nó thành HÌNH TRÒN
  // const eccentricity = 0.7; (Bỏ dòng này)

  const asteroids = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
      const angle = Math.random() * Math.PI * 2;
      const speed = (0.01 + Math.random() * 0.02) * speedFactor; // Tăng nhẹ tốc độ cho sinh động
      const size = 0.1 + Math.random() * 0.3; 
      
      // Tạo độ cao y cố định cho mỗi viên đá để tránh bị "giật" trong useFrame
      const yOffset = (Math.random() - 0.5) * 5; 

      temp.push({ radius, angle, speed, size, yOffset });
    }
    return temp;
  }, [count, innerRadius, outerRadius, speedFactor]);

  const dummy = useMemo(() => new THREE.Object3D(), []); // Khởi tạo dummy ngoài useFrame để tối ưu

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();

    asteroids.forEach((ast, i) => {
      const currentAngle = ast.angle + t * ast.speed;
      
      // 2. FIX QUỸ ĐẠO TRÒN: Trục x và z đều nhân thuần với radius
      const x = Math.cos(currentAngle) * ast.radius;
      const z = Math.sin(currentAngle) * ast.radius; // <--- KHÔNG nhân 0.7 nữa
      const y = ast.yOffset; 

      dummy.position.set(x, y, z);
      dummy.scale.setScalar(ast.size * 15);
      dummy.rotation.set(t * ast.speed * 2, t * ast.speed * 2, 0);
      dummy.updateMatrix();
      
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[1, 0]} /> 
      <meshBasicMaterial color="#ffffff" transparent={true} opacity={0.6} />
    </instancedMesh>
  );
};