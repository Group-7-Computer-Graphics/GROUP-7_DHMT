import * as THREE from "three";

interface RoundedPlaneProps {
	position: [number, number, number];
	width: number;
	height: number;
	borderRadius: number;
	backgroundColor: string;
	onPointerOver: () => void;
	onPointerOut: () => void;
	onClick?: () => void;
}
const RoundedPlane: React.FC<RoundedPlaneProps> = ({
	position,
	width,
	height,
	borderRadius,
	backgroundColor,
	onPointerOver,
	onPointerOut,
	onClick,
}) => {
	const roundedPlane = new THREE.Shape();
	roundedPlane.moveTo(0, borderRadius);
	roundedPlane.quadraticCurveTo(0, 0, borderRadius, 0);
	roundedPlane.lineTo(width - borderRadius, 0);
	roundedPlane.quadraticCurveTo(width, 0, width, borderRadius);
	roundedPlane.lineTo(width, height - borderRadius);
	roundedPlane.quadraticCurveTo(width, height, width - borderRadius, height);
	roundedPlane.lineTo(borderRadius, height);
	roundedPlane.quadraticCurveTo(0, height, 0, height - borderRadius);
	roundedPlane.lineTo(0, borderRadius);

	return (
		<group
			position={position}
			onPointerOut={onPointerOut}
			onPointerOver={onPointerOver}
			onClick={onClick}
		>
			<mesh>
				<shapeGeometry args={[roundedPlane]} />
				<meshBasicMaterial color={backgroundColor} />
			</mesh>
		</group>
	);
};

interface BorderedRoundedPlaneProps {
	borderRadius: number;
	borderWidth: number;
	borderColor: string;
	backgroundColor: string;
	position: [number, number, number];
	width: number;
	height: number;
	onPointerOver: () => void;
	onPointerOut: () => void;
	onClick: () => void;
}
const BorderedRoundedPlane: React.FC<BorderedRoundedPlaneProps> = ({
	borderRadius,
	borderWidth,
	borderColor,
	backgroundColor,
	position,
	width,
	height,
	onPointerOver,
	onPointerOut,
	onClick,
}) => {
	return (
		<>
			{/* main plane */}
			<RoundedPlane
				position={position}
				width={width}
				height={height}
				borderRadius={borderRadius}
				backgroundColor={backgroundColor}
				onPointerOut={onPointerOut}
				onPointerOver={onPointerOver}
				onClick={onClick}
			/>
			{/* border plane */}
			<RoundedPlane
				position={[
					position[0] - borderWidth / 2,
					position[1] - borderWidth / 2,
					position[2] - 0.01,
				]}
				width={width + borderWidth}
				height={height + borderWidth}
				borderRadius={borderRadius}
				backgroundColor={borderColor}
				onPointerOut={onPointerOut}
				onPointerOver={onPointerOver}
			/>
		</>
	);
};

export default BorderedRoundedPlane;
