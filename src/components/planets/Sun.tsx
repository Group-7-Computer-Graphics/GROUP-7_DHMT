import React, { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";

interface SunProps {
    isActive: boolean;
    onClick?: () => void;
    // Thêm prop này để nhận giá trị từ thanh trượt nếu muốn tùy biến mạnh hơn
    emissiveIntensity?: number; 
}

const Sun: React.FC<SunProps> = ({ isActive, onClick, emissiveIntensity = 2 }) => {
    const sunRef = useRef<THREE.Mesh>(null);
    
    // Load texture mặt trời
    const texture = useLoader(THREE.TextureLoader, "/sun.jpeg");

    // Tạo hiệu ứng tự quay cho Mặt Trời
    useFrame(() => {
        if (sunRef.current) {
            sunRef.current.rotation.y += 0.002;
        }
    });

    return (
        <mesh ref={sunRef} position={[0, 0, 0]} onClick={onClick}>
            {/* size={65} như cũ của ông, hoặc 100 tùy ông muốn to hay nhỏ */}
            <sphereGeometry args={[65, 64, 64]} />
            
            <meshStandardMaterial 
    map={texture}           // Ảnh bề mặt Mặt Trời
    emissiveMap={texture}   // Dùng chính ảnh đó làm bản đồ phát sáng (Giúp hiện vân khi chói)
    emissive="yellow"       // Màu sắc ánh sáng bổ trợ
    emissiveIntensity={emissiveIntensity} // Độ rực từ thanh trượt
    toneMapped={false}      // Giữ nguyên để Bloom hoạt động
/>
        </mesh>
    );
};

export default Sun;