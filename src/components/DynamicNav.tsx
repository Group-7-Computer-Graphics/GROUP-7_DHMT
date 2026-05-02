import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import React from "react";
import { Html } from "@react-three/drei";

const DynamicNav = () => {
	const { camera } = useThree();
	const [animating, setAnimating] = React.useState(false);
	const easeInOut = (t: number) => {
		return 1 - Math.pow(1 - t, 9);
	};

	// Handle camera movement animation
	const animateCamera = (targetPosition: THREE.Vector3Like) => {
		setAnimating(true);

		const startTime = Date.now();
		const duration = 2000;
		const startPosition = camera.position.clone();

		const animateFrame = () => {
			const now = Date.now();
			const progress = Math.min((now - startTime) / duration, 1); // Ensure progress is between 0 and 1
			const easedProgress = easeInOut(progress);

			// Interpolate between start and target position
			const newPosition = startPosition
				.clone()
				.lerp(targetPosition, easedProgress);
			camera.position.copy(newPosition);

			// Check if animation is complete
			if (progress < 1) {
				requestAnimationFrame(animateFrame);
			} else {
				setAnimating(false);
			}
		};

		animateFrame();
	};

	useFrame(() => {
		if (animating) {
			camera.updateMatrixWorld();
		}
	});

	const handleClickAbout = () => {
		window.history.pushState(null, "", "#about");
		animateCamera(new THREE.Vector3(0, 0, 500));
	};
	
	const handleClickProject = () => {
		window.history.pushState(null, "", "#projects");
		animateCamera(new THREE.Vector3(0, 0, 124));
	};
	
	const handleClickEarth = () => {
		window.history.pushState(null, "", "#earth");
		animateCamera(new THREE.Vector3(0, 0, 38));
	};
	
	const handleClickConnect = () => {
		window.history.pushState(null, "", "#connect");
		animateCamera(new THREE.Vector3(0, 0, 20));
	};
	
	const handleRealign = () => {
		const startPosition = camera.position.clone();
		const endPosition = new THREE.Vector3(0, 0, Math.abs(startPosition.z));
		animateCamera(endPosition);
	};

	return (
		<>
			<Html
				style={{
					position: "absolute",
					top: "-48vh",
					left: "-47vw",
					padding: "10px",
					display: "flex",
					flexDirection: "column",
					alignItems: "flex-start",
				}}
			>
				<button
					style={{
						fontFamily: "var(--font-nasa)",
						margin: 4,
						fontSize: 24,
						marginBottom: 10,
						color: "#4D7FFF",
					}}
					onClick={handleClickAbout}
				>
					TRANG DOAN{" "}
				</button>
			</Html>
			<Html
				style={{
					position: "absolute",
					top: "43vh",
					left: "-25vw",
					padding: "0px",
					width: "50vw",
					height: "7vh",
					display: "flex",
					flexDirection: "row",
					justifyContent: "space-evenly",
					fontFamily: "var(--font-inter)",
					fontWeight: 600,
					color: "white",
					fontSize: 18,
				}}
			>
				<button onClick={handleClickProject}>Projects </button>
				<button onClick={handleClickEarth}>Earthly pleasures</button>
				<button onClick={handleClickConnect}>Connect</button>
			</Html>
			<Html
				style={{
					position: "absolute",
					top: "45vh",
					right: "-48vw",
					padding: "0px",
					height: "7vh",
					display: "flex",
					flexDirection: "row",
					justifyContent: "space-evenly",
					fontFamily: "var(--font-inter)",
					fontWeight: 600,
					color: "#BFBFBF",
					fontSize: 16,
				}}
			>
				<button
					onClick={handleRealign}
					style={{
						display: "flex",
						flexDirection: "row",
						gap: 4,
						alignItems: "center",
					}}
				>
					{" "}
					<img src="/icons/compass.svg" width={30} />
					Realign
				</button>
			</Html>
		</>
	);
};

export default DynamicNav;
