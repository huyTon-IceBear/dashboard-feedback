import { useRef, useState, useCallback, useMemo } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  IconButton,
  Stack,
  Box,
} from "@mui/material";
import { PlayArrow } from "@mui/icons-material";
import Lightbox from "yet-another-react-lightbox";
import Video from "yet-another-react-lightbox/plugins/video";
import PreviewIcon from "@mui/icons-material/Preview";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import { useFormContext } from "react-hook-form";

// Define types for the ScreenRecorder component
type ScreenRecorderProps = {
  inspecting: boolean;
  setInspecting: (value: boolean) => void;
};

type Slide = {
  type: "video";
  width: number;
  height: number;
  sources: {
    src: string;
    type: string;
  }[];
};

/**
 * ScreenRecorder component for recording and managing screen recordings.
 * @param {ScreenRecorderProps} props - Component props for ScreenRecorder.
 */
export default function ScreenRecorder({
  inspecting,
  setInspecting,
}: ScreenRecorderProps) {
  // Ref for MediaRecorder instance
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  // State for recordings and count
  const [recordings, setRecordings] = useState<Slide[]>([]);
  const [recordingCount, setRecordingCount] = useState(0);

  // State for lightbox
  const [open, setOpen] = useState(false);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number>(0);

  // React Hook Form context
  const {
    reset,
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = useFormContext();

  // Watch for changes in "videos" field
  const feedbackVideos = watch("videos");

  // Start recording function
  const startRecording = () => {
    // Limit the user to record a maximum of 3 files
    if (recordingCount >= 3) return;

    // Set inspecting state
    setInspecting(true);

    // Request permission to record the screen
    navigator.mediaDevices
      .getDisplayMedia({ video: true, audio: true })
      .then((stream) => {
        // Create a MediaRecorder instance
        const mediaRecorder = new MediaRecorder(stream);

        // Event handler when a data chunk is available
        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            setRecordingCount((prevCount) => prevCount + 1);

            // Update recordings state
            setRecordings((prevRecordings) => [
              ...prevRecordings,
              {
                type: "video",
                width: 1280,
                height: 1080,
                sources: [
                  {
                    src: URL.createObjectURL(e.data),
                    type: "video/mp4",
                  },
                ],
              },
            ]);

            // Convert blob to video type
            const now = new Date();
            const timestamp = `${now.getFullYear()}_${
              now.getMonth() + 1
            }_${now.getDate()}_${now.getHours()}_${now.getMinutes()}_${now.getSeconds()}_${now.getMilliseconds()}`;
            const filename = `video_${timestamp}.mp4`;
            const file = new File([e.data], filename, { type: "video/mp4" });

            // Update "videos" field in the form
            setValue("videos", [...feedbackVideos, file]);
          }
        };

        // Event handler when recording stops
        mediaRecorder.onstop = () => {
          // Stop all tracks and reset inspecting state
          for (const track of stream.getTracks()) track.stop();
          setInspecting(false);
        };

        // Set the mediaRecorderRef with the created instance
        mediaRecorderRef.current = mediaRecorder;

        // Start recording
        mediaRecorder.start();

        // Stop recording after 30 seconds
        setTimeout(() => {
          mediaRecorder.stop();
        }, 30000);
      })
      .catch((error) => {
        console.error("Error accessing screen:", error);
      });
  };

  // Callback for deleting a recording
  const handleDelete = useCallback(
    (recording: Slide) => {
      setRecordings(recordings.filter((record) => record !== recording));
      setRecordingCount((prevCount) => prevCount - 1);
    },
    [recordings]
  );

  // Callback for previewing a recording
  const handlePreview = useCallback((index: number) => {
    setSelectedVideoIndex(index);
    setOpen(true);
  }, []);

  // Memoized recording list for performance optimization
  const recordingList = useMemo(() => {
    return recordings.map((recording, index) => (
      <ListItem key={index}>
        <ListItemText primary={`Recording ${index + 1}`} />
        <IconButton onClick={() => handlePreview(index)} aria-label="see-video">
          <PreviewIcon />
        </IconButton>
        <IconButton
          href={recording.sources[0].src}
          download={`recording_${index}.webm`}
          aria-label="download-video"
        >
          <DownloadIcon />
        </IconButton>
        <IconButton
          onClick={() => handleDelete(recording)}
          aria-label="delete-video"
        >
          <DeleteIcon />
        </IconButton>
      </ListItem>
    ));
  }, [recordings, handleDelete, handlePreview]);

  return (
    <>
      {/* Lightbox for displaying video previews */}
      <Lightbox
        index={selectedVideoIndex > 0 ? selectedVideoIndex : 0}
        open={open}
        close={() => setOpen(false)}
        slides={recordings}
        plugins={[Video]}
      />

      {/* Main screen recorder UI */}
      <Stack
        pt={2}
        direction="row"
        sx={{
          alignItems: "center",
          justifyContent: "space-around",
          width: "100%",
        }}
      >
        {/* Start Recording Button */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "30%",
          }}
        >
          <IconButton
            onClick={startRecording}
            disabled={inspecting}
            color="primary"
            aria-label="Start Recording"
          >
            <PlayArrow />
          </IconButton>
          <Typography component="span">{"Screen Record"}</Typography>
        </Box>

        {/* List of Recordings */}
        <Box
          p={2}
          sx={{
            display: "flex",
            flexDirection: "column",
            border: "2px dashed #ff69b4",
            height: 150,
            width: "70%",
          }}
        >
          <Typography variant="subtitle1">{`File(s): ${recordingCount} (Max 3)`}</Typography>
          <List>{recordingList}</List>
        </Box>
      </Stack>
    </>
  );
}
