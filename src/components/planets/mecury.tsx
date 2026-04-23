import Planet from "./Planet";
import { Dispatch, SetStateAction } from "react";

interface PlanetProps {
    setControlsEnabled: Dispatch<SetStateAction<boolean>>;
    isActive: boolean;
    onClick?: () => void; 
}

const Mercury: React.FC<PlanetProps> = ({ setControlsEnabled, isActive, onClick }) => {
    const pos: [number, number, number] = [0, 0, 80]; // Gần Mặt trời nhất

    return (
        <group>
            {/* CHỈ GIỮ LẠI MỖI KHỐI CẦU HÀNH TINH SAO THỦY */}
            <Planet
                position={pos}
                meshMaterialPath="/icons/2k_mercury.jpg"
                spinSpeed={0.004}
                size={1.5} // Nhỏ nhất
                onClick={onClick} 
            />

            {/* ĐÃ XÓA KHỐI TEXT Ở ĐÂY */}
        </group>
    );
};

export default Mercury;