import Planet from "./Planet";
import { useCursor } from "@react-three/drei";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
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
                size={6} 
                // 3. TRUYỀN onClick VÀO ĐÂY
                onClick={onClick} 
            />

            {/* Render Project Overlays */}
            {activeProject === "personal" && <PersonalWebsite onClose={handleCloseProject} />}
            {activeProject === "dance" && <DanceFilm onClose={handleCloseProject} />}
            {activeProject === "scios" && <SciOS onClose={handleCloseProject} />}
        </group>
    );
};

export default Mars;