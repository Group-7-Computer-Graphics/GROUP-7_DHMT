import localFont from "next/font/local";
import "tailwindcss/tailwind.css";
import { AppProps } from "next/app";
import { Inter } from "next/font/google";

// Font files can be colocated inside of `pages`
const episcene = localFont({
	src: [
		{
			path: "../public/fonts/test-epicene-display-light.woff2",
			weight: "200",
		},
		{
			path: "../public/fonts/test-epicene-text-regular.woff2",
			weight: "400",
		},
	],
	variable: "--font-episcene",
	adjustFontFallback: "Times New Roman",
});

const futura = localFont({
	src: [
		{
			path: "../public/fonts/futura_bold.ttf",
			weight: "600",
		},
		{
			path: "../public/fonts/futura_bold_condense.ttf",
			weight: "500",
		},
		{
			path: "../public/fonts/futura_heavy.ttf",
			weight: "400",
		},
		{
			path: "../public/fonts/futura_medium.ttf",
			weight: "300",
		},
	],
	variable: "--font-futura",
	// adjustFontFallback: "Arial",
});

const nasalization = localFont({
	src: [
		{
			path: "../public/fonts/nasalization-rg.otf",
			weight: "400",
		},
	],
	variable: "--font-nasa",
});

const wingdings = localFont({
	src: [
		{
			path: "../public/fonts/wingding.ttf",
		},
	],
	variable: "--font-wingding",
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function MyApp({ Component, pageProps }: AppProps) {
	return (
		<main
			className={`${episcene.variable} ${futura.variable} ${nasalization.variable} ${wingdings.variable} ${inter.className}`}
		>
			<Component {...pageProps} />
		</main>
	);
}
