import Planet from "./Planet";
import { Text } from "@react-three/drei";
import Card from "../Card";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Writing from "../interests/Writing";
import Visuals from "../interests/Visuals";
import Connect from "../Connect";
import Button from "../Button";

interface EarthProps {
	setControlsEnabled: Dispatch<SetStateAction<boolean>>;
	initialShowVisuals?: boolean;
	initialShowWriting?: boolean;
}

const Earth: React.FC<EarthProps> = ({ 
	setControlsEnabled, 
	initialShowVisuals = false, 
	initialShowWriting = false 
}) => {
	// State to track if Visuals component should be shown
	const [showVisuals, setShowVisuals] = useState(initialShowVisuals);
	const [showWriting, setShowWriting] = useState(initialShowWriting);

	// Apply initial state from props
	useEffect(() => {
		if (initialShowVisuals) {
			setShowVisuals(true);
			setControlsEnabled(false);
		} else if (initialShowWriting) {
			setShowWriting(true);
			setControlsEnabled(false);
		}
	}, [initialShowVisuals, initialShowWriting, setControlsEnabled]);

	const intro = (
		<p>
			?? What project can we collaborate on ?? <br />
			There's nothing I love more than sharing the joy of a creative
			project with friends <br />
			No matter what it is or could be, leave me message
		</p>
	);
	interface ConnectSubProps {
		onClose: () => void;
	}
	const ConnectSub: React.FC<ConnectSubProps> = ({ onClose }) => {
		return <Connect intro={intro} onClose={onClose} />;
	};

	// Handle closing the Visuals component
	const handleVisualsClose = () => {
		setShowVisuals(false);
		setControlsEnabled(true);
		// Update URL to remove the hash
		window.history.pushState(null, "", "#earth");
	};

	// Handle closing the Writing component
	const handleWritingClose = () => {
		setShowWriting(false);
		setControlsEnabled(true);
		// Update URL to remove the hash
		window.history.pushState(null, "", "#earth");
	};

	// Create custom components that update the URL when opened
	interface VisualsWrapperProps {
		onClose: () => void;
	}
	const VisualsWrapper: React.FC<VisualsWrapperProps> = ({ onClose }) => {
		// Update URL when component mounts
		useEffect(() => {
			window.history.pushState(null, "", "#visuals");
		}, []);
		
		return <Visuals onClose={onClose} />;
	};

	interface WritingWrapperProps {
		onClose: () => void;
	}
	const WritingWrapper: React.FC<WritingWrapperProps> = ({ onClose }) => {
		// Update URL when component mounts
		useEffect(() => {
			window.history.pushState(null, "", "#writing");
		}, []);
		
		return <Writing onClose={onClose} />;
	};

	return (
		<>
			<Planet
				position={[2, 0, 20]}
				meshMaterialPath="/earth_map.jpeg"
				spinSpeed={0.005}
				size={3.5}
			/>
			<Text
				color={"white"}
				position={[-5, 0, 20]}
				font="/fonts/futura_medium.ttf"
				maxWidth={9}
				textAlign="left"
				lineHeight={1.2}
				fontSize={0.8}
			>
				Here is where I play with my earthly pleasures. Check out these fun projects I've been working on.
			</Text>
			{/* <Card
				position={[8, 5, 20]}
				text="Writing"
				setControlsEnabled={setControlsEnabled}
				cardSize={[5, 3]}
				fontSize={0.5}
				ProjectComponent={Writing}
			/> */}
			<Button
				position={[6.5, 1.5, 20]}
				text="Visuals                  ➜"
				setControlsEnabled={setControlsEnabled}
				buttonSize={[5, 1]}
				fontSize={0.4}
				textXOffset={1.9}
				textYOffset={0.05}
				ProjectComponent={VisualsWrapper}
			/>
			<Button
				position={[6.5, -0.5, 20]}
				text="Writing                  ➜"
				setControlsEnabled={setControlsEnabled}
				buttonSize={[5, 1]}
				fontSize={0.4}
				textXOffset={2}
				textYOffset={0.15}
				ProjectComponent={WritingWrapper}
			/>
			<Button
				position={[6.5, -2.5, 20]}
				text="??                           ➜"
				setControlsEnabled={setControlsEnabled}
				buttonSize={[5, 1]}
				fontSize={0.4}
				textXOffset={1.8}
				textYOffset={-0.05}
				ProjectComponent={ConnectSub}
			/>

			{/* Render components directly if they should be shown */}
			{showVisuals && <Visuals onClose={handleVisualsClose} />}
			{showWriting && <Writing onClose={handleWritingClose} />}
		</>
	);
};

export default Earth;
