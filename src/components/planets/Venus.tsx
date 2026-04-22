import Planet from "./Planet";
import { Text } from "@react-three/drei";
import { Dispatch, SetStateAction, useState } from "react";
import Button from "../Button";
import Placeholder from "../Projects/Placeholder";

interface VenusProps {
    setControlsEnabled: Dispatch<SetStateAction<boolean>>;
}

const Venus: React.FC<VenusProps> = ({ setControlsEnabled }) => {
    // 1. Quản lý trạng thái hiển thị bảng nghệ thuật
    const [showInfo, setShowInfo] = useState(false);

    const handleClose = () => {
        setShowInfo(false);
        setControlsEnabled(true);
        // Cập nhật lại hash URL khi đóng
        window.history.pushState(null, "", "#venus");
    };

    // 2. Component nội dung cho khu vực sáng tạo
    const VenusContent = () => {
        return (
            <Placeholder 
                title="Creative Greenhouse - Digital Art" 
                onClose={handleClose} 
            />
        );
    };

    return (
        <>
            <Planet
                position={[30, 2, -20]}
                meshMaterialPath="/2k_venus_surface.jpeg"
                spinSpeed={-0.002} // Sao Kim quay ngược (Retrograde rotation)
                size={3.5}
            />
            <Text
                color={"white"}
                position={[22, 2, -20]}
                font="/fonts/futura_medium.ttf"
                maxWidth={8}
                textAlign="right"
                fontSize={0.8}
            >
                BEYOND CODING. {"\n"}
                I have a passion for celestial sounds and digital art. 
                Explore my creative greenhouse.
            </Text>
            
            <Button
                position={[38, 3.5, -20]}
                text="Digital Art ➜"
                setControlsEnabled={setControlsEnabled}
                buttonSize={[6, 1.2]} // Chỉnh lại size cho cân đối với hành tinh nhỏ
                fontSize={0.45}
                textXOffset={2}
                // Kết nối với Placeholder
                ProjectComponent={VenusContent}
            />

            {/* Hiển thị bảng nội dung dựa trên state */}
            {showInfo && <VenusContent />}
        </>
    );
};

export default Venus;