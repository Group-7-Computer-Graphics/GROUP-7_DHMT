import { Box, Image } from "@chakra-ui/react";
import Projects from "../projects";

export interface ProjectProps {
	onClose: () => void;
}
const Wikicredibility: React.FC<ProjectProps> = ({ onClose }) => {
	const content = (
		<div>
			Wikipedia is always among top 10 most visited websites. Yet, most
			users when reading Wikipedia aren't aware that it is{" "}
			<a
				href="https://trangdoan.substack.com/i/103863645/overview"
				target="_blank"
			>
				<u> extremely biased. </u>
			</a>
			To address this issue, I built an NLP model to detect relative level
			of controversy and source quality of each English Wikipedia entry.{" "}
			<br />
			<br />
			<img src="https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fbe818a9f-adc3-42dc-9bb3-e169e3477bd3_2444x1126.png" />
			<br />
			<br />
			<b>The Talk page model </b> <br />I leveraged fine-tuned BERT model
			to detect tones of a Talk page. The output is one of 11 emotions
			(anger, anticipation, disgust, fear, joy, love, optimism, pessimism,
			sadness, surprise, trust, neutral/no emotion).
			<br />
			<br />
			<img src="https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F27b4d629-c0ef-4f81-ad8f-59f55e6aedf3_2000x1158.png" />
			<br />
			<br />
			<b>Source citation model </b> <br />
			We can evaluate a source based on its relevance, currency, accuracy,
			authority, and purpose. I decided to focus on currency and authority
			because of technical constraints at the time. <br />
			Currency is how recent the source is. A rule of thumb is the more
			recent, the better, because knowledge gets updated over time. <br />
			Authority is whether the author or where it got published has the
			reputation. Eg: You would want to hear health advice from a Harvard
			medical student more than a fashion influencer. <br />
			<br />
			<img src="https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fa2a35d27-fc7e-46f7-b746-8e1b659285cb_2000x1663.png" />
		</div>
	);
	return (
		<Projects
			onClose={onClose}
			imagePath={"https://i.imgur.com/9qpPHby.png"}
			projectTitle="Wikicredibility"
			time="February 2022 - March 2023"
			link="https://huggingface.co/spaces/trangdoan982/wikicredibility"
			role="Fullstack developer"
			stack="Python"
			content={content}
		/>
	);
};

export default Wikicredibility;
