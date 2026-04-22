import Planet from "./Planet";
import { Text } from "@react-three/drei";
import { Dispatch, SetStateAction, useState } from "react";
import Button from "../Button";
import Placeholder from "../Projects/Placeholder";

interface MercuryProps {
    setControlsEnabled: Dispatch<SetStateAction<boolean>>;
}

const Mercury: React.FC<MercuryProps> = ({ setControlsEnabled }) => {
    // 1. Quản lý trạng thái hiển thị bảng nội dung
    const [showInfo, setShowInfo] = useState(false);

    const handleClose = () => {
        setShowInfo(false);
        setControlsEnabled(true);
        // Quay về hash mercury khi đóng bảng
        window.history.pushState(null, "", "#mercury");
    };

    // 2. Component nội dung bọc trong Placeholder
    const MercuryContent = () => {
        return (
            <Placeholder 
                title="The Core - My Story" 
                onClose={handleClose} 
            />
        );
    };

    return (
        <>
            <Planet
                position={[-15, 0, 10]}
                meshMaterialPath="/2k_mercury.jpeg"
                spinSpeed={0.001}
                size={2}
            />
            <Text
                color={"white"}
                position={[-22, 0, 10]}
                font="/fonts/futura_medium.ttf"
                maxWidth={6}
                textAlign="right"
                fontSize={0.6}
            >
                THE CORE. {"\n"}
                The closest to the fire. This is where my journey as a developer began.
            </Text>

            <Button
                position={[-15, -3, 10]}
                text="My Story ➜"
                setControlsEnabled={setControlsEnabled}
                buttonSize={[5, 1]} // Tăng nhẹ size nút cho dễ bấm
                fontSize={0.4}
                textXOffset={1.5}
                // Truyền component nội dung vào Button
                ProjectComponent={MercuryContent} 
            />

            {/* Hiển thị bảng khi showInfo = true (nếu Button gọi nội dung này) */}
            {showInfo && <MercuryContent />}
        </>
    );
};

export default Mercury;