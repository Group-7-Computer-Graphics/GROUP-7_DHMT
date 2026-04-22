import { Plane, useCursor, Text, RoundedBox, Html } from "@react-three/drei";
import { Euler, useFrame, Vector3 } from "@react-three/fiber";
import {
	MutableRefObject,
	useEffect,
	useRef,
	useState,
	Dispatch,
	SetStateAction,
} from "react";
import * as THREE from "three";
import BorderedRoundedPlane from "./BorderedRoundedPlane";
import { border } from "@chakra-ui/react";

interface ButtonProps {
	position: [number, number, number];
	text: string;
	textXOffset?: number;
	textYOffset?: number;
	ProjectComponent?: React.ComponentType<any>;
	borderWidth?: number;
	buttonSize?: [
		width: number,
		height: number,
		widthSegments?: number | undefined,
		heightSegments?: number | undefined,
	];
	fontSize?: number;
	setControlsEnabled: Dispatch<SetStateAction<boolean>>;
}

const Button: React.FC<ButtonProps> = ({
	position,
	text,
	textXOffset = 2,
	textYOffset = 0.2,
	ProjectComponent,
	borderWidth = 0.1,
	buttonSize: size = [6, 3],
	fontSize = 0.8,
	setControlsEnabled,
}) => {
	const [backgroundColor, setBgColor] = useState("#000000");
	const textPosition = new THREE.Vector3(
		position[0] + textXOffset,
		position[1] + size[1] / 2 - textYOffset,
		position[2] + 1
	);
	const arrowPosition = new THREE.Vector3(
		position[0] + size[0] - 2,
		position[1] + size[1] / 2 - textYOffset,
		position[2] + 1
	);
	const [hovered, setHovered] = useState(false);
	useCursor(hovered);
	const handleHover = () => {
		setHovered(true);
		setBgColor("#515151");
	};
	const handleUnhover = () => {
		setHovered(false);
		setBgColor("#000000");
	};

	const [showOverlay, setShowOverlay] = useState(false);
	const close = () => {
		setShowOverlay(!showOverlay);
		setControlsEnabled(true);
	};

	const open = () => {
		setShowOverlay(!showOverlay);
		setControlsEnabled(false);
	};

	return (
		<group>
			<BorderedRoundedPlane
				onClick={open}
				position={position}
				width={size[0]}
				height={size[1]}
				borderRadius={0.4}
				borderWidth={borderWidth}
				borderColor={"#888888"}
				backgroundColor={backgroundColor}
				onPointerOver={handleHover}
				onPointerOut={handleUnhover}
			/>
			<Text position={textPosition} fontSize={fontSize} color={"white"}>
				{text}
			</Text>
			{/* THE OVERLAY */}
			{showOverlay && ProjectComponent && (
				<ProjectComponent onClose={close} />
			)}
		</group>
	);
};

export default Button;
