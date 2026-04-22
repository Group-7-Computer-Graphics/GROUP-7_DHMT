import Planet from "./Planet";
import { Text, useCursor } from "@react-three/drei";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Button from "../Button";
import DanceFilm from "../Projects/DanceFilm";
import SciOS from "../Projects/SciOS";
import PersonalWebsite from "../Projects/PersonalWebsite";

interface MarsProps {
    setControlsEnabled: Dispatch<SetStateAction<boolean>>;
    isActive: boolean; 
    initialProject?: string | null;
    onClick?: () => void; // 1. THÊM DÒNG NÀY VÀO INTERFACE
}

const Mars: React.FC<MarsProps> = ({ 
    setControlsEnabled, 
    isActive, 
    initialProject = null,
    onClick // 2. NHẬN BIẾN onClick Ở ĐÂY
}) => {
    const [activeProject, setActiveProject] = useState<string | null>(initialProject);
    const [hovered, setHovered] = useState(false);
    useCursor(hovered);

    const pos: [number, number, number] = [0, 0, 300]; 

    useEffect(() => {
        setActiveProject(initialProject);
    }, [initialProject]);

    const handleCloseProject = () => {
        setActiveProject(null);
        setControlsEnabled(true);
        window.location.hash = "#mars";
    };

    const handleViewResume = () => {
        window.open("https://drive.google.com/file/.../view", "_blank");
    };

    return (
        <group>
            {/* 1. HÀNH TINH */}
            <Planet
                position={pos}
                meshMaterialPath="/mars.jpeg"
                spinSpeed={0.002}
                size={4} 
                // 3. TRUYỀN onClick VÀO ĐÂY
                onClick={onClick} 
            />

            {/* 2. UI CHI TIẾT */}
            {isActive && (
                <group position={pos}>
                    <Text
                        color={"white"}
                        position={[-10, 0, 0]} 
                        font="/fonts/futura_medium.ttf"
                        lineHeight={1.2}
                        fontSize={0.8}
                        maxWidth={8}
                        textAlign="left"
                        onClick={handleViewResume}
                        onPointerOver={() => setHovered(true)}
                        onPointerOut={() => setHovered(false)}
                    >
                        My projects are out of this world. Here are some selected work. You can view my resume here.
                    </Text>

                    <group position={[8, 0, 0]}> 
                        <Button
                            position={[0, 2.5, 0]}
                            buttonSize={[7, 1.5]}
                            text="Dance film         ➜"
                            setControlsEnabled={setControlsEnabled}
                            ProjectComponent={DanceFilm}
                        />
                        <Button
                            position={[0, 0, 0]}
                            buttonSize={[7, 1.5]}
                            text="SciOS             ➜"
                            setControlsEnabled={setControlsEnabled}
                            ProjectComponent={SciOS}
                        />
                        <Button
                            position={[0, -2.5, 0]}
                            buttonSize={[7, 1.5]}
                            text="Personal website  ➜"
                            setControlsEnabled={setControlsEnabled}
                            ProjectComponent={PersonalWebsite}
                        />
                    </group>
                </group>
            )}

            {/* Render Project Overlays */}
            {activeProject === "personal" && <PersonalWebsite onClose={handleCloseProject} />}
            {activeProject === "dance" && <DanceFilm onClose={handleCloseProject} />}
            {activeProject === "scios" && <SciOS onClose={handleCloseProject} />}
        </group>
    );
};

export default Mars;