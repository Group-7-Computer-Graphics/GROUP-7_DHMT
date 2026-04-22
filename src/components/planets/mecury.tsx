import Planet from "./Planet";
import { Text } from "@react-three/drei";
import { Dispatch, SetStateAction } from "react";

interface PlanetProps {
    setControlsEnabled: Dispatch<SetStateAction<boolean>>;
    isActive: boolean;
    onClick?: () => void; // 1. Mở "ngăn chứa" onClick trong interface
}

// 2. Thêm onClick vào danh sách tham số nhận vào
const Mercury: React.FC<PlanetProps> = ({ setControlsEnabled, isActive, onClick }) => {
    const pos: [number, number, number] = [0, 0, 80]; // Gần Mặt trời nhất

    return (
        <group>
            <Planet
                position={pos}
                meshMaterialPath="/icons/2k_mercury.jpg"
                spinSpeed={0.004}
                size={1.5} // Nhỏ nhất
                // 3. Truyền trực tiếp onClick từ props vào để đồng bộ với index.tsx
                onClick={onClick} 
            />

            {isActive && (
                <group position={pos}>
                    <Text
                        color={"white"}
                        position={[-4, 0, 0]}
                        font="/fonts/futura_medium.ttf"
                        fontSize={0.5}
                        maxWidth={4}
                        textAlign="left"
                    >
                        Mercury is the smallest planet and closest to the Sun. It has no atmosphere to retain heat.
                    </Text>
                </group>
            )}
        </group>
    );
};

export default Mercury;