import { Box, IconButton, Typography, Stack, Paper, ButtonBase } from "@mui/material";
import ElementSelector from "../ElementSelector";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import WebIcon from "@mui/icons-material/Web";
import WidgetsIcon from "@mui/icons-material/Widgets";
import ElementHighlighter from "../ElementHighlighter";
import html2canvas from "html2canvas";

type ChooseItemStepProps = {
	activeStep: number;
	inspecting: boolean;
	setInspecting: (value: boolean) => void;
	handleNextStep: () => void;
	recaptureImage: boolean;
	setRecaptureImage: (value: boolean) => void;
};

export default function ChooseItemStep({
	activeStep,
	inspecting,
	setInspecting,
	handleNextStep,
	recaptureImage,
	setRecaptureImage,
}: ChooseItemStepProps) {
	const {
		reset,
		control,
		watch,
		setValue,
		handleSubmit,
		formState: { isSubmitting },
	} = useFormContext();

	const feedbackElement = watch("element");

	const startInspecting = () => {
		setInspecting(true);
		document.body.style.cursor = "pointer";
	};

	const stopInspecting = () => {
		setInspecting(false);
		document.body.style.cursor = "default"; // Restore the default cursor style
	};

	const handleElementClick = (dataUrl: string) => {
		stopInspecting();
		setValue("image", dataUrl);
		handleNextStep();
	};

	const capturePage = () => {
		setInspecting(true);
		setTimeout(() => {
			html2canvas(document.documentElement).then((canvas) => {
				const dataUrl = canvas.toDataURL();
				setValue("image", dataUrl);
				setInspecting(false);
			});
		}, 500);
		if (activeStep === 0) {
			console.log("activeStep", activeStep);
			handleNextStep();
		}
	};

	useEffect(() => {
		if (recaptureImage) {
			if (feedbackElement === "Page") {
				capturePage();
			} else {
				startInspecting();
			}
			setRecaptureImage(false);
		}
	}, [recaptureImage]);

	const ElementSelector = () => (
		<Stack spacing={2} mt={3}>
			<Controller
				name="element"
				control={control}
				render={({ field }) => (
					<Box gap={5} display="grid" gridTemplateColumns="repeat(2, 1fr)">
						{[
							{
								label: "Component",
								icon: <WidgetsIcon sx={{ width: 40, mb: 2 }} />,
								onClick: startInspecting,
								ariaLabel: "capture-component",
							},
							{
								label: "Page",
								icon: <WebIcon sx={{ width: 40, mb: 2 }} />,
								onClick: capturePage,
								ariaLabel: "capture-page",
							},
						].map((item) => (
							<Paper
								component={ButtonBase}
								variant="outlined"
								key={item.label}
								onClick={() => {
									item.onClick();
									field.onChange(item.label);
								}}
								aria-label={item.ariaLabel}
								sx={{
									p: 2.5,
									borderRadius: 1,
									typography: "subtitle2",
									flexDirection: "column",
									...(item.label === field.value && {
										borderWidth: 2,
										borderColor: "text.primary",
									}),
								}}
							>
								{item.icon} {item.label}
							</Paper>
						))}
					</Box>
				)}
			/>

			<ElementHighlighter inspecting={inspecting} onElementClick={handleElementClick} />
		</Stack>
	);

	return (
		<Box sx={{ pt: 1.5, display: "flex", flexDirection: "column", alignItems: "center" }}>
			<Typography variant="subtitle1">{"Choose an item you want to give feedback"}</Typography>
			<Typography variant="caption" color="textSecondary">
				{"Tips: You can choose an item on page or the whole page"}
			</Typography>
			<ElementSelector />
		</Box>
	);
}
