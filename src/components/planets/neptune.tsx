import Planet from "./Planet";
import { Dispatch, SetStateAction } from "react";

interface PlanetProps {
    setControlsEnabled: Dispatch<SetStateAction<boolean>>;
    isActive: boolean;
    onClick?: () => void; 
}

const Neptune: React.FC<PlanetProps> = ({ setControlsEnabled, isActive, onClick }) => {
    const pos: [number, number, number] = [0, 0, 1050]; 

    return (
        <group>
            {/* CHỈ GIỮ LẠI MỖI KHỐI CẦU HÀNH TINH SAO HẢI VƯƠNG */}
            <Planet
                position={pos}
                meshMaterialPath="/icons/2k_neptune.jpg"
                spinSpeed={0.003}
                size={7} 
                onClick={onClick} 
            />
            
            {/* ĐÃ XÓA TOÀN BỘ KHỐI TEXT VÀ BUTTON Ở ĐÂY */}
        </group>
    );
};
export default Neptune;