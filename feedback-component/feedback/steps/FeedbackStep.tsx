import { Box, Typography, IconButton, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import ThumbUpIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownIcon from "@mui/icons-material/ThumbDownOutlined";
import ReplayIcon from "@mui/icons-material/Replay";
import { Image } from "components";
import { Lightbox } from "../../lightbox";
import { useFormContext } from "react-hook-form";
import CircularProgress from "@mui/material/CircularProgress";

// Define types for the FeedbackStepProps
type FeedbackStepProps = {
  setRecaptureImage: (value: boolean) => void;
  handleNextStep: () => void;
  handlePreviousStep: () => void;
};

/**
 * FeedbackStep component for capturing and providing feedback on selected elements.
 * @param {FeedbackStepProps} props - Component props for FeedbackStep.
 */
export default function FeedbackStep({
  setRecaptureImage,
  handleNextStep,
  handlePreviousStep,
}: FeedbackStepProps) {
  // React Hook Form context
  const {
    reset,
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = useFormContext();

  // Watch for changes in the "image" and "element" fields
  const feedbackImage = watch("image");
  const feedbackElement = watch("element");

  // State to manage the visibility of the lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Function to open the lightbox
  const openLightbox = () => {
    setLightboxOpen(true);
  };

  // Function to close the lightbox
  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  // State to manage the loading status
  const [loading, setLoading] = useState(true);

  // useEffect to simulate loading and set the loading state to false after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Box
      sx={{
        pt: 1.5,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="subtitle1">{`You selected a ${feedbackElement} to give feedback`}</Typography>
      {lightboxOpen && (
        <Lightbox
          slides={
            feedbackImage ? [{ src: feedbackImage, alt: "Screenshot" }] : []
          }
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
            sx={{
              width: 150,
              height: 150,
              objectFit: "contain",
              cursor: "pointer",
            }}
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
      <Stack
        spacing={2}
        direction="row"
        sx={{
          alignItems: "center",
          justifyContent: "space-around",
          width: "100%",
        }}
      >
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
