import React, { useRef } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { MTLLoader } from "three/addons/loaders/MTLLoader.js";
import { TextureLoader } from "three";
import * as THREE from "three";

const UFO = () => {
    const ufoRef = useRef<THREE.Group>(null!);

    // 1. Tải Model 3D (.obj)
    const obj = useLoader(OBJLoader, "/models/ufo.obj");

    // 2. Tải các tấm ảnh bề mặt (Textures)
    const [colorMap, normalMap, specMap] = useLoader(TextureLoader, [
        "/models/ufo_diffuse.png",
        "/models/ufo_normal.png",
        "/models/ufo_spec.png",
    ]);

    // 3. Gán Texture vào Model
    // Chúng ta phải duyệt qua từng mesh bên trong file OBJ để dán ảnh lên
    obj.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.material = new THREE.MeshStandardMaterial({
                map: colorMap,
                normalMap: normalMap,
                roughnessMap: specMap,
                metalness: 0.8, // Làm cho đĩa bay có vẻ kim loại
            });
        }
    });

    // 4. Hiệu ứng đĩa bay lơ lửng và xoay
    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (ufoRef.current) {
            // Bay lên xuống nhẹ nhàng
            ufoRef.current.position.y = 10 + Math.sin(t) * 2;
            // Tự xoay tròn
            ufoRef.current.rotation.y += 0.01;
        }
    });

    return (
        <primitive 
            ref={ufoRef}
            object={obj} 
            scale={0.05} // Nếu đĩa bay quá to thì giảm số này xuống (ví dụ 0.01)
            position={[20, 10, 50]} // Vị trí trong không gian
        />
    );
};

export default UFO;