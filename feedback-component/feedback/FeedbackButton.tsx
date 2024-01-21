import React, { useState, useEffect, useRef } from "react";
import Fab from "@mui/material/Fab";
import Popper from "@mui/material/Popper";
import Paper from "@mui/material/Paper";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import FeedbackIcon from "@mui/icons-material/Feedback";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Stack,
  Grow,
  IconButton,
  Button,
} from "@mui/material";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { ChooseItemStep, FeedbackStep, ProvideDetailStep } from "./steps";
import CloseIcon from "@mui/icons-material/Close";
import { object, string, array, mixed } from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider } from "../hook-form";
import { useTheme } from "@mui/material/styles";
import LoadingButton from "@mui/lab/LoadingButton";
import { gql, ApolloClient, InMemoryCache } from "@apollo/client";

// Define the steps for the feedback form
const steps = ["Choose Item", "Feedback", "Provide Detail"];

// Define the GraphQL mutation for creating feedback
const CREATE_FEEDBACK = gql`
  mutation CREATE_FEEDBACK($object: feedback_insert_input!) {
    insert_feedback_one(object: $object) {
      id
      created_at
    }
  }
`;

// Define the shape of the Feedback object
type Feedback = {
  type: string;
  element: string;
  description: string;
  imageUrl: string | null;
  videosUrl: (string | null)[];
  issue: string;
};

/**
 * FeedbackButton component for displaying a feedback button and form.
 */
