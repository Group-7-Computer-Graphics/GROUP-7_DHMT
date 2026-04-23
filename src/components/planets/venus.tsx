import Planet from "./Planet";
import { Dispatch, SetStateAction } from "react";

interface PlanetProps {
    setControlsEnabled: Dispatch<SetStateAction<boolean>>;
    isActive: boolean;
    onClick?: () => void; 
}

const Venus: React.FC<PlanetProps> = ({ setControlsEnabled, isActive, onClick }) => {
    const pos: [number, number, number] = [0, 0, 140]; 

    return (
        <group>
            {/* CHỈ GIỮ LẠI MỖI KHỐI CẦU HÀNH TINH SAO KIM */}
            <Planet
                position={pos}
                meshMaterialPath="/icons/2k_venus_surface.jpg"
                spinSpeed={0.002}
                size={3.2} 
                onClick={onClick} 
            />

            {/* ĐÃ XÓA TOÀN BỘ KHỐI TEXT VÀ BUTTON Ở ĐÂY */}
        </group>
    );
};
export default Venus;