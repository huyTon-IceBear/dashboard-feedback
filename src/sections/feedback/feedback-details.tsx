import { useState, useCallback } from 'react';
// @mui
import Chip from '@mui/material/Chip';
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
import { fCurrency } from 'src/utils/format-number';
// _mock
import { INVOICE_STATUS_OPTIONS } from 'src/_mock';
// types
import { Feedback } from 'src/types/feedback';
// components
import Iconify from 'src/components/iconify';
import Markdown from 'src/components/markdown';

// ----------------------------------------------------------------------

type Props = {
  feedback: Feedback;
};

export default function FeedbackDetails({ feedback }: Props) {
  const { type, element, description, creator, createDate, issue } = feedback;

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
      <Stack spacing={2}>
        <Typography variant="h6">Evidences</Typography>
      </Stack>
    </Stack>
  );

  const renderOverview = (
    <Stack component={Card} spacing={2} sx={{ p: 3 }}>
      {[
        {
          label: 'User',
          value: creator,
          icon: <Iconify icon="solar:user-circle-bold" />,
        },
        {
          label: 'Created date',
          value: fDate(createDate),
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
