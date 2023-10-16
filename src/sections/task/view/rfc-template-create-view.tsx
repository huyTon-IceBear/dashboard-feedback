'use client';

// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { useSearchParams } from 'src/routes/hooks';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import RFCTaskNewEditForm from '../rfc-new-edit-form';

// ----------------------------------------------------------------------

export default function RFCTemplateCreateView() {
  const settings = useSettingsContext();

  const searchParams = useSearchParams();

  // Access the query parameters
  const feedbackId = searchParams.get('feedbackId');

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="RFC template"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Task',
            href: paths.dashboard.task.root,
          },
          { name: 'New Task' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <RFCTaskNewEditForm feedbackId={feedbackId} />
    </Container>
  );
}
