import Planet from "./Planet";
import { Text } from "@react-three/drei";
import { Dispatch, SetStateAction } from "react";
import Button from "../Button";

interface PlanetProps {
    setControlsEnabled: Dispatch<SetStateAction<boolean>>;
    isActive: boolean;
    onClick?: () => void; // 1. Thêm ngăn chứa onClick vào đây
}

// 2. Nhận biến onClick từ props
const Uranus: React.FC<PlanetProps> = ({ setControlsEnabled, isActive, onClick }) => {
    const pos: [number, number, number] = [0, 0, 880]; 

    return (
        <group>
            <Planet
                position={pos}
                meshMaterialPath="/icons/2k_uranus.jpg"
                spinSpeed={0.003}
                size={7} 
                // 3. Truyền onClick xuống để xử lý sự kiện click
                onClick={onClick} 
            />
            {isActive && (
                <group position={pos}>
                    <Text
                        color={"white"}
                        position={[-12, 0, 0]}
                        font="/fonts/futura_medium.ttf"
                        fontSize={1}
                        maxWidth={8}
                    >
                        Uranus is an ice giant with a unique tilt, rotating nearly 90 degrees from the plane of its orbit.
                    </Text>
                </group>
            )}
        </group>
    );
};
export default Uranus;