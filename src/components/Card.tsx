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
	cardSize?: [
		width?: number | undefined,
		height?: number | undefined,
		widthSegments?: number | undefined,
		heightSegments?: number | undefined,
	];
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
	const positionArr = position as number[];
	const [hovered, setHovered] = useState(false);
	useCursor(hovered);

	const offSet = (ref: MutableRefObject<any>) => {
		const originalPosition = useRef({
			x: positionArr[0],
			y: positionArr[1],
			z: positionArr[2],
		});
		useEffect(() => {
			originalPosition.current = ref.current.position.clone();
		}, []);

		useFrame(() => {
			if (hovered) {
				ref.current.position.y = originalPosition.current.y + 0.1;
				ref.current.position.x = originalPosition.current.x + 0.1;
			} else {
				ref.current.position.copy(originalPosition.current);
			}
		});
	};

	const planeRef = useRef<any>(null);
	const textRef = useRef<any>(null);
	offSet(planeRef);
	offSet(textRef);

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
