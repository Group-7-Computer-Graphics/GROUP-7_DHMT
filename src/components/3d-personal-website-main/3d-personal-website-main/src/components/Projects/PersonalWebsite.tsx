import Projects from "../projects";
import { ProjectProps } from "./Wikicredibility";

const PersonalWebsite: React.FC<ProjectProps> = ({ onClose }) => {
	const content = (
		<div>
			This website is made with joy! <br />
			I'm especially proud of this website because I tried to make it once
			in 2021, but{" "}
			<a
				href="https://trangdoan.substack.com/i/103278110/side-projects"
				target="_blank"
			>
				<u>gave up</u> half-way.{" "}
			</a>{" "}
			Picking it up and feeling confident doing so was such a growth
			moment. <br />
			<br />I also learned so much about graphic design, UX/UI for this
			project.
			<br />
			This is how my first designs look like. Very Canva-mom-and-pop-shop
			vibe.
			<br />
			<br />
			<img src="/firstDesigns.png" />
			<br />
			With the help of a few design & typography books, and a few friends,
			this website is not giving "I don't know what I'm doing" anymore 😂.
			<i> A *New* Program to Graphic Design</i> by David Reinfurt unlocked
			my imagination on what design is and what a interface could look
			like. <i>A Primer to Type</i> by John Kane blew my mind on how
			subtle typography changes can shape the reading experience.{" "}
			<i>A Primer of Visual Literacy</i> by Donis A. Dondis is dry but
			useful. Most of all, I loved loved loved iterating over different
			design versions.
			<br />
			<br />
			<img src="/finalDesigns.png" />
			<br />
			Shoutout to Joey for a few rounds of feedback. Special shoutout to
			Arjun for helping me figure out the story of this website + perform
			Figma magic to open my eyes.
		</div>
	);
	return (
		<Projects
			onClose={onClose}
			imagePath={"/personalWebsite.gif"}
			projectTitle="This Website"
			time="February 2024 - April 2024"
			link="https://github.com/trangdoan982/3d-personal-website"
			role="Frontend developer"
			stack="Typescript, ThreeJS, NextJS, React"
			content={content}
		/>
	);
};

export default PersonalWebsite;
