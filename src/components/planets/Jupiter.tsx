import Planet from "./Planet";
import { Dispatch, SetStateAction } from "react";

interface JupiterProps {
    setControlsEnabled: Dispatch<SetStateAction<boolean>>;
    isActive: boolean;
    onClick?: () => void; 
}

const Jupiter: React.FC<JupiterProps> = ({ setControlsEnabled, isActive, onClick }) => {
    const pos: [number, number, number] = [0, 0, 480]; 
    const size = 12; 

    return (
        <group>
            {/* CHỈ GIỮ LẠI MỖI KHỐI CẦU HÀNH TINH SAO MỘC */}
            <Planet
                position={pos}
                meshMaterialPath="/icons/2k_jupiter.jpg"
                spinSpeed={0.001}
                size={size} 
                onClick={onClick} 
            />
            
            {/* ĐÃ XÓA TOÀN BỘ KHỐI TEXT VÀ BUTTON TẠI ĐÂY */}
        </group>
    );
};

export default Jupiter;