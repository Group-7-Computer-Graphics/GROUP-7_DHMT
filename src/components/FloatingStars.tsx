import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function FloatingStars({ count = 6000 }) {
  const pointsRef = useRef<THREE.Points>(null!);

  // Tạo vị trí sao
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 4000;     // x
      arr[i * 3 + 1] = (Math.random() - 0.5) * 2000; // y
      arr[i * 3 + 2] = (Math.random() - 0.5) * 4000; // z
    }
    return arr;
  }, [count]);

  // Làm sao bay lơ lửng
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.02;
    if (pointsRef.current) {
      pointsRef.current.rotation.y = t;
      pointsRef.current.rotation.x = t * 0.3;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="white"
        size={2}
        sizeAttenuation
        transparent
        opacity={0.8}
      />
    </points>
  );
}