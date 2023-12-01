import * as Yup from 'yup';
import { useCallback, useMemo, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';

// routes
import { paths } from 'src/routes/paths';
// _mock
import {
  TASK_CLIENT_OPTIONS,
  TASK_USE_CASE_IMPACT_OPTIONS,
  TASK_PRIORITIES,
  _feedbacks,
} from 'src/_mock';
// components
import { useSnackbar } from 'src/components/snackbar';
import { useRouter } from 'src/routes/hooks';
import FormProvider, {
  RHFSelect,
  RHFEditor,
  RHFTextField,
  RHFRadioGroup,
} from 'src/components/hook-form';
// types
import { TaskRFC, TaskRFCData, TaskLinear } from 'src/types/task';
import { FeedbackRFCType } from 'src/types/feedback';

// ----------------------------------------------------------------------

type Props = {
  currentTask?: TaskRFC;
  feedback?: FeedbackRFCType;
};

export default function RFCTaskNewEditForm({ currentTask, feedback }: Props) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const NewTaskSchema = Yup.object().shape({
    priority: Yup.string().required('Priority is required'),
    priorityRequirement: Yup.string().required('Priority requirement is required'),
    isBigClient: Yup.string().required('Field is required'),
    clientEnvironment: Yup.string().required('Client environment name is required'),
    useCaseImpact: Yup.string().required('Field is required'),
    description: Yup.string().required('Description is required'),
    workDescription: Yup.string().required('Field is required'),
    requirement: Yup.string().required('Requirements is required'),
    // not required
    clientName: Yup.string(),
    clientRole: Yup.string(),
    reason: Yup.string(),
    goal: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      priority: currentTask?.priority || TASK_PRIORITIES[0].value,
      priorityRequirement: currentTask?.priorityRequirement || TASK_PRIORITIES[0].options[0].value,
      isBigClient: currentTask?.isBigClient || '',
      clientEnvironment: currentTask?.clientEnvironment || '',
      useCaseImpact: currentTask?.useCaseImpact || TASK_USE_CASE_IMPACT_OPTIONS[0].value,
      description: feedback?.description || currentTask?.description || '',
      workDescription: currentTask?.workDescription || '',
      requirement: currentTask?.requirement || '',
      //
      clientName: feedback?.created_by || currentTask?.clientName || '',
      clientRole: currentTask?.clientRole || '',
      reason: currentTask?.reason || '',
      goal: currentTask?.goal || '',
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

  const createLinearTask = async (taskData: TaskLinear) => {
    const response = await fetch('/api/linear', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ TaskData: taskData }),
    });
    return response.json();
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const { description, priority } = convertDataToMarkdownFormat(data);
      createLinearTask({
        title: 'Issue for RFC',
        description: description,
        priority: priority,
      });
      reset();
      enqueueSnackbar('Create success!');
      // router.push(paths.dashboard.task.root);
    } catch (error) {
      console.error(error);
    }
  });

  const getOptionsForPriority = (selected: string) => {
    const selectedPriority = TASK_PRIORITIES.find((priority) => priority.value === selected);

    // Check if the selected priority exists, and if so, return its options
    if (selectedPriority) {
      return selectedPriority.options;
    }

    // If the selected priority doesn't exist, return options from the default priority (e.g., 'high')
    return TASK_PRIORITIES[0].options;
  };

  const renderPriorities = (
    <Stack sx={{ width: 1 }}>
      <Typography variant="h6" sx={{ mb: 0.5, p: 3 }}>
        Task details
      </Typography>
      <Stack direction="row" sx={{ px: 3 }} spacing={{ xs: 3, md: 5 }} minHeight={250}>
        <Stack direction="row" alignItems="baseline" width={'100%'}>
          <Typography variant="subtitle2">Priority as set for consultancy</Typography>
          <RHFSelect
            name="priority"
            label="Priority"
            InputLabelProps={{ shrink: true }}
            PaperPropsSx={{ textTransform: 'capitalize' }}
            sx={{ px: 1.5, width: '20%' }}
          >
            {TASK_PRIORITIES.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.value}
              </MenuItem>
            ))}
          </RHFSelect>
          <Typography variant="subtitle2">{`${
            values.priority === TASK_PRIORITIES[0].value
              ? ',required for: '
              : values.priority === TASK_PRIORITIES[1].value
              ? ',need to have but:'
              : ',nice to have:'
          }`}</Typography>
          <RHFRadioGroup
            name="priorityRequirement"
            spacing={2}
            sx={{ px: 2 }}
            options={getOptionsForPriority(values.priority)}
          />
        </Stack>
      </Stack>
    </Stack>
  );

  const renderDetails = (
    <Stack sx={{ width: 1 }}>
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
        <Stack spacing={1}>
          <Typography variant="subtitle2">Is this for a big client?*</Typography>
          <RHFRadioGroup row spacing={4} name="isBigClient" options={TASK_CLIENT_OPTIONS} />
        </Stack>
        <Stack spacing={1}>
          <Typography variant="subtitle2">Name client environment*</Typography>
          <RHFTextField
            name="clientEnvironment"
            placeholder="Type something..."
            sx={{ width: '70%' }}
          />
        </Stack>
        <Stack spacing={1}>
          <Typography variant="subtitle2">Use case impact*</Typography>
          <RHFRadioGroup
            row
            spacing={4}
            name="useCaseImpact"
            options={TASK_USE_CASE_IMPACT_OPTIONS}
          />
        </Stack>
      </Box>

      <Stack sx={{ p: 3 }} spacing={1}>
        <Typography variant="subtitle2">Description & Notes*</Typography>
        <RHFEditor simple name="description" />
      </Stack>

      <Stack sx={{ p: 3 }} spacing={1}>
        <Typography variant="subtitle2">How should it work?*</Typography>
        <RHFEditor simple name="workDescription" />
      </Stack>
    </Stack>
  );

  const renderClientDetails = (
    <Stack sx={{ width: 1 }}>
      <Typography variant="h6" sx={{ mb: 0.5, p: 3 }}>
        Client details
      </Typography>
      <Box
        columnGap={2}
        rowGap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          md: 'repeat(2, 1fr)',
        }}
        sx={{ p: 3 }}
      >
        <Stack spacing={1}>
          <Typography variant="subtitle2">Name & function client</Typography>
          <RHFTextField name="clientName" placeholder="Type something..." />
        </Stack>

        <Stack spacing={1}>
          <Typography variant="subtitle2">
            This relates to the following user type / role
          </Typography>
          <RHFTextField name="clientRole" placeholder="Type something..." />
        </Stack>
      </Box>

      <Stack sx={{ p: 3 }} spacing={1}>
        <Typography variant="subtitle2">Why should it be added?</Typography>
        <RHFEditor simple name="reason" />
      </Stack>

      <Stack sx={{ p: 3 }} spacing={1}>
        <Typography variant="subtitle2">What is the goal of the client for this feature</Typography>
        <RHFEditor simple name="goal" />
      </Stack>

      <Stack sx={{ p: 3 }} spacing={1}>
        <Typography variant="subtitle2">Requirements*</Typography>
        <RHFEditor simple name="requirement" />
      </Stack>
    </Stack>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Card>
        {renderPriorities}
        {renderDetails}
        <Divider />
        {renderClientDetails}
      </Card>
      <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
        <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
          {'Create Task'}
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}

