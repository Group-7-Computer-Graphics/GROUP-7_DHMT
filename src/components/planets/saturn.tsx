import Planet from "./Planet";
import { Dispatch, SetStateAction } from "react";
import { useTexture } from "@react-three/drei";
import * as THREE from "three"; // Thêm dòng này để dùng DoubleSide

interface PlanetProps {
    setControlsEnabled: Dispatch<SetStateAction<boolean>>;
    isActive: boolean;
    onClick?: () => void;
}

const Saturn: React.FC<PlanetProps> = ({ setControlsEnabled, isActive, onClick }) => {
    const pos: [number, number, number] = [0, 0, 680]; 
    const ringTexture = useTexture("/icons/rings.jpg");
    
    return (
        <group>
            {/* 1. KHỐI CẦU HÀNH TINH SAO THỔ */}
            <Planet
                position={pos}
                meshMaterialPath="/icons/Saturn.jpg" 
                spinSpeed={0.002}
                size={35} 
                onClick={onClick || (() => { window.location.hash = "#saturn"; })}
            />
            
            {/* 2. VÀNH ĐAI SAO THỔ (VẪN GIỮ NGUYÊN) */}
            <mesh position={pos} rotation={[Math.PI / 2.2, Math.PI / 6, 0]}>
                <ringGeometry args={[38, 70, 80]} />
                <meshStandardMaterial 
                                    map={ringTexture}
                                    transparent={true}
                                    opacity={0.8}
                                    side={THREE.DoubleSide} // Hiển thị cả 2 mặt của vành đai
                                    metalness={0.5}
                                    roughness={0.2}
                                    emissive={new THREE.Color("#71532893")} // Màu ánh sáng tự phát ra (trắng)
                    emissiveMap={ringTexture}             // Dùng chính texture đó để làm bản đồ phát sáng
                    emissiveIntensity={0.5}               // Độ sáng (tăng lên nếu vẫn thấy tối)
                                />
            </mesh>

            {/* ĐÃ XÓA TOÀN BỘ KHỐI TEXT VÀ BUTTON TẠI ĐÂY */}
        </group>
    );
};

export default Saturn;