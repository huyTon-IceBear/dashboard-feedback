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

export default function BugfixTaskNewEditForm({ currentProduct }: Props) {
  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const [includeTaxes, setIncludeTaxes] = useState(false);

  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    priority: Yup.string().required('Priority is required'),
    medias: Yup.array().min(1, 'medias is required'),
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
      medias: currentProduct?.medias || [],
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

  const serverity_effect_OPTIONS = [
    { value: 'All users or environments.', label: 'All users or environments.' },
    {
      value: "Only one or a few customers' environments or users specify which Environment or user",
      label: 'Only one or a few customers environments or users specify which Environment or user',
    },
  ];

  const MODULES_OPTIONS = [
    { value: 'My environment', label: 'My environment' },
    { value: 'Planning', label: 'Planning' },
    { value: 'CRM', label: 'CRM' },
    { value: 'Forms', label: 'Forms' },
    { value: 'Administration', label: 'Administration' },
    { value: 'Stock', label: 'Stock' },
    { value: 'Management', label: 'Management' },
    { value: 'Project', label: 'Project' },
  ];

  const priorities = [
    { label: 'Urgent', value: 'Urgent' },
    { label: 'Medium', value: 'Medium' },
    { label: 'Low', value: 'Low' },
  ];

  const Severities = [
    { label: 'Critical', value: 'Critical' },
    { label: 'Major', value: 'Major' },
    { label: 'Minor', value: 'Minor' },
    { label: 'Trivial', value: 'Trivial' },
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
        Client details
      </Typography>
      <Stack direction="row" sx={{ p: 3 }} spacing={{ xs: 3, md: 5 }}>
        <Stack alignItems="baseline" sx={{ mb: 1 }}>
          <Typography variant="subtitle2">Reported by</Typography>
          <RHFTextField name="priceSale" placeholder="Type something..." />
        </Stack>
        <Stack alignItems="baseline" sx={{ mb: 1 }}>
          <Typography variant="subtitle2">Date reported</Typography>
          <RHFTextField name="priceSale" placeholder="Type something..." />
        </Stack>
      </Stack>
      <Stack alignItems="baseline" sx={{ mb: 1 }}>
        <Typography variant="subtitle2">Application/Module*</Typography>
        <RHFRadioGroup row spacing={4} name="experience" options={MODULES_OPTIONS} />
      </Stack>
      <Stack direction="row" sx={{ p: 3 }} spacing={{ xs: 3, md: 5 }}>
        <Stack alignItems="baseline" sx={{ mb: 1 }}>
          <Typography variant="subtitle2">Severity*</Typography>
          <RHFSelect
            name="priority"
            label="Priority"
            InputLabelProps={{ shrink: true }}
            PaperPropsSx={{ textTransform: 'capitalize' }}
          >
            {Severities.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </RHFSelect>
        </Stack>
        <Stack alignItems="baseline" sx={{ mb: 1 }}>
          <RHFRadioGroup row spacing={4} name="experience" options={serverity_effect_OPTIONS} />
        </Stack>
      </Stack>
      <Stack direction="row" sx={{ p: 3 }} spacing={{ xs: 3, md: 5 }}>
        <Stack alignItems="baseline" sx={{ mb: 1 }}>
          <Typography variant="subtitle2">Priority*</Typography>
          <RHFSelect
            name="priority"
            label="Priority"
            InputLabelProps={{ shrink: true }}
            PaperPropsSx={{ textTransform: 'capitalize' }}
          >
            {priorities.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </RHFSelect>
        </Stack>
        <Stack sx={{ p: 3 }} spacing={{ xs: 3, md: 5 }}>
          <Typography variant="subtitle2">Pre-conditions</Typography>
          <RHFEditor simple name="description2" />
        </Stack>
      </Stack>
      <Stack sx={{ p: 3 }} spacing={{ xs: 3, md: 5 }}>
        <Typography variant="subtitle2">Step to Reproduce*</Typography>
        <RHFEditor simple name="description" />
      </Stack>
      <Stack direction="row" sx={{ p: 3 }} spacing={{ xs: 3, md: 5 }}>
        <Stack alignItems="baseline" sx={{ mb: 1 }}>
          <Typography variant="subtitle2">Expected Result*</Typography>
          <RHFEditor simple name="description1" />
        </Stack>
        <Stack sx={{ p: 3 }} spacing={{ xs: 3, md: 5 }}>
          <Typography variant="subtitle2">Actual Result*</Typography>
          <RHFEditor simple name="description3" />
        </Stack>
      </Stack>
      <Stack sx={{ p: 3 }} spacing={{ xs: 3, md: 5 }}>
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
      <Stack sx={{ p: 3 }} spacing={{ xs: 3, md: 5 }}>
        <Typography variant="subtitle2">Additional Information</Typography>
        <RHFEditor simple name="sub-description3" />
      </Stack>
    </Stack>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Card>{renderDetails}</Card>
      <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
        <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
          {!currentProduct ? 'Create Product' : 'Save Changes'}
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
