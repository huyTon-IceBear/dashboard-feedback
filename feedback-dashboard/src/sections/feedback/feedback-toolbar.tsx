import { useCallback } from 'react';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
// @mui
import Box from '@mui/material/Box';
import Stack, { StackProps } from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';
import LoadingButton from '@mui/lab/LoadingButton';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// types

// components
import Iconify from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';
// ----------------------------------------------------------------------

type Props = StackProps & {
  backLink: string;
  feedbackIssue: string;
  feedbackId: string;
  issues: string[];
};

export default function FeedbackToolbar({
  backLink,
  feedbackIssue,
  feedbackId,
  issues,
  sx,
  ...other
}: Props) {
  const router = useRouter();
  console.log(issues);
  const handleCreateTask = useCallback(() => {
    const createTaskPath =
      feedbackIssue?.toLocaleLowerCase() === issues[0]?.toLocaleLowerCase()
        ? paths.dashboard.task.new.rfc
        : paths.dashboard.task.new.bugfix;
    router.push(`${createTaskPath}?feedbackId=${feedbackId}`);
  }, [router]);

  return (
    <>
      <Stack
        spacing={1.5}
        direction="row"
        sx={{
          mb: { xs: 3, md: 5 },
          ...sx,
        }}
        {...other}
      >
        <Button
          component={RouterLink}
          href={backLink}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
        >
          Back
        </Button>

        <Box sx={{ flexGrow: 1 }} />

        <Button
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleCreateTask}
        >
          Create Linear Task
        </Button>
      </Stack>
    </>
  );
}
