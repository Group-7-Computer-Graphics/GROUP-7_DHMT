import {
	Box,
	Flex,
	Image,
	Spacer,
	Text,
	CloseButton,
	Grid,
	GridItem,
} from "@chakra-ui/react";
import React, { useEffect, useRef } from "react";
import { Html } from "@react-three/drei";
import { motion } from "framer-motion";

export interface OverlayPageProps {
	onClose: () => void;
	imagePath: string;
	projectTitle: string;
	time: string;
	link: string;
	role: string;
	stack: string;
	content: React.ReactNode;
	OtherContent?: React.ComponentType<any>;
}

const Projects: React.FC<OverlayPageProps> = ({
	onClose,
	imagePath,
	projectTitle,
	time,
	link,
	role,
	stack,
	content,
	OtherContent,
}) => {
	return (
		<Html
			style={{
				width: "100vw",
				height: "95vh",
				top: "-50vh",
				position: "absolute",
				left: "-50vw",
				overflowY: "auto",
				borderRadius: "20px",
				margin: "10px",
				padding: "10px",
				backgroundImage: 'url("/starry_background.png")',
			}}
		>
			<CloseButton
				color="white"
				onClick={onClose}
				fontSize={24}
				style={{ position: "fixed" }}
			/>
			<motion.div
				initial={{ opacity: 0, y: 100 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, ease: "easeIn" }}
			>
				<Box width="100%" display={"flex"}>
					<Image
						boxSize="100%"
						borderRadius="20"
						margin={40}
						src={imagePath}
						height={"70vh"}
						objectFit={"cover"}
					/>
				</Box>
				<Grid
					templateColumns="repeat(4, 1fr)"
					gap={40}
					textColor={"white"}
					margin={40}
					marginTop={-16}
				>
					<GridItem w="100%" />
					<GridItem w="100%" colSpan={2}>
						<Box fontSize={55} fontFamily="var(--font-futura)">
							{" "}
							{projectTitle}{" "}
						</Box>
						{/* Summary info */}
						<Box
							backgroundColor={"#212121"}
							borderRadius={"10"}
							p={16}
							fontFamily="var(--font-futura)"
							fontWeight={300}
							fontSize={20}
						>
							<Box m={4} display={"flex"} flexDir={"row"}>
								<div
									style={{
										fontFamily: "var(--font-wingding)",
										fontSize: 30,
									}}
								>
									6
								</div>
								<div style={{ paddingTop: 9, paddingLeft: 17 }}>
									{time}
								</div>
							</Box>
							<Box m={4} display={"flex"} flexDir={"row"}>
								<div
									style={{
										fontFamily: "var(--font-wingding)",
										fontSize: 30,
									}}
								>
									:
								</div>
								<div style={{ paddingTop: 9, paddingLeft: 8 }}>
									{role}
								</div>
							</Box>
							<Box m={4} display={"flex"} flexDir={"row"}>
								<div
									style={{
										fontFamily: "var(--font-wingding)",
										fontSize: 30,
									}}
								>
									4
								</div>
								<div style={{ paddingTop: 11, paddingLeft: 8 }}>
									{stack}
								</div>
							</Box>
							<Box m={4} display={"flex"} flexDir={"row"}>
								<div
									style={{
										fontFamily: "var(--font-wingding)",
										fontSize: 30,
										paddingTop: 2,
									}}
								>
									F
								</div>
								<a
									href={link}
									target="_blank"
									style={{ paddingTop: 9, paddingLeft: 8 }}
								>
									Link
								</a>
							</Box>
						</Box>
						{/* Main text explain */}
						<Box mt={24}>{content}</Box>
						{OtherContent && <OtherContent />}
					</GridItem>
					<GridItem w="100%" />
				</Grid>
			</motion.div>
		</Html>
	);
};

export default Projects;
