import { Box, Typography, IconButton, Stack, TextField, Button } from "@mui/material";
import React, { useState } from "react";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOutlinedIcon from "@mui/icons-material/ThumbDownOutlined";
import ScreenRecorder from "../ScreenRecorder";
import { useFormContext } from "react-hook-form";
import { RHFTextField } from "../../hook-form";

type ProvideDetailStepProps = {
	inspecting: boolean;
	setInspecting: (value: boolean) => void;
};

export default function ProvideDetailStep({ inspecting, setInspecting }: ProvideDetailStepProps) {
	const {
		reset,
		control,
		watch,
		setValue,
		handleSubmit,
		formState: { isSubmitting },
	} = useFormContext();

	const feedbackType = watch("type");
	const feedbackIssue = watch("issue");

	const handlePositiveFeedback = () => {
		setValue("type", "positive");
	};

	const handleNegativeFeedback = () => {
		setValue("type", "negative");
	};

	const positiveFeedbackDetail = () => (
		<>
			<Stack pt={2} direction="row" sx={{ alignItems: "center", justifyContent: "space-around", width: "100%" }}>
				<IconButton onClick={handlePositiveFeedback} aria-label="capture-component">
					<ThumbUpIcon />
				</IconButton>
				<IconButton onClick={handleNegativeFeedback} aria-label="capture-page">
					<ThumbDownOutlinedIcon />
				</IconButton>
			</Stack>
			<>
				<Typography variant="subtitle1">{"Can you write more about your feedback?"}</Typography>
				<RHFTextField
					name={"description"}
					multiline
					maxRows={3}
					placeholder="Provide reason you report this feedback.…"
					fullWidth
				/>
			</>
		</>
	);

	const negativeFeedbackDetail = () => (
		<>
			<Stack pt={2} direction="row" sx={{ alignItems: "center", justifyContent: "space-around", width: "100%" }}>
				<IconButton onClick={handlePositiveFeedback} aria-label="capture-component">
					<ThumbUpOutlinedIcon />
				</IconButton>
				<IconButton onClick={handleNegativeFeedback} aria-label="capture-page">
					<ThumbDownIcon />
				</IconButton>
			</Stack>
			<>
				<Typography variant="subtitle1">{"Action need to act on feedback"}</Typography>
				<Stack pt={2} direction="row" sx={{ alignItems: "center", justifyContent: "space-around", width: "100%" }}>
					<Button
						variant={feedbackIssue === "Fix bug" ? "contained" : "outlined"}
						onClick={() => {
							setValue("issue", "Fix bug");
						}}
					>
						{"Fix bug"}
					</Button>
					<Button
						variant={feedbackIssue === "RFC" ? "contained" : "outlined"}
						onClick={() => {
							setValue("issue", "RFC");
						}}
					>
						{"Change request"}
					</Button>
				</Stack>
				<Stack sx={{ alignItems: "center", justifyContent: "space-around", width: "100%" }}>
					<Typography variant="subtitle1">{"Provide detail information about your feedback"}</Typography>
					<Typography variant="caption" color="textSecondary">
						{"Tips: You need to include more than 1 video"}
					</Typography>
					<Typography variant="caption" color="textSecondary">
						{"Video automatically stop at 30 seconds"}
					</Typography>
				</Stack>
				<ScreenRecorder inspecting={inspecting} setInspecting={setInspecting} />
			</>
		</>
	);

	return (
		<Box sx={{ pt: 1.5, display: "flex", flexDirection: "column", alignItems: "center" }}>
			<Typography variant="subtitle1">{"What is your feedback"}</Typography>
			{feedbackType === "positive" ? (
				<Stack>{positiveFeedbackDetail()}</Stack>
			) : (
				<Stack>{negativeFeedbackDetail()}</Stack>
			)}
		</Box>
	);
}
