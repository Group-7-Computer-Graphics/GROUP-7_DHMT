import Planet from "./Planet";
import { Dispatch, SetStateAction } from "react";

interface PlanetProps {
    setControlsEnabled: Dispatch<SetStateAction<boolean>>;
    isActive: boolean;
    onClick?: () => void; 
}

const Uranus: React.FC<PlanetProps> = ({ setControlsEnabled, isActive, onClick }) => {
    const pos: [number, number, number] = [0, 0, 880]; 

    return (
        <group>
            {/* CHỈ GIỮ LẠI MỖI KHỐI CẦU HÀNH TINH SAO THIÊN VƯƠNG */}
            <Planet
                position={pos}
                meshMaterialPath="/icons/Uranus.jpg"
                spinSpeed={0.003}
                size={7} 
                onClick={onClick} 
            />
            
            {/* ĐÃ XÓA TOÀN BỘ KHỐI TEXT Ở ĐÂY */}
        </group>
    );
};

export default Uranus;