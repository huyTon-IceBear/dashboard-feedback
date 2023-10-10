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
  _tags,
  PRODUCT_SIZE_OPTIONS,
  PRODUCT_GENDER_OPTIONS,
  PRODUCT_COLOR_NAME_OPTIONS,
  PRODUCT_CATEGORY_GROUP_OPTIONS,
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
import { IProductItem } from 'src/types/product';

// ----------------------------------------------------------------------

type Props = {
  currentProduct?: IProductItem;
};

export default function RFCTaskNewEditForm({ currentProduct }: Props) {
  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const [includeTaxes, setIncludeTaxes] = useState(false);

  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    priority: Yup.string().required('Priority is required'),
    images: Yup.array().min(1, 'Images is required'),
    tags: Yup.array().min(2, 'Must have at least 2 tags'),
    category: Yup.string().required('Category is required'),
    price: Yup.number().moreThan(0, 'Price should not be $0.00'),
    description: Yup.string().required('Description is required'),
    // not required
    taxes: Yup.number(),
    newLabel: Yup.object().shape({
      enabled: Yup.boolean(),
      content: Yup.string(),
    }),
    saleLabel: Yup.object().shape({
      enabled: Yup.boolean(),
      content: Yup.string(),
    }),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentProduct?.name || '',
      priority: '',
      description: currentProduct?.description || '',
      description1: currentProduct?.description || '',
      description2: currentProduct?.description || '',
      description3: currentProduct?.description || '',
      subDescription: currentProduct?.subDescription || '',
      images: currentProduct?.images || [],
      //
      code: currentProduct?.code || '',
      sku: currentProduct?.sku || '',
      price: currentProduct?.price || 0,
      quantity: currentProduct?.quantity || 0,
      priceSale: currentProduct?.priceSale || 0,
      tags: currentProduct?.tags || [],
      taxes: currentProduct?.taxes || 0,
      gender: currentProduct?.gender || '',
      category: currentProduct?.category || '',
      colors: currentProduct?.colors || [],
      sizes: currentProduct?.sizes || [],
      newLabel: currentProduct?.newLabel || { enabled: false, content: '' },
      saleLabel: currentProduct?.saleLabel || { enabled: false, content: '' },
    }),
    [currentProduct]
  );

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
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

  const BIG_CLIENT_OPTIONS = [
    { value: true, label: 'Yes' },
    { value: false, label: 'No' },
  ];

  const USE_CASE_IMPACT_OPTIONS = [
    { value: 'Only this environment', label: 'Only this environment' },
    {
      value: 'All environments (all OpusFlow users)',
      label: 'All environments (all OpusFlow users)',
    },
  ];

  const priorities = [
    {
      label: 'High',
      value: 'high',
      options: [
        { label: 'Unworkable process', value: 'Unworkable process' },
        { label: 'Onboarding client', value: 'Onboarding client' },
        { label: 'Prevention of churn', value: 'Prevention of churn' },
        { label: 'Overdue promise', value: 'Overdue promise' },
        { label: 'Other', value: 'Other' },
      ],
    },
    {
      label: 'Medium',
      value: 'medium',
      options: [
        { label: 'Not immediately required', value: 'Not immediately required' },
        {
          label: 'Can currently be fixed through other means',
          value: 'Can currently be fixed through other means',
        },
        { label: 'Feedback on UX- or UI flow', value: 'Feedback on UX- or UI flow' },
        { label: 'Other', value: 'Other' },
      ],
    },
    {
      label: 'Low',
      value: 'low',
      options: [
        { label: 'Nice to have', value: 'Nice to have' },
        { label: 'Other', value: 'Other' },
      ],
    },
  ];

  useEffect(() => {
    if (currentProduct) {
      reset(defaultValues);
    }
  }, [currentProduct, defaultValues, reset]);

  useEffect(() => {
    if (includeTaxes) {
      setValue('taxes', 0);
    } else {
      setValue('taxes', currentProduct?.taxes || 0);
    }
  }, [currentProduct?.taxes, includeTaxes, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      enqueueSnackbar(currentProduct ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.product.root);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const files = values.images || [];

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setValue('images', [...files, ...newFiles], { shouldValidate: true });
    },
    [setValue, values.images]
  );

  const handleRemoveFile = useCallback(
    (inputFile: File | string) => {
      const filtered = values.images && values.images?.filter((file) => file !== inputFile);
      setValue('images', filtered);
    },
    [setValue, values.images]
  );

  const handleRemoveAllFiles = useCallback(() => {
    setValue('images', []);
  }, [setValue]);

  const handleChangeIncludeTaxes = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setIncludeTaxes(event.target.checked);
  }, []);

  const getOptionsForPriority = (selected: string) => {
    const selectedPriority = priorities.find((priority) => priority.value === selected);

    // Check if the selected priority exists, and if so, return its options
    if (selectedPriority) {
      return selectedPriority.options;
    }

    // If the selected priority doesn't exist, return options from the default priority (e.g., 'high')
    return priorities[0].options;
  };

  const renderPriorities = (
    <Stack direction="row" sx={{ p: 3 }} spacing={{ xs: 3, md: 5 }}>
      <Stack direction="row" alignItems="baseline" sx={{ mb: 1 }}>
        <Typography variant="body2">Priority as set for consultancy</Typography>
        <RHFSelect
          name="priority"
          label="Priority"
          InputLabelProps={{ shrink: true }}
          PaperPropsSx={{ textTransform: 'capitalize' }}
        >
          {priorities.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.value}
            </MenuItem>
          ))}
        </RHFSelect>
      </Stack>
      <Stack direction="row" alignItems="baseline" sx={{ mb: 1 }}>
        <Typography variant="body2">required for: </Typography>
        <RHFRadioGroup name="gender" spacing={2} options={getOptionsForPriority(values.priority)} />
      </Stack>
    </Stack>
  );

  const renderDetails = (
    <Stack sx={{ width: 1 }}>
      <Stack direction={'row'} sx={{ p: 3 }} spacing={{ xs: 3, md: 5 }}>
        <Stack spacing={1}>
          <Typography variant="body2">Is this for a big client?*</Typography>
          <RHFRadioGroup row spacing={4} name="experience" options={BIG_CLIENT_OPTIONS} />
        </Stack>

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Name client environment*</Typography>
          <RHFTextField name="priceSale" placeholder="Type something..." />
        </Stack>
      </Stack>

      <Stack direction={'row'} sx={{ p: 3 }} spacing={{ xs: 3, md: 5 }}>
        <Typography variant="subtitle2">Use case impact*</Typography>
        <RHFRadioGroup row spacing={4} name="experience" options={USE_CASE_IMPACT_OPTIONS} />
      </Stack>

      <Stack sx={{ p: 3 }} spacing={{ xs: 3, md: 5 }}>
        <Typography variant="subtitle2">Description & Notes*</Typography>
        <RHFEditor simple name="content" />
      </Stack>

      <Stack sx={{ p: 3 }} spacing={{ xs: 3, md: 5 }}>
        <Typography variant="subtitle2">How should it work?*</Typography>
        <RHFEditor simple name="description" />
      </Stack>
    </Stack>
  );

  const renderClientDetails = (
    <Stack sx={{ width: 1 }}>
      <Typography variant="h6" sx={{ mb: 0.5, p: 3 }}>
        Client details
      </Typography>
      <Stack direction={'row'} sx={{ p: 3 }} spacing={{ xs: 3, md: 5 }}>
        <Stack spacing={1}>
          <Typography variant="body2">Name & function client</Typography>
          <RHFTextField name="priceSales2" placeholder="Type something..." />
        </Stack>

        <Stack spacing={1}>
          <Typography variant="body2">This relates to the following user type / role</Typography>
          <RHFTextField name="priceSales1" placeholder="Type something..." />
        </Stack>
      </Stack>

      <Stack sx={{ p: 3 }} spacing={{ xs: 3, md: 5 }}>
        <Typography variant="subtitle2">Why should it be added?</Typography>
        <RHFEditor simple name="description3" />
      </Stack>

      <Stack sx={{ p: 3 }} spacing={{ xs: 3, md: 5 }}>
        <Typography variant="subtitle2">What is the goal of the client for this feature</Typography>
        <RHFEditor simple name="description1" />
      </Stack>

      <Stack sx={{ p: 3 }} spacing={{ xs: 3, md: 5 }}>
        <Typography variant="subtitle2">Requirements*</Typography>
        <RHFEditor simple name="description2" />
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
          {!currentProduct ? 'Create Product' : 'Save Changes'}
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
