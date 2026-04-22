import { CloseButton, Grid, GridItem } from "@chakra-ui/react";
import { Html } from "@react-three/drei";
import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import Toast from "./Toast";

interface ConnectProps {
	onClose?: () => void;
	intro: React.ReactNode;
}
interface FormValues {
	question: string;
	answer: string;
	email: string;
}

const initialFormValues: FormValues = {
	question: "",
	answer: "",
	email: "",
};

const Connect: React.FC<ConnectProps> = ({ onClose, intro }) => {
	const qAPairs: { [key: string]: string } = {
		"Can we collaborate?":
			"Hi, I like that you're working on BlahBluh. I think we might be able to collaborate on XYZ. Let's chat.",
		"Do you want some contract work?":
			"Yes, I have this opportunity for you (dev, dogsit, tutoring)",
		"Can we be friends?":
			"I relate to {} from your website/ writing/ work, and would love to chat",
		"I can marry you for a US visa": "Yes I do",
		"Would you like to go cowork with me on my passion project?":
			"I live in NYC, working on this thing. Let's meet and cowork.",
		"Wanna go explore this new place with me?":
			"Hey, I think you'd like this [cool place]. Wanna hang here?",
		"I want to go to dance class with you": "Hmu!",
		"I want to host an event with you":
			"Hey I have this idea for an event. You interested?",
		"Hey let's practice Muay Thai/ Jiujitsu together":
			"Hi Trang, I'm Dubidu and live in New York City. Let's meet up and drill",
		"Your website seems cool": "Duh",
		"I have a special request": "",
	};
	const [formValues, setFormValues] = useState<FormValues>(initialFormValues);
	const [showToast, setShowToast] = useState(false);

	const handleChange = (e: any) => {
		const { name, value } = e.target;
		setFormValues({ ...formValues, [name]: value });
	};

	useEffect(() => {
		let timeoutId: any;
		if (showToast) {
			timeoutId = setTimeout(() => {
				setShowToast(false);
			}, 3000);
		}
		return () => clearTimeout(timeoutId);
	}, [showToast]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const res = await fetch("/api/sendEmail", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formValues),
			});
			setShowToast(true);
		} catch (e) {
			console.log(e);
		}
		// Reset form after submission
		setFormValues(initialFormValues);
	};
	const getRandomQuestion = () => {
		const questions = Object.keys(qAPairs);
		const randomQuestion =
			questions[Math.floor(Math.random() * questions.length)];
		return randomQuestion;
	};

	const handleRandomize = () => {
		setFormValues({ ...formValues, question: getRandomQuestion() });
	};
	return (
		<Html
			style={{
				width: "100vw",
				height: "95vh",
				top: "-50vh",
				position: "absolute",
				left: "-50vw",
				overflowY: "auto",
				borderRadius: "30px",
				margin: "10px",
				padding: "50px",
				background: "green",
				backgroundImage: 'url("/starry_background.png")',
			}}
		>
			<CloseButton
				color="white"
				onClick={onClose}
				style={{ position: "fixed" }}
			/>
			<motion.div
				initial={{ opacity: 0, y: 100 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, ease: "easeIn" }}
			>
				<Grid
					templateColumns="repeat(5, 1fr)"
					gap={40}
					textColor={"white"}
					margin={40}
					marginTop={-16}
				>
					<GridItem w="100%" />
					<GridItem w="100%" colSpan={3}>
						<div style={{ color: "white", padding: "20px" }}>
							<div style={{ fontSize: "18px", marginTop: 20 }}>
								{intro}
							</div>
							<div>
								<form
									onSubmit={handleSubmit}
									style={{
										margin: "20px",
										display: "flex",
										width: "100%",
										flexDirection: "column",
										gap: "20px",
									}}
								>
									<div className="question">
										<label htmlFor="question">
											* Select a question:
										</label>
										<div
											style={{
												display: "flex",
												flexDirection: "row",
											}}
										>
											<select
												id="question"
												name="question"
												value={formValues.question}
												onChange={handleChange}
												style={{
													color: "black",
													borderRadius: "5px",
													width: "500px",
												}}
												required={true}
											>
												<option value="">
													Select a question
												</option>
												{Object.keys(qAPairs).map(
													(q, index) => (
														<option
															key={index}
															value={q}
														>
															{q}
														</option>
													)
												)}
											</select>
											<button
												type="button"
												onClick={handleRandomize}
												style={{
													marginLeft: "12px",
													borderRadius: "5px",
													display: "flex",
													flexDirection: "row",
												}}
											>
												<img
													src="/icons/randomize.svg"
													width={25}
													style={{
														backgroundColor:
															"orange",
														borderRadius: "5px",
														padding: "5px",
													}}
												/>
											</button>
										</div>
									</div>
									<div className="answer">
										<label htmlFor="answer">
											* Answer:
										</label>
										<div>
											<textarea
												rows={4}
												cols={50}
												id="answer"
												name="answer"
												value={formValues.answer}
												onChange={handleChange}
												placeholder={
													qAPairs[formValues.question]
												}
												required={true}
												style={{
													color: "black",
													height: "100px",
													width: "500px",
													borderRadius: "5px",
													padding: "10px",
												}}
											></textarea>
										</div>
									</div>
									<div className="email">
										<label htmlFor="email">
											{" "}
											* Your email:
										</label>
										<div>
											<input
												type="email"
												id="email"
												name="email"
												value={formValues.email}
												onChange={handleChange}
												placeholder=""
												required={true}
												style={{
													color: "black",
													borderRadius: "5px",
													width: "500px",
													padding: "10px",
												}}
											/>
										</div>
									</div>
									<button
										type="submit"
										style={{
											backgroundColor: "white",
											color: "black",
											borderRadius: "20px",
											padding: "10px",
											width: "100px",
										}}
									>
										Submit
									</button>
								</form>
								{showToast && <Toast />}
								<div style={{ margin: "50px 20px" }}>
									<p>
										You can also <br />{" "}
										<ul style={{ listStyle: "inherit" }}>
											<li>
												shoot me an email at
												<span
													style={{
														fontFamily: "courier",
													}}
												>
													{" "}
													doanthithuytrang982@gmail.com{" "}
												</span>{" "}
											</li>
											<li>
												check out my{" "}
												<u>
													<a
														href="https://www.linkedin.com/in/trang-doan-m23/"
														target="_blank"
													>
														LinkedIn,
													</a>
												</u>{" "}
												<u>
													<a
														href="https://www.instagram.com/gnartnaod89/"
														target="_blank"
													>
														Instagram
													</a>
												</u>
												, or{" "}
												<u>
													<a
														href="https://github.com/trangdoan982"
														target="_blank"
													>
														{" "}
														Github{" "}
													</a>
												</u>
											</li>

											<li>
												{" "}
												follow my{" "}
												<a
													href="https://trangdoan.substack.com/"
													target="_blank"
													style={{
														textDecoration: "underline",
													}}
												>
													Substack
												</a>
												<iframe
													src="https://trangdoan.substack.com/embed"
													width="550"
													height="200"
													style={{
														border: "1px solid #EEE",
														background: "white",
													}}
												></iframe>
											</li>
										</ul>
									</p>
								</div>
							</div>
						</div>
					</GridItem>
					<GridItem w="100%" />
				</Grid>
			</motion.div>
		</Html>
	);
};

export default Connect;
