import Planet from "./Planet";
import { Dispatch, SetStateAction } from "react";
import { useTexture } from "@react-three/drei";
import * as THREE from "three"; // Thêm dòng này để dùng DoubleSide

interface PlanetProps {
    setControlsEnabled: Dispatch<SetStateAction<boolean>>;
    isActive: boolean;
    onClick?: () => void; 
}

const Uranus: React.FC<PlanetProps> = ({ setControlsEnabled, isActive, onClick }) => {
    const pos: [number, number, number] = [0, 0, 880]; 
    // Load texture vành đai
    const ringTexture = useTexture("/icons/nhanuranus.jpg");

    return (
        <group>
            {/* Hành tinh Uranus */}
            <Planet
                position={pos}
                meshMaterialPath="/icons/2k_uranus.jpg"
                spinSpeed={0.003}
                size={30} 
                onClick={onClick} 
            />

            {/* Vành đai Uranus */}
            <mesh position={pos} rotation={[Math.PI / 2, 0, 0]}> 
                {/* args: [Bán kính trong, Bán kính ngoài, Số phân đoạn] 
                   Hành tinh size 7 thì vành đai từ 10 đến 14 là đẹp 
                */}
                <ringGeometry args={[35, 60, 128]} /> 
                <meshStandardMaterial 
                    map={ringTexture}
                    transparent={true}
                    opacity={0.8}
                    side={THREE.DoubleSide} // Hiển thị cả 2 mặt của vành đai
                    metalness={0.5}
                    roughness={0.2}
                    emissive={new THREE.Color("#9cd4df")} // Màu ánh sáng tự phát ra (trắng)
    emissiveMap={ringTexture}             // Dùng chính texture đó để làm bản đồ phát sáng
    emissiveIntensity={0.5}               // Độ sáng (tăng lên nếu vẫn thấy tối)
                />
            </mesh>
        </group>
    );
};

export default Uranus;