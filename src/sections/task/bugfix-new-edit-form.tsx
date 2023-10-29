import * as Yup from 'yup';
import { useCallback, useMemo, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { paths } from 'src/routes/paths';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// _mock
import {
  TASK_SEVERITY_EFFECT_OPTIONS,
  TASK_MODULES_OPTIONS,
  TASK_PRIORITY_OPTIONS,
  TASK_SEVERITY_OPTIONS,
  _feedbacks,
} from 'src/_mock';
// components
import { useSnackbar } from 'src/components/snackbar';
import { useRouter } from 'src/routes/hooks';
import FormProvider, {
  RHFSelect,
  RHFEditor,
  RHFUpload,
  RHFTextField,
  RHFRadioGroup,
} from 'src/components/hook-form';
import Image from 'src/components/image';
// types
import { TaskBugfix, TaskBugfixData } from 'src/types/task';
import { createIssue } from 'src/api/createTask';
import { FeedbackBugFixType } from 'src/types/feedback';
import { downloadMediaFile } from 'src/api/downloadMedia';

// ----------------------------------------------------------------------

type Props = {
  currentTask?: TaskBugfix;
  feedback?: FeedbackBugFixType;
};

export default function BugfixTaskNewEditForm({ currentTask, feedback }: Props) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const NewTaskSchema = Yup.object().shape({
    reportBy: Yup.string().required('Field is required'),
    dateReported: Yup.mixed<any>().nullable().required('Date reported is required'),
    module: Yup.string().required('Field is required'),
    severity: Yup.string().required('Field is required'),
    severityEffect: Yup.string().required('Field is required'),
    priority: Yup.string().required('Priority is required'),
    stepToProduce: Yup.string().required('Field is required'),
    expectedResult: Yup.string().required('Field is required'),
    actualResult: Yup.string().required('Field is required'),
    // not required
    description: Yup.string(),
    preCondition: Yup.string(),
    additionalInformation: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      reportBy: feedback?.created_by || currentTask?.reportBy || '',
      dateReported: feedback?.created_at || currentTask?.dateReported || '',
      module: currentTask?.module || TASK_MODULES_OPTIONS[0].value,
      severity: currentTask?.severity || TASK_SEVERITY_OPTIONS[0].value,
      severityEffect: currentTask?.severityEffect || TASK_SEVERITY_EFFECT_OPTIONS[0].value,
      priority: currentTask?.severityEffect || TASK_PRIORITY_OPTIONS[0].value,
      stepToProduce: currentTask?.stepToProduce || '',
      expectedResult: currentTask?.expectedResult || '',
      actualResult: currentTask?.actualResult || '',
      //
      description: feedback?.description || currentTask?.description || '',
      preCondition: currentTask?.preCondition || '',
      additionalInformation: currentTask?.additionalInformation || '',
    }),
    [currentTask]
  );

  const methods = useForm({
    resolver: yupResolver(NewTaskSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentTask) {
      reset(defaultValues);
    }
  }, [currentTask, defaultValues, reset]);

  const [videoSrcs, setVideoSrcs] = useState<string[]>(['']);
  const [imageSrc, setImageSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  const getPresignedUrl = async (key: string) => {
    return await downloadMediaFile(`monitoring/medias/${key}`);
  };

  useEffect(() => {
    if (feedback?.imageUrl) {
      getPresignedUrl(feedback.imageUrl).then((response) => {
        const parsedResponse = JSON.parse(response.body);
        setImageSrc(parsedResponse.url);
      });
    }

    if (feedback?.videosUrl) {
      Promise.all(feedback.videosUrl.map((videoUrl) => getPresignedUrl(videoUrl)))
        .then((responses) => {
          const parsedResponses = responses.map((response) => JSON.parse(response.body));
          setVideoSrcs(parsedResponses.map((parsedResponse) => parsedResponse.url));
        })
        .then(() => {
          setIsLoading(false);
        });
    }
  }, [feedback]);

  async function urlToFile(url: string, filename: string): Promise<File> {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  }

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (feedback?.imageUrl && feedback?.videosUrl) {
        const imageResponse = await getPresignedUrl(feedback.imageUrl);
        const imageUrl = JSON.parse(imageResponse.body).url;

        const imageFile = await urlToFile(imageUrl, 'image.png');
        // upload file to your server first
        let imageUploadedUrl;
        try {
          const response = await fetch('/api/uploadLinear', {
            method: 'POST',
            body: imageFile,
          });
          imageUploadedUrl = await response.json();
        } catch (error) {
          console.error('Error uploading file to server:', error);
          return;
        }

        const videoUploadedUrl = await Promise.all(
          videoSrcs.map(async (videoUrl) => {
            const response = await getPresignedUrl(videoUrl);
            const url = JSON.parse(response.body).url;
            const videoFile = await urlToFile(url, 'video.mp4');
            // upload file to your server first
            let videoUploadedUrl;
            try {
              const response = await fetch('/api/uploadLinear', {
                method: 'POST',
                body: videoFile,
              });
              videoUploadedUrl = await response.json();
            } catch (error) {
              console.error('Error uploading file to server:', error);
              return;
            }
            return videoUploadedUrl;
          })
        );

        const { description, priority } = convertDataToMarkdownFormat(
          data,
          imageUploadedUrl,
          videoUploadedUrl
        );

        await createIssue({
          title: 'Issue for Bug fix',
          description: description,
          priority: priority,
        });
      }
      // reset();
      enqueueSnackbar('Create success!');
      // router.push(paths.dashboard.task.root);
    } catch (error) {
      console.error(error);
    }
  });

  const renderMediaFile = (
    <Stack spacing={2}>
      <Typography variant="subtitle2">Screenshots/Video*</Typography>
      <Stack>
        <Typography variant="h6">Images</Typography>
        <Box sx={{ p: 1 }}>
          <Image alt={'feedback_screenshot'} src={imageSrc} sx={{ borderRadius: 1.5 }} />
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

  const renderDetails = (
    <Stack sx={{ width: 1 }}>
      <Typography variant="h6" sx={{ mb: 0.5, p: 3 }}>
        Task details
      </Typography>
      <Box
        columnGap={2}
        rowGap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
        sx={{ p: 3 }}
      >
        <Stack alignItems="baseline" sx={{ mb: 1 }}>
          <Typography variant="subtitle2">Reported by</Typography>
          <RHFTextField name="reportBy" placeholder="Type something..." />
        </Stack>
        {/* <Stack alignItems="baseline" sx={{ mb: 1 }}>
          <Typography variant="subtitle2">Date reported</Typography>
          <Controller
            name="dateReported"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <DatePicker
                {...field}
                format="dd/MM/yyyy"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!error,
                    helperText: error?.message,
                  },
                }}
              />
            )}
          />
        </Stack> */}
      </Box>
      <Stack sx={{ p: 3 }} spacing={1}>
        <Typography variant="subtitle2">Application/Module*</Typography>
        <RHFRadioGroup row spacing={4} name="module" options={TASK_MODULES_OPTIONS} />
      </Stack>
      <Stack sx={{ p: 3 }} spacing={1}>
        <Typography variant="subtitle2">Description</Typography>
        <RHFEditor simple name="description" />
      </Stack>
      <Stack direction="row" sx={{ p: 3 }} spacing={{ xs: 3, md: 5 }}>
        <Stack direction="row" alignItems="baseline" width={'100%'}>
          <Typography variant="subtitle2">Severity*</Typography>
          <RHFSelect
            name="severity"
            label="Severity"
            InputLabelProps={{ shrink: true }}
            PaperPropsSx={{ textTransform: 'capitalize' }}
            sx={{ px: 1.5, width: '20%' }}
          >
            {TASK_SEVERITY_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </RHFSelect>
          <RHFRadioGroup spacing={4} name="severityEffect" options={TASK_SEVERITY_EFFECT_OPTIONS} />
        </Stack>
      </Stack>
      <Stack direction="row" spacing={1}>
        <Stack spacing={1} sx={{ p: 3, width: '40%' }}>
          <Typography variant="subtitle2">Priority*</Typography>
          <RHFSelect
            name="priority"
            InputLabelProps={{ shrink: true }}
            PaperPropsSx={{ textTransform: 'capitalize' }}
          >
            {TASK_PRIORITY_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </RHFSelect>
        </Stack>
        <Stack spacing={1} sx={{ p: 3, width: '60%' }}>
          <Typography variant="subtitle2">Pre-conditions</Typography>
          <RHFEditor simple name="preCondition" />
        </Stack>
      </Stack>
      <Stack sx={{ p: 3 }} spacing={1}>
        <Typography variant="subtitle2">Step to Reproduce*</Typography>
        <RHFEditor simple name="stepToProduce" />
      </Stack>
      <Box
        columnGap={5}
        rowGap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          md: 'repeat(2, 1fr)',
        }}
        sx={{ p: 3 }}
      >
        <Stack spacing={1}>
          <Typography variant="subtitle2">Expected Result*</Typography>
          <RHFEditor simple name="expectedResult" />
        </Stack>
        <Stack spacing={1}>
          <Typography variant="subtitle2">Actual Result*</Typography>
          <RHFEditor simple name="actualResult" />
        </Stack>
      </Box>
      <Stack sx={{ p: 3 }} spacing={1}>
        {renderMediaFile}
      </Stack>
      <Stack sx={{ p: 3 }} spacing={1}>
        <Typography variant="subtitle2">Additional Information</Typography>
        <RHFEditor simple name="additionalInformation" />
      </Stack>
    </Stack>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Card>{renderDetails}</Card>
      <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
        <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
          {'Create Product'}
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}

// ----------------------------------------------------------------------
function convertDataToMarkdownFormat(
  formData: TaskBugfixData,
  imageUrl: string,
  videosUrl: string[]
) {
  const videoLinksMarkdown = videosUrl
    .map((url, index) => `* **Video ${index + 1}:** [Video Link](${url})`)
    .join('\n');

  const description = `
  * **Reported by:** ${formData?.reportBy}
  * **Date reported:** ${formData?.dateReported}
  * **Application/Module:** ${formData?.module}
  * **Description:** ${formData?.description?.replace(/<[^>]*>/g, '')}
  * **Severity:** ${formData?.severity} ${formData?.severityEffect}
  * **Pre-conditions:** ${formData?.preCondition?.replace(/<[^>]*>/g, '')}
  * **Steps to Reproduce:** ${formData?.stepToProduce?.replace(/<[^>]*>/g, '')}
  * **Expected Result:** ${formData?.expectedResult?.replace(/<[^>]*>/g, '')}
  * **Actual Result:** ${formData?.actualResult?.replace(/<[^>]*>/g, '')}
  * **Screenshot:** \n ![Screenshot](${imageUrl})
  * **Videos:** \n ${videoLinksMarkdown}
  * **Additional Information:** ${formData?.additionalInformation?.replace(/<[^>]*>/g, '')}
  `;

  const priority =
    formData.priority === 'Urgent'
      ? 1
      : formData.priority === 'High'
      ? 2
      : formData.priority === 'Medium'
      ? 3
      : 4;
  return { description, priority };
}
