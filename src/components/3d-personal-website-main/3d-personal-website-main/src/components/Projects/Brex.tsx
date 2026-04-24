import { Box, Image } from "@chakra-ui/react";
import Projects from "../projects";
import { ProjectProps } from "./Wikicredibility";

const OtherContent = () => {
	const imagePath =
		"https://i.pinimg.com/originals/90/88/1e/90881e9b4b15ca8d24dd87be250b1bfe.gif";
	return (
		<>
			<Box
				width="100%"
				display="flex"
				alignItems="center"
				justifyContent="center"
			>
				<Image
					boxSize="50%"
					borderRadius="20"
					margin={20}
					src={imagePath}
				/>
			</Box>
			<Box
				width="100%"
				display="flex"
				alignItems="center"
				justifyContent="center"
			>
				<Image
					boxSize="50%"
					borderRadius="20"
					margin={20}
					src={imagePath}
				/>
			</Box>
		</>
	);
};

const Brex: React.FC<ProjectProps> = ({ onClose }) => {
	const content = (
		<div>
			<div
				style={{
					fontFamily: "var(--font-futura)",
					fontWeight: 400,
					fontSize: 18,
				}}
			>
				Growth team
			</div>
			<ul
				style={{
					listStyle: "inherit",
				}}
			>
				<li>
					Led the project to block bad leads from the signup flow to
					save resources for Sales team; collaborated with Data
					Science team to find the best blocking metrics, resulting in
					300+ bad leads caught in 3 months
				</li>
				<li>
					Developed a new schema with GraphQL and gRPC for the new
					customer segmentation definition (OBS4); launched a new
					signup flow for OBS4 with Next.js, xState, and Typescript;
					created a Retool page to facilitate the adoption of OBS4 by
					the GTM team 6 months ahead of the company's full transition
				</li>
				<li>
					Customized the signup flow for leads from Venture Backed
					events, resulting in a better white glove experience for
					those high-quality leads, generating higher signup and
					retention rates
				</li>
			</ul>
			<br />
			<div
				style={{
					fontFamily: "var(--font-futura)",
					fontWeight: 400,
					fontSize: 18,
				}}
			>
				Data Platform team
			</div>
			<ul style={{ listStyle: "inherit" }}>
				<li>
					Revamped Snowflake access control system, reducing time to
					update access by 80% through migration from Terraform to
					Airflow and Python jobs{" "}
				</li>
				<li>
					Collaborated with IT team, integrating Snowflake with Okta
					SCIM to automate onboarding of new users{" "}
				</li>
				<li>
					Prototyped team-level Snowflake access control with Python
					that would decrease runtime by 20%
				</li>
			</ul>
		</div>
	);
	return (
		<Projects
			imagePath="https://i.pinimg.com/originals/90/88/1e/90881e9b4b15ca8d24dd87be250b1bfe.gif"
			onClose={onClose}
			projectTitle="Brex"
			time="July 2023 - February 2024 • May - August 2022"
			link="https://www.brex.com/signup"
			role="Fullstack Software Engineer"
			stack="Typescript, Kotlin, NextJS, GraphQL, gRPC, postgreSQL"
			content={content}
		/>
	);
};

export default Brex;
