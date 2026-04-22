import { Sphere, useCursor } from "@react-three/drei";
import { useFrame, useLoader } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";

interface PlanetProps {
    meshMaterialPath: string;
    position: [number, number, number];
    spinSpeed: number;
    size?: number;
    onClick?: () => void;
}

const Planet = (props: PlanetProps) => {
    const planetRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);
    
    // Load texture (Next.js sẽ tìm trong thư mục public)
    const texture = useLoader(THREE.TextureLoader, props.meshMaterialPath);

    // Hiệu ứng con trỏ chuột
    useCursor(hovered);

    useFrame(() => {
        if (planetRef.current) {
            planetRef.current.rotation.y += props.spinSpeed;
        }
    });

    return (
        <Sphere
            args={[props.size || 1, 64, 64]}
            ref={planetRef}
            position={props.position}
            onClick={(e) => {
                e.stopPropagation();
                if (props.onClick) props.onClick();
            }}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            {/* Đã xóa dòng antialiasing lỗi */}
            <meshBasicMaterial 
                map={texture} 
                metalness={0.1} 
                roughness={0.8}
            />
        </Sphere>
    );
};

export default Planet;