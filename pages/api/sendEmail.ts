const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 465,
	secure: true,
	auth: {
		user: process.env.NODEMAILER_USER,
		pass: process.env.SMTP_PASSWORD,
	},
});

export default async function handler(req: any, res: any) {
	const { question, answer, email } = req.body;
	const info = await transporter.sendMail({
		from: process.env.NODEMAILER_USER,
		to: process.env.RECEIVER_EMAIL,
		subject: `You've got a new reach out from ${email}`,
		text: `${question}: ${answer}`,
		html: `<b> ${question}</b> <br/> ${answer}`,
	});
	if (req.method === "POST") {
		res.status(200).json({
			message: "You've successfully made the first contact",
		});
	} else {
		res.status(405).json({ message: "method not allowed" });
	}
}
