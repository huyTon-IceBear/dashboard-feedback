// @mui
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stack, { StackProps } from '@mui/material/Stack';
// types
import { FeedbackTableFilters, FeedbackTableFilterValue } from 'src/types/feedback';
// components
import Iconify from 'src/components/iconify';
import { shortDateLabel } from 'src/components/custom-date-range-picker';

// ----------------------------------------------------------------------

type Props = StackProps & {
  filters: FeedbackTableFilters;
  onFilters: (name: string, value: FeedbackTableFilterValue) => void;
  //
  onResetFilters: VoidFunction;
  //
  results: number;
};

export default function FeedbackTableFiltersResult({
  filters,
  onFilters,
  //
  onResetFilters,
  //
  results,
  ...other
}: Props) {
  const shortLabel = shortDateLabel(filters.startDate, new Date());

  const handleRemoveType = () => {
    onFilters('type', 'all');
  };

  const handleRemoveIssue = () => {
    onFilters('issue', '');
  };

  const handleRemoveElement = () => {
    onFilters('element', '');
  };

  const handleRemoveDate = () => {
    onFilters('startDate', null);
  };

  return (
    <Stack spacing={1.5} {...other}>
      <Box sx={{ typography: 'body2' }}>
        <strong>{results}</strong>
        <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
          results found
        </Box>
      </Box>

      <Stack flexGrow={1} spacing={1} direction="row" flexWrap="wrap" alignItems="center">
        {filters.issue !== '' && (
          <Block label="Issue:">
            <Chip
              key={filters.issue}
              label={filters.issue}
              size="small"
              onDelete={handleRemoveIssue}
            />
          </Block>
        )}

        {filters.element !== '' && (
          <Block label="Element:">
            <Chip
              key={filters.element}
              label={filters.element}
              size="small"
              onDelete={handleRemoveElement}
            />
          </Block>
        )}

        {filters.type !== 'all' && (
          <Block label="Type:">
            <Chip size="small" label={filters.type} onDelete={handleRemoveType} />
          </Block>
        )}

        {filters.startDate && (
          <Block label="Date:">
            <Chip size="small" label={shortLabel} onDelete={handleRemoveDate} />
          </Block>
        )}

        <Button
          color="error"
          onClick={onResetFilters}
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
        >
          Clear
        </Button>
      </Stack>
    </Stack>
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
      variant="outlined"
      spacing={1}
      direction="row"
      sx={{
        p: 1,
        borderRadius: 1,
        overflow: 'hidden',
        borderStyle: 'dashed',
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