export default function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [inspecting, setInspecting] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [recaptureImage, setRecaptureImage] = useState<boolean>(false);
  const theme = useTheme();

  // Define the Yup schema for form validation
  const FeedbackSchema = object().shape({
    type: string().required("This field is required"),
    element: string().required("This field is required"),
    description: string(),
    issue: string().required("This field is required"),
    image: string().required("This field is required"),
    videos: array().of(mixed()),
  });

  // Initialize react-hook-form
  const methods = useForm({
    resolver: yupResolver(FeedbackSchema),
    defaultValues: {
      type: "",
      element: "",
      description: "",
      issue: "",
      image: "",
      videos: [],
    },
  });

  const {
    reset,
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isDirty, isValid },
  } = methods;

  // Function to get a presigned URL for file upload
  const getPresignedUrl = async (fileType: string, fileName: string) => {
    const response = await fetch("/api/feedback/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ file_type: fileType, file_name: fileName }),
    });
    const { url } = await response.json();
    return url;
  };

  // Function to upload a file to S3
  const uploadFileToS3 = async (url: string, file: File, fileType: string) => {
    const response = await fetch(url, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": fileType },
    });
    return response.ok;
  };

  // Function to get the public URL of a file
  const getFileUrl = (fileName: string) => {
    return `https://s3.eu-central-1.amazonaws.com/opusflow-monitoring/monitoring/medias/${fileName}`;
  };

  // Function to upload a file (image or video)
  const uploadFile = async (file: File, fileType: string, fileName: string) => {
    const presignedUrl = await getPresignedUrl(fileType, fileName);
    const uploadSuccessful = await uploadFileToS3(presignedUrl, file, fileType);

    if (uploadSuccessful) {
      console.log(`${fileType} uploaded successfully`);
      return getFileUrl(fileName);
    } else {
      console.log(`${fileType} upload failed`);
      return null;
    }
  };

  // Function to create an image file
  const createImageFile = async (image: string) => {
    const blob = await (await fetch(image)).blob();
    const now = new Date();
    const timestamp = `${now.getFullYear()}_${
      now.getMonth() + 1
    }_${now.getDate()}_${now.getHours()}_${now.getMinutes()}_${now.getSeconds()}_${now.getMilliseconds()}`;
    const fileName = `screenshot_${timestamp}.png`;
    const imageFile = new File([blob], fileName, { type: "image/png" });

    return { imageFile, fileName };
  };

  // Create Apollo Client instance
  const client = new ApolloClient({
    uri: process.env.NEXT_PUBLIC_HASURA_URL,
    headers: {
      "content-type": "application/json",
      "x-hasura-admin-secret": process.env
        .NEXT_PUBLIC_MONITORING_HASURA_ADMIN_SECRET as string,
    },
    cache: new InMemoryCache(),
  });

  // Function to create feedback using GraphQL mutation
  const createFeedback = (data: Feedback) =>
    client.mutate({
      mutation: CREATE_FEEDBACK,
      variables: {
        object: data,
      },
    });

  // Handle form submission
  const onSubmit = handleSubmit(async (data) => {
    try {
      const { type, element, description, issue, image, videos } = data;

      const { imageFile, fileName } = await createImageFile(image);

      const imageUrl = await uploadFile(imageFile, "image/png", fileName);

      const videosUrl = await Promise.all(
        videos.map(async (video: File) => {
          return uploadFile(video, "video/mp4", video.name);
        })
      );

      const submitData = {
        type,
        element,
        description,
        issue,
        imageUrl,
        videosUrl,
      };

      createFeedback(submitData);
    } catch (error) {
      console.error(error);
    }
  });

  // Handle click on the feedback button
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    setOpen((previousOpen) => !previousOpen);
  };

  // Handle click away from the feedback form
  const handleClickAway = () => {
    if (!inspecting) {
      setAnchorEl(null);
      setOpen(false);
    }
  };

  // Handle moving to the next step in the form
  const handleNextStep = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  // Handle moving to the previous step in the form
  const handlePreviousStep = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  // Handle form reset
  const handleReset = () => {
    reset();
    setActiveStep(0);
  };

  // Render the appropriate step component based on the active step
  const renderStepComponent = () => {
    switch (activeStep) {
      case 0:
        return (
          <ChooseItemStep
            activeStep={activeStep}
            inspecting={inspecting}
            setInspecting={setInspecting}
            handleNextStep={handleNextStep}
            recaptureImage={recaptureImage}
            setRecaptureImage={setRecaptureImage}
          />
        );
      case 1:
        return (
          <FeedbackStep
            setRecaptureImage={setRecaptureImage}
            handleNextStep={handleNextStep}
            handlePreviousStep={handlePreviousStep}
          />
        );
      case 2:
        return (
          <ProvideDetailStep
            inspecting={inspecting}
            setInspecting={setInspecting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <FormProvider methods={methods}>
      <Box
        style={{
          position: "fixed",
          bottom: "10px",
          right: "10px",
          zIndex: 9999,
        }}
      >
        <Fab color="primary" onClick={handleClick}>
          <FeedbackIcon />
        </Fab>
        <Popper
          open={open}
          anchorEl={anchorEl}
          placement="top-end"
          disablePortal={false}
          modifiers={[
            {
              name: "flip",
              enabled: true,
              options: {
                flipVariations: true,
              },
            },
            {
              name: "preventOverflow",
              enabled: true,
              options: {
                altAxis: true,
                tether: true,
                padding: 2,
              },
            },
          ]}
          style={{
            visibility: open && inspecting ? "hidden" : "visible",
          }}
          transition
        >
          {({ TransitionProps }) => (
            <Grow {...TransitionProps} timeout={350}>
              <Card>
                <ClickAwayListener onClickAway={handleClickAway}>
                  <>
                    <CardHeader
                      title="Feedback Form"
                      titleTypographyProps={{ style: { color: "white" } }}
                      action={
                        <IconButton onClick={handleClickAway}>
                          <CloseIcon sx={{ color: "white" }} />
                        </IconButton>
                      }
                      sx={{ bgcolor: theme.palette.primary.main }}
                    />
                    <CardContent>
                      <Box
                        sx={{
                          bgcolor: "background.paper",
                          borderRadius: "8px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          width: 400,
                          height: 300,
                          overflow: "scroll",
                          overflowX: "hidden", // Hide vertical scrollbar
                          "&::-webkit-scrollbar": {
                            // Hide scrollbar for Chrome, Safari and Opera
                            display: "none",
                          },
                          msOverflowStyle: "none", // Hide scrollbar for IE and Edge
                          scrollbarWidth: "none", // Hide scrollbar for Firefox
                        }}
                      >
                        <Paper sx={{ width: "100%" }}>
                          <Stepper activeStep={activeStep} alternativeLabel>
                            {steps.map((label) => (
                              <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                              </Step>
                            ))}
                          </Stepper>
                          {renderStepComponent()}
                        </Paper>
                      </Box>
                    </CardContent>
                    <CardActions sx={{ justifyContent: "end" }}>
                      <Stack
                        direction="row"
                        justifyContent="flex-end"
                        spacing={2}
                      >
                        <Button
                          variant={isDirty ? "contained" : "outlined"}
                          disabled={!isDirty}
                          onClick={handleReset}
                        >
                          {"Reset"}
                        </Button>
                        <LoadingButton
                          onClick={onSubmit}
                          variant={isValid ? "contained" : "outlined"}
                          loading={isSubmitting}
                          disabled={!isValid}
                        >
                          {"Submit"}
                        </LoadingButton>
                      </Stack>
                    </CardActions>
                  </>
                </ClickAwayListener>
              </Card>
            </Grow>
          )}
        </Popper>
      </Box>
    </FormProvider>
  );
}
