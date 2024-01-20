import { Box, Typography, IconButton, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import ThumbUpIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownIcon from "@mui/icons-material/ThumbDownOutlined";
import ReplayIcon from "@mui/icons-material/Replay";
import { Image } from "components";
import { Lightbox } from "../../lightbox";
import { useFormContext } from "react-hook-form";
import CircularProgress from "@mui/material/CircularProgress";

type FeedbackStepProps = {
	setRecaptureImage: (value: boolean) => void;
	handleNextStep: () => void;
	handlePreviousStep: () => void;
};

export default function FeedbackStep({ setRecaptureImage, handleNextStep, handlePreviousStep }: FeedbackStepProps) {
	const {
		reset,
		control,
		watch,
		setValue,
		handleSubmit,
		formState: { isSubmitting },
	} = useFormContext();
	const feedbackImage = watch("image");
	const feedbackElement = watch("element");

	const [lightboxOpen, setLightboxOpen] = useState(false);

	const openLightbox = () => {
		setLightboxOpen(true);
	};

	const closeLightbox = () => {
		setLightboxOpen(false);
	};

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setLoading(false);
		}, 500);

		return () => clearTimeout(timer);
	}, []);

	return (
		<Box sx={{ pt: 1.5, display: "flex", flexDirection: "column", alignItems: "center" }}>
			<Typography variant="subtitle1">{`You select a ${feedbackElement} to give feedback`}</Typography>
			{lightboxOpen && (
				<Lightbox
					slides={feedbackImage ? [{ src: feedbackImage, alt: "Screenshot" }] : []}
					index={0}
					close={closeLightbox}
					open={lightboxOpen}
				/>
			)}
			<Stack direction={"row"} spacing={2} alignItems={"center"}>
				{loading ? (
					<Box
						sx={{
							display: "flex",
							width: 150,
							height: 150,
							alignItems: "center", // vertically align in the middle
							justifyContent: "center", // horizontally align in the middle
						}}
					>
						<CircularProgress />
					</Box>
				) : (
					<Image
						sx={{ width: 150, height: 150, objectFit: "contain", cursor: "pointer" }}
						src={feedbackImage}
						onClick={openLightbox}
					/>
				)}
				<IconButton
					onClick={() => {
						handlePreviousStep();
						setRecaptureImage(true);
					}}
					aria-label="capture-component"
					sx={{ width: 40, height: 40 }}
				>
					<ReplayIcon />
				</IconButton>
			</Stack>
			<Typography variant="subtitle1">{"What is your feedback"}</Typography>
			<Stack spacing={2} direction="row" sx={{ alignItems: "center", justifyContent: "space-around", width: "100%" }}>
				<IconButton
					onClick={() => {
						setValue("type", "positive");
						handleNextStep();
					}}
					aria-label="capture-component"
				>
					<ThumbUpIcon />
				</IconButton>
				<IconButton
					onClick={() => {
						setValue("type", "negative");
						handleNextStep();
					}}
					aria-label="capture-page"
				>
					<ThumbDownIcon />
				</IconButton>
			</Stack>
		</Box>
	);
}
