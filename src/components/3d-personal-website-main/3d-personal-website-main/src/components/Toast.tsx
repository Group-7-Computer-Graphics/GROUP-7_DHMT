import React from "react";
import { CheckIcon, WarningTwoIcon } from "@chakra-ui/icons";

const Toast = () => {
	return (
		<div
			style={{
				borderRadius: "5px",
				backgroundColor: "green",
				padding: "10px",
				display: "inline",
			}}
		>
			<CheckIcon /> You've successfully made first contact!
		</div>
	);
};

export default Toast;
