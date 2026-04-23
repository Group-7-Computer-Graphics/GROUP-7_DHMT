import Planet from "./Planet";
import { Dispatch, SetStateAction } from "react";
import { useTexture } from "@react-three/drei";

interface PlanetProps {
    setControlsEnabled: Dispatch<SetStateAction<boolean>>;
    isActive: boolean;
    onClick?: () => void;
}

const Saturn: React.FC<PlanetProps> = ({ setControlsEnabled, isActive, onClick }) => {
    const pos: [number, number, number] = [0, 0, 680]; 
    const ringTexture = useTexture("/icons/2k_saturn.jpg");
    
    return (
        <group>
            {/* 1. KHỐI CẦU HÀNH TINH SAO THỔ */}
            <Planet
                position={pos}
                meshMaterialPath="/icons/2k_saturn.jpg" 
                spinSpeed={0.002}
                size={10} 
                onClick={onClick || (() => { window.location.hash = "#saturn"; })}
            />
            
            {/* 2. VÀNH ĐAI SAO THỔ (VẪN GIỮ NGUYÊN) */}
            <mesh position={[pos[0], pos[1], pos[2] + 2]} rotation={[Math.PI / 2.5, 0, 0]}>
                <ringGeometry args={[18, 50, 64]} />
                <meshBasicMaterial 
                  map={ringTexture}
                  transparent
                  side={2}
                />
            </mesh>

            {/* ĐÃ XÓA TOÀN BỘ KHỐI TEXT VÀ BUTTON TẠI ĐÂY */}
        </group>
    );
};

export default Saturn;