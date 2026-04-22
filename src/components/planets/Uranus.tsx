import Planet from "./Planet";
import { Text } from "@react-three/drei";
import { Dispatch, SetStateAction, useState } from "react";
import Button from "../Button";
import Placeholder from "../Projects/Placeholder";

interface UranusProps {
    setControlsEnabled: Dispatch<SetStateAction<boolean>>;
}

const Uranus: React.FC<UranusProps> = ({ setControlsEnabled }) => {
    // 1. Quản lý trạng thái hiển thị bảng Lab
    const [showInfo, setShowInfo] = useState(false);

    const handleClose = () => {
        setShowInfo(false);
        setControlsEnabled(true);
        // Quay về vị trí Uranus trên URL
        window.history.pushState(null, "", "#uranus");
    };

    // 2. Component nội dung cho khu vực Lab
    const UranusContent = () => {
        return (
            <Placeholder 
                title="The Lab - Experimental Projects" 
                onClose={handleClose} 
            />
        );
    };

    return (
        <group position={[-60, 10, 320]}>
            <Planet
                position={[0, 0, 0]}
                meshMaterialPath="/2k_uranus.jpeg"
                spinSpeed={-0.005} // Quay ngược
                size={7}
            />
            
            {/* Vòng nhẫn đứng dọc đặc trưng của Uranus */}
            <mesh rotation={[0, 0, Math.PI / 2]}>
                <ringGeometry args={[8, 9, 64]} />
                <meshStandardMaterial 
                    color="#afeeee" 
                    side={2} 
                    transparent 
                    opacity={0.3} 
                />
            </mesh>

            <Text
                color={"white"}
                position={[12, 0, 0]}
                font="/fonts/futura_medium.ttf"
                fontSize={1}
                maxWidth={10}
                textAlign="left"
            >
                THE LAB. {"\n"}
                Side projects that are a bit "tilted" and unconventional.
            </Text>
            
            <Button
                position={[0, -10, 0]}
                buttonSize={[9, 1.8]} // Tăng nhẹ kích thước cho cân đối
                text="View Lab ➜"
                setControlsEnabled={setControlsEnabled}
                // Kết nối với nội dung Placeholder
                ProjectComponent={UranusContent}
            />

            {/* Hiển thị bảng nội dung dựa trên state */}
            {showInfo && <UranusContent />}
        </group>
    );
};

export default Uranus;