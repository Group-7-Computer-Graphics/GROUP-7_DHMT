import { Sphere, useCursor } from "@react-three/drei";
import { Mesh, TextureLoader } from "three";
import { useFrame, Vector3 } from "@react-three/fiber";
import { useRef, useState } from "react";
import { useRouter } from "next/router";

interface PlanetProps {
	meshMaterialPath: string;
	position: Vector3;
	spinSpeed: number;
	size?: number;
}
const Planet = (props: PlanetProps) => {
	const texture = new TextureLoader().load(props.meshMaterialPath);
	const planetRef = useRef<Mesh>(null);
	useFrame(() => {
		if (planetRef.current) {
			planetRef.current.rotation.y += props.spinSpeed;
		}
	});
	const planetSize = props.size || 1;
	return (
		<>
			<ambientLight intensity={1.5} />
			<Sphere
				args={[planetSize, 64, 64]}
				ref={planetRef}
				position={props.position}
			>
				<meshStandardMaterial map={texture} />
			</Sphere>
		</>
	);
};
export default Planet;
