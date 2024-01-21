import React, { useEffect, useState } from "react";
import ElementHighlighter from "./ElementHighlighter";
import html2canvas from "html2canvas";
import { Box, Stack, Paper, ButtonBase } from "@mui/material";
import WebIcon from "@mui/icons-material/Web";
import WidgetsIcon from "@mui/icons-material/Widgets";
import { Controller, useFormContext } from "react-hook-form";

// Define types for the ElementSelector component
type SelectorProps = {
  activeStep: number;
  inspecting: boolean;
  setInspecting: (value: boolean) => void;
  handleNextStep: () => void;
  recaptureImage: boolean;
  setRecaptureImage: (value: boolean) => void;
};

/**
 * ElementSelector component for capturing and selecting elements.
 * @param {SelectorProps} props - Component props for ElementSelector.
 */
export default function ElementSelector({
  activeStep,
  inspecting,
  setInspecting,
  handleNextStep,
  recaptureImage,
  setRecaptureImage,
}: SelectorProps) {
  // React Hook Form context
  const {
    reset,
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = useFormContext();

  // Watch for changes in the "element" field
  const feedbackElement = watch("element");

  // Start inspecting function
  const startInspecting = () => {
    setInspecting(true);
    document.body.style.cursor = "pointer";
  };

  // Stop inspecting function
  const stopInspecting = () => {
    setInspecting(false);
    document.body.style.cursor = "default"; // Restore the default cursor style
  };

  // Handle click on an element function
  const handleElementClick = (dataUrl: string) => {
    stopInspecting();
    setValue("image", dataUrl);
    handleNextStep();
  };

  // Capture the entire page function
  const capturePage = () => {
    setInspecting(true);
    setTimeout(() => {
      html2canvas(document.documentElement, {
        width: window.innerWidth,
        height: window.innerHeight,
      }).then((canvas) => {
        const dataUrl = canvas.toDataURL();
        setValue("image", dataUrl);
        setInspecting(false);
      });
    }, 500);
    if (activeStep === 0) {
      handleNextStep();
    }
  };

  // useEffect to handle recapturing image
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

  return (
    <Stack spacing={2} mt={3}>
      {/* Element selection buttons */}
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

      {/* ElementHighlighter component for visually highlighting selected elements */}
      <ElementHighlighter
        inspecting={inspecting}
        onElementClick={handleElementClick}
      />
    </Stack>
  );
}
