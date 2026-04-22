import css from "@/styles/Home.module.css";
import React, { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, PerspectiveCamera, Loader } from "@react-three/drei";
import { ChakraProvider } from "@chakra-ui/react";
import * as THREE from "three";

// Import các hành tinh (Đảm bảo ông đã tạo các file này trong thư mục planets)
import Sun from "@/components/planets/Sun";
import Mercury from "@/components/planets/Mercury";
import Venus from "@/components/planets/Venus";
import Earth from "@/components/planets/Earth";
import Mars from "@/components/planets/Mars";
import Jupiter from "@/components/planets/Jupiter";
import Saturn from "@/components/planets/Saturn";
import Uranus from "@/components/planets/Uranus";
import Neptune from "@/components/planets/Neptune";
import UFO from "@/components/planets/UFO";

import DynamicNav from "@/components/DynamicNav";

// Component điều khiển xoay camera
const ToggleOrbitControls = ({ enabled }: { enabled: boolean }) => {
    const controlsRef = useRef<any>(null);
    useEffect(() => {
        if (controlsRef.current) controlsRef.current.enabled = enabled;
    }, [enabled]);
    return <OrbitControls zoomSpeed={0.3} enablePan={false} ref={controlsRef} />;
};

export default function App() {
    const [controlsEnabled, setControlsEnabled] = useState(true);
    const [initialCameraPosition, setInitialCameraPosition] = useState<[number, number, number]>([0, 0, 500]);
    const [shouldShowVisuals, setShouldShowVisuals] = useState(false);
    const [shouldShowWriting, setShouldShowWriting] = useState(false);
    const [activeProject, setActiveProject] = useState<string | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    
    const processHash = (hash: string) => {
        const h = hash.toLowerCase();
        
        // Reset states
        setShouldShowVisuals(false);
        setShouldShowWriting(false);
        setActiveProject(null);
        setControlsEnabled(true);

        switch (true) {
            case h === '#mercury':
                setInitialCameraPosition([-15, 0, 25]);
                break;
            case h === '#venus':
                setInitialCameraPosition([30, 0, -5]);
                break;
            case h === '#earth' || h === '#visuals' || h === '#writing':
                setInitialCameraPosition([0, 0, 38]);
                if (h === '#visuals') setShouldShowVisuals(true);
                if (h === '#writing') setShouldShowWriting(true);
                if (h !== '#earth') setControlsEnabled(false);
                break;
            case h.startsWith('#projects'):
                setInitialCameraPosition([0, 0, 124]);
                if (h.includes('-')) {
                    setActiveProject(h.split('-')[1]);
                    setControlsEnabled(false);
                }
                break;
            case h === '#jupiter':
                setInitialCameraPosition([70, 0, 220]);
                break;
            case h === '#saturn':
                const saturnPos: [number, number, number] = [110, 0, 370];
                setInitialCameraPosition(saturnPos);
				if (cameraRef.current) {
                   cameraRef.current.position.set(...saturnPos);
        // Nhìn vào hành tinh Saturn (tọa độ group là 110, 0, 250)
                   cameraRef.current.lookAt(110, 0, 250); 
                }
                break;
            case h === '#uranus':
                setInitialCameraPosition([-60, 10, 350]);
                break;
            case h === '#neptune':
                setInitialCameraPosition([80, -5, 440]);
                break;
            case h === '#connect':
                setInitialCameraPosition([0, 0, 20]);
                break;
            case h === '#about':
            default:
                setInitialCameraPosition([0, 0, 500]);
                break;
        }
    };
    useEffect(() => {
        if (typeof window !== 'undefined') {
            processHash(window.location.hash);
            const handleHashChange = () => processHash(window.location.hash);
            window.addEventListener("hashchange", handleHashChange);
            return () => window.removeEventListener("hashchange", handleHashChange);
        }
    }, []);

    return (
        <ChakraProvider>
            <div className={css.scene}>
                <Canvas>
                    <PerspectiveCamera 
                        makeDefault 
                        position={initialCameraPosition}
                        ref={cameraRef}
                    />
                    
                    {controlsEnabled && <DynamicNav />}
                    <ToggleOrbitControls enabled={controlsEnabled} />

                    <ambientLight intensity={0.3} />
                    <pointLight position={[0, 0, 0]} intensity={2} color="#fff" />
                    
                    <Stars count={10000} radius={200} factor={7} fade />

                    <Sun />
                    <UFO />

                    {/* Render toàn bộ hệ mặt trời */}
                    <Mercury setControlsEnabled={setControlsEnabled} />
                    <Venus setControlsEnabled={setControlsEnabled} />
                    
                    <Earth 
                        setControlsEnabled={setControlsEnabled}
                        initialShowVisuals={shouldShowVisuals}
                        initialShowWriting={shouldShowWriting}
                    />
                    
                    <Mars 
                        setControlsEnabled={setControlsEnabled} 
                        initialProject={activeProject}
                    />

                    <Jupiter setControlsEnabled={setControlsEnabled} />
                    <Saturn setControlsEnabled={setControlsEnabled} />
                    <Uranus setControlsEnabled={setControlsEnabled} />
                    <Neptune setControlsEnabled={setControlsEnabled} />

                </Canvas>
                <Loader />
            </div>
        </ChakraProvider>
    );
}