import Planet from "./Planet";
import { Text } from "@react-three/drei";
import { Dispatch, SetStateAction } from "react";
import Button from "../Button";

interface PlanetProps {
    setControlsEnabled: Dispatch<SetStateAction<boolean>>;
    isActive: boolean;
    onClick?: () => void; // 1. Thêm ngăn chứa này vào interface
}

// 2. Thêm onClick vào phần nhận tham số
const Neptune: React.FC<PlanetProps> = ({ setControlsEnabled, isActive, onClick }) => {
    const pos: [number, number, number] = [0, 0, 1050]; 

    return (
        <group>
            <Planet
                position={pos}
                meshMaterialPath="/icons/2k_neptune.jpg"
                spinSpeed={0.003}
                size={7} 
                // 3. Truyền biến onClick nhận được vào đây
                onClick={onClick} 
            />
            {isActive && (
                <group position={pos}>
                    <Text
                        color={"white"}
                        position={[-12, 0, 0]}
                        font="/fonts/futura_medium.ttf"
                        fontSize={1}
                        maxWidth={8}
                    >
                        Dark, cold, and whipped by supersonic winds, ice giant Neptune is the eighth and most distant planet.
                    </Text>
                    <Button
                        position={[12, 0, 0]}
                        text="Deep Blue         ➜"
                        setControlsEnabled={setControlsEnabled}
                        buttonSize={[6, 1.2]}
                    />
                </group>
            )}
        </group>
    );
};
export default Neptune;