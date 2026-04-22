import Planet from "./Planet";
import { Text } from "@react-three/drei";
import { Dispatch, SetStateAction, useState } from "react";
import Button from "../Button";
import Placeholder from "../Projects/Placeholder"; 

interface NeptuneProps {
    setControlsEnabled: Dispatch<SetStateAction<boolean>>;
}

const Neptune: React.FC<NeptuneProps> = ({ setControlsEnabled }) => {
    // 1. Quản lý trạng thái đóng/mở bảng thông tin
    const [showInfo, setShowInfo] = useState(false);

    const handleOpen = () => {
        setShowInfo(true);
        setControlsEnabled(false);
    };

    const handleClose = () => {
        setShowInfo(false);
        setControlsEnabled(true);
        // Giữ URL ở vị trí Neptune khi đóng
        window.history.pushState(null, "", "#neptune");
    };

    // 2. Component nội dung sẽ hiển thị khi bấm nút
    const NeptuneContent = () => {
        return (
            <Placeholder 
                title="Roadmap 2026 & AI Explorations" 
                onClose={handleClose} 
            />
        );
    };

    return (
        <>
            <Planet
                position={[80, -5, 400]}
                meshMaterialPath="/2k_neptune.jpeg"
                spinSpeed={0.004}
                size={7.5}
            />
            <Text
                color={"white"}
                position={[65, -5, 400]}
                font="/fonts/futura_medium.ttf"
                fontSize={1.2}
                maxWidth={12}
                textAlign="right"
            >
                THE DEEP BLUE. {"\n"}
                Future concepts and AI explorations.
            </Text>
            
            <Button
                position={[95, -5, 400]}
                buttonSize={[11, 2.5]}
                text="Roadmap 2026 ➜"
                setControlsEnabled={setControlsEnabled}
                // Truyền NeptuneContent vào đây để khi click nó render Placeholder
                ProjectComponent={NeptuneContent}
            />

            {/* Hiển thị bảng nội dung dựa trên state */}
            {showInfo && <NeptuneContent />}
        </>
    );
};

export default Neptune;