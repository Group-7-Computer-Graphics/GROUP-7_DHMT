import Planet from "./Planet";
import { Text } from "@react-three/drei";
import { Dispatch, SetStateAction, useState } from "react";
import Button from "../Button";
import Placeholder from "../Projects/Placeholder";

interface SaturnProps {
    setControlsEnabled: Dispatch<SetStateAction<boolean>>;
}

const Saturn: React.FC<SaturnProps> = ({ setControlsEnabled }) => {
    // 1. Quản lý trạng thái đóng/mở bảng thông tin
    const [showInfo, setShowInfo] = useState(false);

    const handleClose = () => {
        setShowInfo(false);
        setControlsEnabled(true);
        // Quay về hash saturn khi đóng bảng
        window.history.pushState(null, "", "#saturn");
    };

    // 2. Component nội dung bọc trong Placeholder
    const SaturnContent = () => {
        return (
            <Placeholder 
                title="The Archive - Legacy Code" 
                onClose={handleClose} 
            />
        );
    };

    return (
        <group position={[110, 0, 250]}>
            <Planet
                position={[0, 0, 0]}
                meshMaterialPath="/2k_saturn.jpg"
                spinSpeed={0.008}
                size={6}
            />
            {/* Vòng nhẫn Saturn đặc trưng */}
            <mesh rotation={[Math.PI / 2.5, 0, 0]}>
                <ringGeometry args={[8,14,64]} />
                <meshStandardMaterial 
                    color="#c5ab6e" 
                    side={2} 
                    transparent 
                    opacity={0.5} 
                />
            </mesh>

            <Text
                color={"white"}
                position={[-22, 0, 0]} // Lùi text ra thêm một chút để không chạm vòng nhẫn
                font="/fonts/futura_medium.ttf"
                fontSize={1.2}
                textAlign="right"
                maxWidth={10}
            >
                THE ARCHIVE. {"\n"}
                Deep dive into my past experiments.
            </Text>
            
            <Button
                position={[22, 0, 0]} // Đẩy nút ra ngoài vòng nhẫn để dễ click
                buttonSize={[9, 2]}
                text="Legacy Code ➜"
                setControlsEnabled={setControlsEnabled}
                // Kết nối component nội dung
                ProjectComponent={SaturnContent}
            />

            {/* Hiển thị bảng nội dung dựa trên state */}
            {showInfo && <SaturnContent />}
        </group>
    );
};

export default Saturn;