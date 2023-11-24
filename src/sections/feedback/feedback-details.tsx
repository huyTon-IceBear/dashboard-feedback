import { useState, useCallback, useEffect } from 'react';
import { Slide, SlideImage } from 'yet-another-react-lightbox';
// @mui
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import Stack, { StackProps } from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import Label from 'src/components/label';
import Box from '@mui/material/Box';
// utils
import { fDate } from 'src/utils/format-time';
// types
import { Feedback } from 'src/types/feedback';
// components
import Iconify from 'src/components/iconify';
import Image from 'src/components/image';
import Lightbox, { useLightBox } from 'src/components/lightbox';

// ----------------------------------------------------------------------

type Props = {
  feedback: Feedback;
};

export default function FeedbackDetails({ feedback }: Props) {
  const { type, element, description, created_at, created_by, issue, imageUrl, videosUrl } =
    feedback;
  const [videoSrcs, setVideoSrcs] = useState<string[]>(['']);
  const [imageSrc, setImageSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  const getPresignedUrl = async (fileName: string) => {
    const response = await fetch('/api/aws-s3', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file_name: fileName }),
    });
    return response.json();
  };

  const getIssues = async () => {
    const response = await fetch('/api/linear', {
      method: 'GET',
    });
    return response.json();
  };

  useEffect(() => {
    getPresignedUrl(imageUrl).then((response) => {
      setImageSrc(response.url);
    });
    Promise.all(videosUrl.map((videoUrl) => getPresignedUrl(videoUrl)))
      .then((responses) => {
        setVideoSrcs(responses.map((response) => response.url));
      })
      .then(() => {
        setIsLoading(false);
      });

    getIssues().then((response) => {
      console.log(response);
    });
  }, [imageUrl, videosUrl]);

  const renderMediaFile = (
    <Stack spacing={2}>
      <Typography variant="h6">Evidences</Typography>
      <Stack>
        <Typography variant="h6">Images</Typography>
        <Box sx={{ p: 1 }}>
          <Image
            alt={'feedback_screenshot'}
            src={imageSrc} // use imageSrc here
            sx={{ borderRadius: 1.5 }}
          />
        </Box>
      </Stack>
      <Stack>
        <Typography variant="h6">Videos</Typography>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            {videoSrcs.map((videoSrc, index) => (
              <video key={index} controls>
                <source src={videoSrc} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ))}
            {videoSrcs.length === 0 && (
              <Typography variant="body2">No Screen Recordings</Typography>
            )}
          </>
        )}
      </Stack>
    </Stack>
  );

  const renderContent = (
    <Stack component={Card} spacing={3} sx={{ p: 3 }}>
      <Typography variant="h4">Feedback Details</Typography>
      <Stack spacing={2}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Block label="Type:" sx={{ pr: 3 }}>
            <Label
              variant="soft"
              color={
                (type === 'positive' && 'success') || (type === 'negative' && 'error') || 'default'
              }
            >
              {type}
            </Label>
          </Block>
          <Block label="Element:" sx={{ pr: 3 }}>
            <Label variant="soft">{element}</Label>
          </Block>
          <Block label="Issue:">
            <Label variant="soft">{issue}</Label>
          </Block>
        </Stack>
      </Stack>

      <Stack spacing={2}>
        <Typography variant="h6">Description</Typography>
        <Typography variant="body2">{description}</Typography>
      </Stack>
      {renderMediaFile}
    </Stack>
  );

  const renderOverview = (
    <Stack component={Card} spacing={2} sx={{ p: 3 }}>
      {[
        {
          label: 'User',
          value: created_by,
          icon: <Iconify icon="solar:user-circle-bold" />,
        },
        {
          label: 'Created date',
          value: fDate(created_at),
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
      ].map((item) => (
        <Stack key={item.label} spacing={1.5} direction="row">
          {item.icon}
          <ListItemText
            primary={item.label}
            secondary={item.value}
            primaryTypographyProps={{
              typography: 'body2',
              color: 'text.secondary',
              mb: 0.5,
            }}
            secondaryTypographyProps={{
              typography: 'subtitle2',
              color: 'text.primary',
              component: 'span',
            }}
          />
        </Stack>
      ))}
    </Stack>
  );

  return (
    <Grid container spacing={3}>
      {/* <Lightbox
        index={lightbox.selected}
        slides={slides}
        open={lightbox.open}
        close={lightbox.onClose}
      /> */}

      <Grid xs={12} md={8}>
        {renderContent}
      </Grid>

      <Grid xs={12} md={4}>
        {renderOverview}
      </Grid>
    </Grid>
  );
}
// ----------------------------------------------------------------------

type BlockProps = StackProps & {
  label: string;
};

function Block({ label, children, sx, ...other }: BlockProps) {
  return (
    <Stack
      component={Paper}
      spacing={1}
      direction="row"
      sx={{
        overflow: 'hidden',
        ...sx,
      }}
      {...other}
    >
      <Box component="span" sx={{ typography: 'subtitle2' }}>
        {label}
      </Box>

      <Stack spacing={1} direction="row" flexWrap="wrap">
        {children}
      </Stack>
    </Stack>
  );
}
