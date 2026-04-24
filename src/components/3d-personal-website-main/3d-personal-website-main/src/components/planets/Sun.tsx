import { useState } from "react";
import Planet from "./Planet";
import { Text, Image, useCursor } from "@react-three/drei";

const Sun = () => {
	const handleOnClickLinkedIn = () => {
		window.open("https://www.linkedin.com/in/trang-doan-m23/", "_blank");
	};
	const handleOnClickGithub = () => {
		window.open("https://github.com/trangdoan982", "_blank");
	};
	const handleOnClickSubstack = () => {
		window.open("https://trangdoan.substack.com/", "_blank");
	};
	const [hovered, setHovered] = useState(false);
	useCursor(hovered);

	return (
		<>
			<Planet
				position={[58, 0, 250]}
				meshMaterialPath="/sun.jpeg"
				spinSpeed={0.005}
				size={70}
			/>
			<Text
				color={"white"}
				position={[-80, 20, 250]}
				maxWidth={130}
				font="/fonts/futura_medium.ttf"
				lineHeight={1.2}
				fontSize={8}
				textAlign="left"
			>
				Welcome to my space. I am Trang. I
				code, tell stories, move my body, and build communities.
			</Text>
			<Image
				url="/icons/linkedin.png"
				position={[-141, -10, 250]}
				color={"white"}
				scale={8}
				onClick={handleOnClickLinkedIn}
				onPointerOver={() => setHovered(true)}
				onPointerOut={() => setHovered(false)}
			/>
			<Image
				url="/icons/github.png"
				position={[-126, -10, 250]}
				color={"white"}
				scale={7}
				onClick={handleOnClickGithub}
				onPointerOver={() => setHovered(true)}
				onPointerOut={() => setHovered(false)}
			/>
			<Image
				url="/icons/substack.png"
				position={[-111, -10, 250]}
				color={"white"}
				scale={6}
				onClick={handleOnClickSubstack}
				onPointerOver={() => setHovered(true)}
				onPointerOut={() => setHovered(false)}
			/>
			<Text
				color={"#787878"}
				position={[-118, -40, 250]}
				fontSize={5}
				font="/fonts/futura_medium.ttf"
			>
				* Zoom or Scroll to explore
			</Text>
			<Text
				color={"#787878"}
				position={[-130.5, -48, 250]}
				fontSize={5}
				font="/fonts/futura_medium.ttf"
			>
				Drag for fun.
			</Text>
		</>
	);
};

export default Sun;
