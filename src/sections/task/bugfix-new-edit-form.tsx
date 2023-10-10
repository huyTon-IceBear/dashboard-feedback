import * as Yup from 'yup';
import { useCallback, useMemo, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { SelectChangeEvent } from '@mui/material/Select';
// routes
import { paths } from 'src/routes/paths';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// _mock
import {
  TASK_SEVERITY_EFFECT_OPTIONS,
  TASK_MODULES_OPTIONS,
  TASK_PRIORITY_OPTIONS,
  TASK_SEVERITY_OPTIONS,
} from 'src/_mock';
// components
import { useSnackbar } from 'src/components/snackbar';
import { useRouter } from 'src/routes/hooks';
import FormProvider, {
  RHFSelect,
  RHFEditor,
  RHFUpload,
  RHFSwitch,
  RHFTextField,
  RHFMultiSelect,
  RHFAutocomplete,
  RHFMultiCheckbox,
  RHFRadioGroup,
} from 'src/components/hook-form';
// types
import { TaskBugfix } from 'src/types/task';

// ----------------------------------------------------------------------

type Props = {
  currentTask?: TaskBugfix;
};

export default function BugfixTaskNewEditForm({ currentTask }: Props) {
  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const NewTaskSchema = Yup.object().shape({
    reportBy: Yup.string().required('Field is required'),
    dateReported: Yup.string().required('Field is required'),
    module: Yup.string().required('Field is required'),
    severity: Yup.string().required('Field is required'),
    severityEffect: Yup.string().required('Field is required'),
    priority: Yup.string().required('Priority is required'),
    stepToProduce: Yup.string().required('Field is required'),
    expectedResult: Yup.string().required('Field is required'),
    actualResult: Yup.string().required('Field is required'),
    medias: Yup.array().min(1, 'medias is required'),
    // not required
    description: Yup.string(),
    preCondition: Yup.string(),
    additionalInformation: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      reportBy: currentTask?.reportBy || '',
      dateReported: currentTask?.dateReported || '',
      module: currentTask?.module || TASK_MODULES_OPTIONS[0].value,
      severity: currentTask?.severity || TASK_SEVERITY_OPTIONS[0].value,
      severityEffect: currentTask?.severityEffect || TASK_SEVERITY_EFFECT_OPTIONS[0].value,
      priority: currentTask?.severityEffect || TASK_PRIORITY_OPTIONS[0].value,
      stepToProduce: currentTask?.stepToProduce || '',
      expectedResult: currentTask?.expectedResult || '',
      actualResult: currentTask?.actualResult || '',
      medias: currentTask?.medias || [],
      //
      description: currentTask?.description || '',
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

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      enqueueSnackbar('Create success!');
      // router.push(paths.dashboard.task.root);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const files = values.medias || [];

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setValue('medias', [...files, ...newFiles], { shouldValidate: true });
    },
    [setValue, values.medias]
  );

  const handleRemoveFile = useCallback(
    (inputFile: File | string) => {
      const filtered = values.medias && values.medias?.filter((file) => file !== inputFile);
      setValue('medias', filtered);
    },
    [setValue, values.medias]
  );

  const handleRemoveAllFiles = useCallback(() => {
    setValue('medias', []);
  }, [setValue]);

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
        <Stack alignItems="baseline" sx={{ mb: 1 }}>
          <Typography variant="subtitle2">Date reported</Typography>
          <RHFTextField name="dateReported" placeholder="Type something..." />
        </Stack>
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
        <Typography variant="subtitle2">Screenshots/Video*</Typography>
        <RHFUpload
          multiple
          thumbnail
          name="medias"
          accept={{}}
          maxSize={3145728}
          onDrop={handleDrop}
          onRemove={handleRemoveFile}
          onRemoveAll={handleRemoveAllFiles}
          onUpload={() => console.info('ON UPLOAD')}
        />
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
