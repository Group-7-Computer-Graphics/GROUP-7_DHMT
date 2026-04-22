import Planet from "./Planet";
import { Text } from "@react-three/drei";
import { Dispatch, SetStateAction } from "react";
import Button from "../Button";

interface JupiterProps {
    setControlsEnabled: Dispatch<SetStateAction<boolean>>;
    isActive: boolean;
    onClick?: () => void; // 1. Mở thêm ngăn chứa onClick trong interface
}

// 2. Nhận biến onClick ở đây
const Jupiter: React.FC<JupiterProps> = ({ setControlsEnabled, isActive, onClick }) => {
    const pos: [number, number, number] = [0, 0, 480]; 

    return (
        <group>
            <Planet
                position={pos}
                meshMaterialPath="/icons/2k_jupiter.jpg"
                spinSpeed={0.001}
                size={12} 
                // 3. Truyền onClick từ props vào component Planet
                onClick={onClick} 
            />

            {isActive && (
                <group position={pos}>
                    <Text
                        color={"white"}
                        position={[-18, 0, 0]} 
                        font="/fonts/futura_medium.ttf"
                        fontSize={1.2}
                        maxWidth={12}
                        textAlign="left"
                    >
                        Jupiter is the largest planet in our Solar System. A gas giant with a Great Red Spot.
                    </Text>

                    <group position={[18, 0, 0]}>
                        <Button
                            position={[0, 2, 0]}
                            buttonSize={[8, 1.5]}
                            text="Big Projects      ➜"
                            setControlsEnabled={setControlsEnabled}
                        />
                        <Button
                            position={[0, -2, 0]}
                            buttonSize={[8, 1.5]}
                            text="Data Science      ➜"
                            setControlsEnabled={setControlsEnabled}
                        />
                    </group>
                </group>
            )}
        </group>
    );
};

export default Jupiter;