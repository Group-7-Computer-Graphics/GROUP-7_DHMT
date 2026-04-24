import { useLoader } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import Card from "../Card";
import Connect from "../Connect";
import { Dispatch, SetStateAction, useRef } from "react";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/Addons.js";
import { Group } from "three";
import Button from "../Button";

const UFO = () => {
	const objRef = useRef<Group>(null);
	const mtl = useLoader(MTLLoader, "/models/Low_poly_UFO.mtl");
	const obj = useLoader(OBJLoader, "/models/ufo.obj", (loader) => {
		loader.setMaterials(mtl);
	});
	mtl.preload();
	return (
		<group
			ref={objRef}
			position={[7, -1, 0]}
			scale={0.12}
			rotation={[-10, -20, -10]}
		>
			<primitive object={obj} />
		</group>
	);
};
interface MercuryProps {
	setControlsEnabled: Dispatch<SetStateAction<boolean>>;
}
const Mercury: React.FC<MercuryProps> = ({ setControlsEnabled }) => {
	const intro = (
		<p>
			Hi there, if you've had some fun browsing through this website, it
			means we could be friends. <br /> I'm a big fan of talking to
			strangers, meeting new people, and letting this kind of magic
			happen. <br /> But I get it, I've browsed through endless personal
			websites, found cool people, and never reached out to them because I
			didn't know what to say except "Your website seems cool." <br />
			So here are some prompts to help spark your creativity:{" "}
		</p>
	);
	interface ConnectMainProps {
		onClose: () => void;
	}
	const ConnectMain: React.FC<ConnectMainProps> = ({ onClose }) => {
		return <Connect intro={intro} onClose={onClose} />;
	};

	return (
		<>
			<UFO />
			<Text
				color={"white"}
				position={[-1.5, 2, 0]}
				fontSize={0.85}
				font="/fonts/futura_medium.ttf"
				lineHeight={1.2}
				maxWidth={5}
				textAlign="right"
			>
				Make first contact
			</Text>
			<Button
				position={[-2, -1.1, 0]}
				text="But How?"
				setControlsEnabled={setControlsEnabled}
				buttonSize={[3, 1]}
				fontSize={0.4}
				textXOffset={1.5}
				textYOffset={-0.1}
				ProjectComponent={ConnectMain}
			/>
		</>
	);
};

export default Mercury;
