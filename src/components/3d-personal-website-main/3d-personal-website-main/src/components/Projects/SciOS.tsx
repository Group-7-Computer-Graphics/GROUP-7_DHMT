import Projects from "../projects";
import { ProjectProps } from "./Wikicredibility";

const SciOS: React.FC<ProjectProps> = ({ onClose }) => {
	const content = (
		<div>
			Designed and developed the new SciOS website. SciOS is a NPO that
			supports open science project.
			<br />
			<br />
			I studied their identity, came up with the new design guidelines,
			and built the website using NextJS and TailwindCSS.
			<br />
			<br />
			You can read through the process with this{" "}
			<a href="https://www.figma.com/slides/V4u4t7E7UHxCuqHrfYRzep/SciOS-Round-1-presentation?node-id=1-25&t=yAKmMBspnU0qbrVB-1"
				target="_blank"
				style={{ textDecoration: "underline" }}
			>
				brand guide presentation
			</a>
			, and this <a
				href="https://www.figma.com/design/CDOsf8LQDEXgM908Noa5B2/SciOS-design?node-id=0-1&t=IYWgOKNHu5jBHv4m-1"
				target="_blank"
				style={{ textDecoration: "underline" }}
			>
				Figma design file
			</a>
			. The final product can be viewed at{" "}
			<a href="https://www.scios.tech/" target="_blank" style={{ textDecoration: "underline" }}>
				www.scios.tech
			</a>
			.
		</div>
	);
	return (
		<Projects
			content={content}
			onClose={onClose}
			imagePath="/SciOS.png"
			projectTitle="SciOS"
			time="October 2024"
			link="https://www.scios.tech/"
			role="Designer, Developer"
			stack="Typescript, NextJS, React, TailwindCSS"
		/>
	);
};
export default SciOS;