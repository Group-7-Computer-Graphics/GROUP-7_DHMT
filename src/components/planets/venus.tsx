import Planet from "./Planet";
import { Text } from "@react-three/drei";
import { Dispatch, SetStateAction } from "react";
import Button from "../Button";

interface PlanetProps {
    setControlsEnabled: Dispatch<SetStateAction<boolean>>;
    isActive: boolean;
    onClick?: () => void; // 1. Mở ngăn chứa onClick
}

const Venus: React.FC<PlanetProps> = ({ setControlsEnabled, isActive, onClick }) => {
    const pos: [number, number, number] = [0, 0, 140]; 

    return (
        <group>
            <Planet
                position={pos}
                meshMaterialPath="/icons/2k_venus_surface.jpg"
                spinSpeed={0.002}
                size={3.2} 
                // 2. Truyền onClick nhận từ props vào đây
                onClick={onClick} 
            />
            {isActive && (
                <group position={pos}>
                    <Text
                        color={"white"}
                        position={[-6, 0, 0]}
                        font="/fonts/futura_medium.ttf"
                        fontSize={0.6}
                        maxWidth={5}
                        textAlign="left"
                    >
                        Venus is the hottest planet in our solar system, with a surface temperature hot enough to melt lead.
                    </Text>
                    <Button
                        position={[6, 0, 0]}
                        text="Surface Map       ➜"
                        setControlsEnabled={setControlsEnabled}
                        buttonSize={[4, 0.8]}
                        fontSize={0.3}
                    />
                </group>
            )}
        </group>
    );
};
export default Venus;