import { useState } from "react";
import Planet from "./Planet";
import { Text, Image, useCursor } from "@react-three/drei";

interface SunProps {
    isActive: boolean; 
    onClick?: () => void; // 1. Mở ngăn chứa onClick trong interface
}

const Sun: React.FC<SunProps> = ({ isActive, onClick }) => {
    const handleOnClickLinkedIn = () => {
        window.open("https://www.linkedin.com/in/trang-doan-m23/", "_blank");
    };
    const handleOnClickGithub = () => {
        window.open("https://github.com/trangdoan982", "_blank");
    };
    const handleOnClickSubstack = () => {
        window.open("https://trangdoan.substack.com/", "_blank");
    };
    
    const [hovered, setHovered] = useState(false);
    useCursor(hovered);

    // Tọa độ gốc cho Mặt trời
    const pos: [number, number, number] = [0, 0, 0];

    return (
        <group>
            {/* 1. MẶT TRỜI */}
            <Planet
                position={pos}
                meshMaterialPath="/sun.jpeg"
                spinSpeed={0.002} 
                size={50} 
                // 2. Nhận onClick từ props truyền vào
                onClick={onClick} 
            />

            {/* 2. UI LỜI CHÀO & SOCIALS */}
            {isActive && (
                <group position={pos}>
                    <Text
                        color={"white"}
                        position={[-70, 20, 0]} 
                        maxWidth={100}
                        font="/fonts/futura_medium.ttf"
                        lineHeight={1.2}
                        fontSize={6}
                        textAlign="left"
                    >
                        Welcome to my space. I am Trang. I code, tell stories, move my body, and build communities.
                    </Text>

                    {/* Social Icons */}
                    <group position={[0, -15, 0]}>
                        <Image
                            url="/icons/linkedin.png"
                            position={[-110, 0, 0]}
                            scale={6}
                            onClick={handleOnClickLinkedIn}
                            onPointerOver={() => setHovered(true)}
                            onPointerOut={() => setHovered(false)}
                        />
                        <Image
                            url="/icons/github.png"
                            position={[-100, 0, 0]}
                            scale={5.5}
                            onClick={handleOnClickGithub}
                            onPointerOver={() => setHovered(true)}
                            onPointerOut={() => setHovered(false)}
                        />
                        <Image
                            url="/icons/substack.png"
                            position={[-90, 0, 0]}
                            scale={5}
                            onClick={handleOnClickSubstack}
                            onPointerOver={() => setHovered(true)}
                            onPointerOut={() => setHovered(false)}
                        />
                    </group>

                    <Text
                        color={"#787878"}
                        position={[-95, -35, 0]}
                        fontSize={3.5}
                        font="/fonts/futura_medium.ttf"
                    >
                        * Zoom or Scroll to explore. Drag for fun.
                    </Text>
                </group>
            )}
        </group>
    );
};

export default Sun;