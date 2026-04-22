import Planet from "./Planet";
import { Text } from "@react-three/drei";
import { Dispatch, SetStateAction } from "react";
import Button from "../Button";
import Placeholder from "../Projects/Placeholder"; // Đảm bảo file này đã tạo ở Bước 2

interface JupiterProps {
    setControlsEnabled: Dispatch<SetStateAction<boolean>>;
}

const Jupiter: React.FC<JupiterProps> = ({ setControlsEnabled }) => {
    return (
        <>
            <Planet
                position={[70, -5, 180]}
                meshMaterialPath="/2k_jupiter.jpeg"
                spinSpeed={0.01}
                size={12} // Jupiter khổng lồ
            />
            <Text
                color={"white"}
                position={[50, -5, 180]}
                font="/fonts/futura_medium.ttf"
                lineHeight={1.2}
                fontSize={1.5}
                maxWidth={15}
                textAlign="right"
            >
                BIG SCALE PROJECTS.
            </Text>
            <Button
                position={[88, -2, 180]}
                buttonSize={[11, 2.5]}
                text="Open Source         ➜"
                setControlsEnabled={setControlsEnabled}
                ProjectComponent={() => null} 
            />
        </>
    );
};

export default Jupiter;