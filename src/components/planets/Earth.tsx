import Planet from "./Planet";
import { Dispatch, SetStateAction, useState } from "react";
import Writing from "../interests/Writing";
import Visuals from "../interests/Visuals";

interface EarthProps {
    setControlsEnabled: Dispatch<SetStateAction<boolean>>;
    isActive: boolean;
    onClick?: () => void; 
}

const Earth: React.FC<EarthProps> = ({ 
    setControlsEnabled, 
    isActive,
    onClick 
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
                onClick={onClick} 
            />

            {/* ĐÃ XÓA TOÀN BỘ TEXT VÀ BUTTON Ở ĐÂY */}

            {/* Vẫn giữ lại phần gọi component lỡ ông có cần kích hoạt từ chỗ khác */}
            {showVisuals && <Visuals onClose={handleVisualsClose} />}
            {showWriting && <Writing onClose={handleWritingClose} />}
        </group>
    );
};

export default Earth;