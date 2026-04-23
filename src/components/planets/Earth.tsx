import Planet from "./Planet";
import { Text } from "@react-three/drei";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Writing from "../interests/Writing";
import Visuals from "../interests/Visuals";
import Connect from "../Connect";
import Button from "../Button";

interface EarthProps {
    setControlsEnabled: Dispatch<SetStateAction<boolean>>;
    isActive: boolean;
    onClick?: () => void; // 1. THÊM DÒNG NÀY VÀO INTERFACE
}

const Earth: React.FC<EarthProps> = ({ 
    setControlsEnabled, 
    isActive,
    onClick // 2. NHẬN BIẾN onClick Ở ĐÂY
}) => {
    const [showVisuals, setShowVisuals] = useState(false);
    const [showWriting, setShowWriting] = useState(false);

    const pos: [number, number, number] = [0, 0, 210]; 

    const handleVisualsClose = () => {
        setShowVisuals(false);
        setControlsEnabled(true);
        window.location.hash = "#earth";
    };

    const handleWritingClose = () => {
        setShowWriting(false);
        setControlsEnabled(true);
        window.location.hash = "#earth";
    };

    return (
        <group>
            {/* 1. KHỐI CẦU HÀNH TINH */}
            <Planet
                position={pos}
                meshMaterialPath="/earth_map.jpeg"
                spinSpeed={0.005}
                size={3.5}
                // 3. SỬA DÒNG NÀY ĐỂ NHẬN HÀM TỪ INDEX TRUYỀN VÀO
                onClick={onClick} 
            />

            {/* 2. GIAO DIỆN TƯƠNG TÁC */}
            {isActive && (
                <group position={pos}>
                    <Text
                        color={"white"}
                        position={[-7, 0, 0]} 
                        font="/fonts/futura_medium.ttf"
                        maxWidth={6}
                        textAlign="left"
                        lineHeight={1.2}
                        fontSize={0.6}
                    >
                        Here is where I play with my earthly pleasures. Check out these fun projects I've been working on.
                    </Text>

                    <Button
                        position={[6.5, 1.5, 0]}
                        text="Visuals                  ➜"
                        setControlsEnabled={setControlsEnabled}
                        buttonSize={[5, 1]}
                        fontSize={0.4}
                        ProjectComponent={() => <Visuals onClose={handleVisualsClose} />}
                    />
                    <Button
                        position={[6.5, -0.5, 0]}
                        text="Writing                  ➜"
                        setControlsEnabled={setControlsEnabled}
                        buttonSize={[5, 1]}
                        fontSize={0.4}
                        ProjectComponent={() => <Writing onClose={handleWritingClose} />}
                    />
                </group>
            )}

            {showVisuals && <Visuals onClose={handleVisualsClose} />}
            {showWriting && <Writing onClose={handleWritingClose} />}
        </group>
    );
};

export default Earth;