import Gallery, { GalleryItem } from "../Gallery";

// Sample gallery data
const galleryData: GalleryItem[] = [
	{
		id: 1,
		title: "MY CREATIVE ETHOS",
		imageUrl:
			"https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F957a8f7f-73a0-4395-b6f0-d19da16d8699_2000x2829.jpeg",
		href: "https://trangdoan.substack.com/p/re-manifesto-of-this-blog",
	},
	{
		id: 2,
		title: "THE MOMENT BEFORE MEMORY",
		imageUrl:
			"https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F91116b47-c11c-4cb0-9c30-0d321ce2f670_1200x1600.png",
		href: "https://trangdoan.substack.com/p/the-moment-before-memory",
	},
	{
		id: 3,
		title: "I PUT MY FRIENDS' FINANCIAL STATUS IN A CHART",
		imageUrl:
			"https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fd9373be8-6cbc-46c4-9c44-8d4e56dd9028_1600x1235.png",
		href: "https://trangdoan.substack.com/p/i-put-my-friends-financial-status",
	},
	{
		id: 4,
		title: "FAILURE RESUME",
		imageUrl:
			"https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F0b46d9d0-88c6-4a23-b6ec-1a00574439d8_1280x800.jpeg",
		href: "https://trangdoan.substack.com/p/failure_resumepdf",
	},
	{
		id: 5,
		title: "CAN YOU TRUST WIKIPEDIA?",
		imageUrl: "https://i.imgur.com/9qpPHby.png",
		href: "https://trangdoan.substack.com/p/can-i-trust-wikipedia",
	},
	{
		id: 6,
		title: "TWO WAYS OF KNOWING",
		imageUrl:
			"https://worldofbuzz.com/wp-content/uploads/2017/08/gordon-ramsay-finally-gets-scolded-in-malaysia-world-of-buzz-10.png",
		href: "https://trangdoan982.notion.site/Two-ways-of-knowing-0df201d3462247ca841114a62da4561a",
	},
	{
		id: 7,
		title: "LETTING GO WASN'T WHAT I EXPECTED",
		imageUrl:
			"https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F6c405a22-3b5a-4afa-9551-034413a6aa5a_517x593.gif",
		href: "https://trangdoan.substack.com/p/letting-go-wasnt-what-i-expected",
	},
];

interface WritingProps {
	onClose: () => void;
}
const Writing: React.FC<WritingProps> = ({ onClose }) => {
	const intro = (
		<div style={{ margin: 40 }}>
			{"         "}
			All of my writings could be found on{" "}
			<u>
				{" "}
				<a href="https://trangdoan.substack.com/" target="_blank">
					Substack
				</a>
			</u>
			. Here are some of my favorite.
		</div>
	);
	return (
		<Gallery onClose={onClose} galleryData={galleryData} intro={intro} />
	);
};

export default Writing;
