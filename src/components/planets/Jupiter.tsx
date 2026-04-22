import Planet from "./Planet";

import { Text } from "@react-three/drei";

import { Dispatch, SetStateAction } from "react";

import Button from "../Button";



interface JupiterProps {

    setControlsEnabled: Dispatch<SetStateAction<boolean>>;

    isActive: boolean;

    onClick?: () => void; // 1. Mở thêm ngăn chứa onClick trong interface

}
const Jupiter: React.FC<JupiterProps> = ({ setControlsEnabled, isActive, onClick }) => {
    const pos: [number, number, number] = [0, 0, 480]; 
    const size = 12; // THÊM DÒNG NÀY: Khai báo biến size để dùng chung bên dưới

    return (
        <group>
            <Planet
                position={pos}
                meshMaterialPath="/icons/2k_jupiter.jpg"
                spinSpeed={0.001}
                size={size} // Sử dụng biến size ở đây
                onClick={onClick} 
            />

            {isActive && (
                <group position={pos}>
                    {/* KHỐI TEXT BÊN TRÁI: Đã hết lỗi biến size */}
                    <Text
                        color={"white"}
                        position={[-(size * 2 + 2), 0, 0]} 
                        font="/fonts/futura_medium.ttf"
                        lineHeight={1.2}
                        fontSize={0.8}
                        maxWidth={10}
                        textAlign="left"
                    >
                        Jupiter is the largest planet in the Solar System. 
                        It is a gas giant with a mass more than two and a half 
                        times that of all the other planets combined.
                    </Text>

                    {/* CỤM BUTTON BÊN PHẢI: Đã hết lỗi biến size */}
                    <group position={[(size * 2 + 1), 0, 0]}> 
                        <Button
                            position={[0, 2.5, 0]}
                            buttonSize={[7, 1.5]}
                            text="Explore ➜"
                            setControlsEnabled={setControlsEnabled}
                            ProjectComponent={() => <div>Project 1</div>}
                        />
                        <Button
                            position={[0, 0, 0]}
                            buttonSize={[7, 1.5]}
                            text="Information ➜"
                            setControlsEnabled={setControlsEnabled}
                            ProjectComponent={() => <div>Project 2</div>}
                        />
                        <Button
                            position={[0, -2.5, 0]}
                            buttonSize={[7, 1.5]}
                            text="Gallery ➜"
                            setControlsEnabled={setControlsEnabled}
                            ProjectComponent={() => <div>Project 3</div>}
                        />
                    </group>
                </group>
            )}
        </group>
    );
};

export default Jupiter;