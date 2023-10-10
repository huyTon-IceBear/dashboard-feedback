'use client';

// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import BugfixTaskNewEditForm from '../bugfix-new-edit-form';

// ----------------------------------------------------------------------

export default function BugfixTemplateCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Bugfix template"
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

      <BugfixTaskNewEditForm />
    </Container>
  );
}
