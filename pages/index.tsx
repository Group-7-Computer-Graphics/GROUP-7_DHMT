import css from "@/styles/Home.module.css";
import React, { useEffect, useRef, useState } from "react";
import { Canvas, Vector3 } from "@react-three/fiber";
import { OrbitControls, Stars, PerspectiveCamera } from "@react-three/drei";
import Earth from "@/components/planets/Earth";
import Sun from "@/components/planets/Sun";
import Mercury from "@/components/planets/Mercury";
import Mars from "@/components/planets/Mars";
import { ChakraProvider } from "@chakra-ui/react";
import DynamicNav from "@/components/DynamicNav";
import { Loader } from "@react-three/drei";
import * as THREE from "three";

interface ToggleOrbitControlsProps {
	enabled: boolean;
}
const ToggleOrbitControls: React.FC<ToggleOrbitControlsProps> = ({
	enabled,
}) => {
	const controlsRef = useRef<any>(null);

	// Update controls' enabled state
	useEffect(() => {
		controlsRef.current.enabled = enabled;
	}, [enabled]);

	return (
		<OrbitControls zoomSpeed={0.3} enablePan={false} ref={controlsRef} />
	);
};

export default function App() {
	const [controlsEnabled, setControlsEnabled] = useState(true);
	const [initialCameraPosition, setInitialCameraPosition] = useState<[number, number, number]>([0, 0, 500]);
	const [initialHash, setInitialHash] = useState("");
	const [shouldShowVisuals, setShouldShowVisuals] = useState(false);
	const [shouldShowWriting, setShouldShowWriting] = useState(false);
	const [activeProject, setActiveProject] = useState<string | null>(null);
	const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
	
	// Process URL hash (both on initial load and hash changes)
	const processHash = (hash: string) => {
		// Set camera position based on hash
		if (hash.startsWith('#projects')) {
			setInitialCameraPosition([0, 0, 124]);
			
			// Set specific project to show if specified
			if (hash === '#projects-dance') {
				setActiveProject('dance');
				setControlsEnabled(false);
			} else if (hash === '#projects-scios') {
				setActiveProject('scios');
				setControlsEnabled(false);
			} else if (hash === '#projects-personal') {
				setActiveProject('personal');
				setControlsEnabled(false);
			} else if (hash === '#projects-brex') {
				setActiveProject('brex');
				setControlsEnabled(false);
			} else if (hash === '#projects-wiki') {
				setActiveProject('wiki');
				setControlsEnabled(false);
			} else {
				// Generic #projects - reset any active projects
				setActiveProject(null);
				setControlsEnabled(true);
			}
			
			// Reset visuals/writing state
			setShouldShowVisuals(false);
			setShouldShowWriting(false);
		} else if (hash === '#visuals') {
			setInitialCameraPosition([0, 0, 38]);
			setShouldShowVisuals(true);
			setShouldShowWriting(false);
			setActiveProject(null);
			setControlsEnabled(false);
		} else if (hash === '#writing') {
			setInitialCameraPosition([0, 0, 38]);
			setShouldShowVisuals(false);
			setShouldShowWriting(true);
			setActiveProject(null);
			setControlsEnabled(false);
		} else if (hash === '#earth') {
			setInitialCameraPosition([0, 0, 38]);
			setShouldShowVisuals(false);
			setShouldShowWriting(false);
			setActiveProject(null);
			setControlsEnabled(true);
		} else if (hash === '#connect') {
			setInitialCameraPosition([0, 0, 20]);
			setShouldShowVisuals(false);
			setShouldShowWriting(false);
			setActiveProject(null);
			setControlsEnabled(true);
		} else if (hash === '#about') {
			setInitialCameraPosition([0, 0, 500]);
			setShouldShowVisuals(false);
			setShouldShowWriting(false);
			setActiveProject(null);
			setControlsEnabled(true);
		}
	};
	
	// Process the URL hash on initial load and hash changes
	useEffect(() => {
		// Only run this on the client side
		if (typeof window !== 'undefined') {
			const hash = window.location.hash.toLowerCase();
			setInitialHash(hash);
			
			// Process initial hash
			processHash(hash);
			
			// Add listener for hash changes
			const handleHashChange = () => {
				const newHash = window.location.hash.toLowerCase();
				processHash(newHash);
			};
			
			window.addEventListener("hashchange", handleHashChange);
			return () => {
				window.removeEventListener("hashchange", handleHashChange);
			};
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
					{controlsEnabled ? <DynamicNav /> : null}
					<ToggleOrbitControls enabled={controlsEnabled} />

					<ambientLight intensity={0.2} />
					<spotLight position={[30, 30, 10]} />
					<Stars
						count={10000}
						radius={100}
						speed={2}
						factor={8}
						fade={true}
					/>
					<Sun />
					<Mars 
						setControlsEnabled={setControlsEnabled} 
						initialProject={activeProject}
					/>
					<Earth 
						setControlsEnabled={setControlsEnabled}
						initialShowVisuals={shouldShowVisuals}
						initialShowWriting={shouldShowWriting}
					/>
					<Mercury setControlsEnabled={setControlsEnabled} />
				</Canvas>
				<Loader />
			</div>
		</ChakraProvider>
	);
}
