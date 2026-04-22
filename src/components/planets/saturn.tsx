import Planet from "./Planet";
import { Text } from "@react-three/drei";
import { Dispatch, SetStateAction } from "react";
import Button from "../Button";

interface PlanetProps {
    setControlsEnabled: Dispatch<SetStateAction<boolean>>;
    isActive: boolean;
    onClick?: () => void;
}
const Saturn: React.FC<PlanetProps> = ({ setControlsEnabled, isActive, onClick }) => {
    const pos: [number, number, number] = [0, 0, 680]; 

    return (
        <group>
            <Planet
                position={pos}
                meshMaterialPath="/icons/2k_saturn.jpg" //
                spinSpeed={0.002}
                size={10} 
                onClick={onClick || (() => { window.location.hash = "#saturn"; })}
            />
            {/* Vẽ vành đai Sao Thổ */}
            <mesh position={pos} rotation={[Math.PI / 2.5, 0, 0]}>
                <ringGeometry args={[12, 18, 64]} />
                <meshStandardMaterial color="#c2a278" transparent opacity={0.5} side={2} />
            </mesh>

            {isActive && (
                <group position={pos}>
                    <Text
                        color={"white"}
                        position={[-16, 0, 0]}
                        font="/fonts/futura_medium.ttf"
                        fontSize={1.2}
                        maxWidth={10}
                        textAlign="left"
                    >
                        Adorned with a dazzling system of icy rings, Saturn is unique in our solar system.
                    </Text>
                    <Button
                        position={[16, 0, 0]}
                        text="Ring Research     ➜"
                        setControlsEnabled={setControlsEnabled}
                        buttonSize={[8, 1.5]}
                        fontSize={0.5}
                    />
                </group>
            )}
        </group>
    );
};
export default Saturn;