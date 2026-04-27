import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Star = {
  positions: Float32Array;
  geometry: THREE.BufferGeometry;
  speed: number;
};

export default function ShootingStars({ count = 20 }) {
  const stars = useMemo<Star[]>(() => {
    return Array.from({ length: count }, () => {
      const trailLength = 15;

      const positions = new Float32Array(trailLength * 3);

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );

      // vị trí ban đầu
      const startX = Math.random() * 2000 + 800;
      const startY = Math.random() * 800 + 300;
      const startZ = (Math.random() - 0.5) * 3000;

      for (let i = 0; i < trailLength; i++) {
        positions[i * 3] = startX;
        positions[i * 3 + 1] = startY;
        positions[i * 3 + 2] = startZ;
      }

      return {
        positions,
        geometry,
        speed: Math.random() * 15 + 10,
      };
    });
  }, [count]);

  useFrame(() => {
    stars.forEach((star) => {
      const p = star.positions;

      // Lấy head hiện tại
      let x = p[0];
      let y = p[1];
      let z = p[2];

      // Di chuyển
      x -= star.speed;
      y -= star.speed * 0.4;

      // Reset khi ra khỏi màn
      if (x < -2000 || y < -200) {
        x = Math.random() * 2000 + 1000;
        y = Math.random() * 800 + 300;
        z = (Math.random() - 0.5) * 3000;

        for (let i = 0; i < p.length; i += 3) {
          p[i] = x;
          p[i + 1] = y;
          p[i + 2] = z;
        }
      } else {
        // Dịch trail xuống
        for (let i = p.length - 3; i >= 3; i -= 3) {
          p[i] = p[i - 3];
          p[i + 1] = p[i - 2];
          p[i + 2] = p[i - 1];
        }

        // Cập nhật head mới
        p[0] = x;
        p[1] = y;
        p[2] = z;
      }

      star.geometry.attributes.position.needsUpdate = true;
    });
  });

  return (
    <group>
      {stars.map((star, i) => (
        <line key={i}>
        <primitive object={star.geometry} attach="geometry" />
        <lineBasicMaterial
         color="white"
        transparent
        opacity={0.9}
      />
      </line>
      ))}
    </group>
  );
}