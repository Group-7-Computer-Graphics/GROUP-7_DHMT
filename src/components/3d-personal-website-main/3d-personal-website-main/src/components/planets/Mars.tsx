import Planet from "./Planet";
import { Text, useCursor } from "@react-three/drei";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import Card from "../Card";
import Brex from "../Projects/Brex";
import PersonalWebsite from "../Projects/PersonalWebsite";
import Button from "../Button";
import DanceFilm from "../Projects/DanceFilm";
import SciOS from "../Projects/SciOS";
import Wikicredibility from "../Projects/Wikicredibility";

interface MarsProps {
	setControlsEnabled: Dispatch<SetStateAction<boolean>>;
	initialProject?: string | null;
}

const Mars: React.FC<MarsProps> = ({ setControlsEnabled, initialProject = null }) => {
	// State to track which project to show
	const [activeProject, setActiveProject] = useState<string | null>(initialProject);
	
	// Update active project if initialProject prop changes
	useEffect(() => {
		setActiveProject(initialProject);
	}, [initialProject]);

	// Handle project closing
	const handleCloseProject = () => {
		setActiveProject(null);
		setControlsEnabled(true);
		// Update URL to general projects section
		window.history.pushState(null, "", "#projects");
	};

	const handleViewResume = () => {
		window.open(
			"https://drive.google.com/file/d/1Wxli3bgxoxnHO2s2kxyZwmT8-EeCiIB4/view?usp=sharing",
			"_blank"
		);
	};
	
	const [hovered, setHovered] = useState(false);
	useCursor(hovered);

	return (
		<>
			<Planet
				position={[6, 0, 80]}
				meshMaterialPath="/mars.jpeg"
				spinSpeed={0.002}
				size={10}
			/>
			<Text
				color={"white"}
				position={[-11, 0, 80]}
				font="/fonts/futura_medium.ttf"
				lineHeight={1.2}
				fontSize={1.2}
				maxWidth={14}
				textAlign="left"
				onClick={handleViewResume}
				onPointerOver={() => setHovered(true)}
				onPointerOut={() => setHovered(false)}
			>
				My projects are out of this world. Here are some
				selected work. You can view my resume here.
			</Text>
			<Button
				position={[18, 5, 80]}
				buttonSize={[11, 2.5]}
				borderWidth={0.1}
				textXOffset={5.1}
				textYOffset={0.1}
				text="Dance film           ➜"
				setControlsEnabled={setControlsEnabled}
				ProjectComponent={DanceFilm}
				/>
			<Button
				position={[18, -1, 80]}
				buttonSize={[11, 2.5]}
				borderWidth={0.1}
				textXOffset={5.1}
				textYOffset={-0.1}
				text="SciOS                 ➜"
				setControlsEnabled={setControlsEnabled}
				ProjectComponent={SciOS}
				/>
			<Button
				position={[18, -7, 80]}
				buttonSize={[11, 2.5]}
				borderWidth={0.1}
				textXOffset={5.1}
				text="Personal website       ➜"
				setControlsEnabled={setControlsEnabled}
				ProjectComponent={PersonalWebsite}
			/>

			{/* Conditionally render projects based on activeProject state */}
			{activeProject === "personal" && <PersonalWebsite onClose={handleCloseProject} />}
			{activeProject === "dance" && <DanceFilm onClose={handleCloseProject} />}
			{activeProject === "scios" && <SciOS onClose={handleCloseProject} />}
		</>
	);
};

export default Mars;
