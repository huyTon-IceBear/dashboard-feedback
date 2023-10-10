'use client';

// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import RFCTaskNewEditForm from '../rfc-new-edit-form';

// ----------------------------------------------------------------------

export default function RFCTemplateCreateView() {
  const settings = useSettingsContext();

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

      <RFCTaskNewEditForm />
    </Container>
  );
}
