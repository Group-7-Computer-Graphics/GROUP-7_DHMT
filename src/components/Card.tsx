import { Plane, RoundedBox, Shadow, Text, useCursor } from "@react-three/drei";
import { Euler, useFrame, useThree, Vector3 } from "@react-three/fiber";
import {
	MutableRefObject,
	useEffect,
	useRef,
	useState,
	Dispatch,
	SetStateAction,
} from "react";
import * as THREE from "three";

interface CardProps {
	position: Vector3;
	rotation?: Euler;
	text: string;
	ProjectComponent?: React.ComponentType<any>;
	cardSize?: [number, number];
	fontSize?: number;
	setControlsEnabled: Dispatch<SetStateAction<boolean>>;
}
const Card: React.FC<CardProps> = ({
	position,
	rotation,
	text,
	ProjectComponent,
	cardSize: size = [6, 3],
	fontSize = 1,
	setControlsEnabled,
}) => {
	const positionArr = [position.x, position.y, position.z];
	const [hovered, setHovered] = useState(false);
	useCursor(hovered);

	const planeRef = useRef<any>(null);
	const textRef = useRef<any>(null);
	const originalPlanePosition = useRef<THREE.Vector3 | null>(null);
	const originalTextPosition = useRef<THREE.Vector3 | null>(null);

	useEffect(() => {
		if (planeRef.current) {
			originalPlanePosition.current = planeRef.current.position.clone();
		}
		if (textRef.current) {
			originalTextPosition.current = textRef.current.position.clone();
		}
	}, []);

	useFrame(() => {
		if (planeRef.current && originalPlanePosition.current) {
			if (hovered) {
				planeRef.current.position.y = originalPlanePosition.current.y + 0.1;
				planeRef.current.position.x = originalPlanePosition.current.x + 0.1;
			} else {
				planeRef.current.position.copy(originalPlanePosition.current);
			}
		}
		if (textRef.current && originalTextPosition.current) {
			if (hovered) {
				textRef.current.position.y = originalTextPosition.current.y + 0.1;
				textRef.current.position.x = originalTextPosition.current.x + 0.1;
			} else {
				textRef.current.position.copy(originalTextPosition.current);
			}
		}
	});

	const handleHover = () => {
		setHovered(true);
	};
	const handleUnhover = () => {
		setHovered(false);
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

	const shadowPosition = new THREE.Vector3(
		positionArr[0],
		positionArr[1],
		positionArr[2] - 1
	);
	const textPosition = new THREE.Vector3(
		positionArr[0] - 0.3,
		positionArr[1],
		positionArr[2] + 1
	);
	return (
		<>
			<RoundedBox
				onClick={open}
				position={position}
				rotation={rotation}
				args={[size[0], size[1], 1]}
				radius={0.5}
				onPointerOver={handleHover}
				onPointerOut={handleUnhover}
				material-color="white"
				ref={planeRef}
			></RoundedBox>

			{/* THE SHADOW */}
			<RoundedBox
				args={[size[0], size[1], 1]}
				position={shadowPosition}
				rotation={rotation}
				radius={0.5}
			>
				<meshBasicMaterial color="grey" transparent opacity={0.7} />
			</RoundedBox>
			<Text
				position={textPosition}
				rotation={rotation}
				fontSize={fontSize}
				color={"black"}
				ref={textRef}
				// font="/spaceFont.ttf"
			>
				{text}
			</Text>

			{/* THE OVERLAY */}
			{showOverlay && ProjectComponent && (
				<ProjectComponent onClose={close} />
			)}
		</>
	);
};

export default Card;
