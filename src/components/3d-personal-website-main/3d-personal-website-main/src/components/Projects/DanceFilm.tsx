import Projects from "../projects";
import { ProjectProps } from "./Wikicredibility";

const DanceFilm: React.FC<ProjectProps> = ({ onClose }) => {
	const content = (
		<div>
			a short dance film about what dance means to me. so meta haha. In
			the final stage of editing. Check out the draft <a href="https://youtu.be/LF_A0pFNotU" target="_blank" style={{textDecoration: "underline"}}>here</a>
			<br />
			<br />
			Shoutout to my friends who have helped me so far: Svitlana and
			Shenghan for camera work, Nienu for assisting with choreography,
			Joey for artistic direction and editing feedback, Mandy for cameo role,
      Leo for supporting on shooting day, Ha for the voice over of judgy aunty. And again, Shenghan, for having trust
      and be a safe place for me to share all my ideas with.
		</div>
	);
	return (
		<Projects
			content={content}
			onClose={onClose}
			imagePath="/dance film thumbnails.png"
			projectTitle="Dance film - Spirit"
			time="Ongoing"
			link="https://youtu.be/LF_A0pFNotU"
			role="Choreographer, Editor, Creative Director"
			stack="Adobe Premiere Pro, Adobe After Effects, Adobe Photoshop, Generative AI"
		/>
	);
};

export default DanceFilm;