// ----------------------------------------------------------------------
function convertDataToMarkdownFormat(formData: TaskRFCData) {
  const description = `
  * **Task Details**
    * Priority as set for consultancy*: ${formData?.priority}, ${formData?.priorityRequirement}
    * Is this for a big client?* ${formData?.isBigClient}
    * Name client environment *: ${formData?.clientEnvironment}
    * Use case impacts *: ${formData?.useCaseImpact}
    * Description & notes *: ${formData?.description?.replace(/<[^>]*>/g, '')}
    * How should it work? (Scenario: step by step description of a use case in which this feature / bug is used) *: ${formData?.workDescription?.replace(
      /<[^>]*>/g,
      ''
    )}
  * **Client Details**
    * Name & function client: ${formData?.clientName}
    * This relates to the following usertype / role (think of sales, administration etc): ${formData?.clientRole}
    * Why should it be added? (what does it solve and what is the added value for Opus users?): ${formData?.reason?.replace(
      /<[^>]*>/g,
      ''
    )}
    * What is the goal of the client for this feature: ${formData?.goal?.replace(/<[^>]*>/g, '')}
    * Requirements set by the client and the consultant for this feature (these features will decide whether the feature is delivered or not): ${formData?.requirement?.replace(
      /<[^>]*>/g,
      ''
    )}
  `;

  const priority = formData.priority === 'High' ? 2 : formData.priority === 'Medium' ? 3 : 4;
  return { description, priority };
}
