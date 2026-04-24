/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
	theme: {
		extend: {
			fontFamily: {
				sans: ["var(--font-episcene)"],
				nasalization: "var(--font-nasa)",
			},
		},
	},
	plugins: [],
};
