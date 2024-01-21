'use client';
import { useQuery } from '@apollo/client';
// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import BugfixTaskNewEditForm from '../bugfix-new-edit-form';
import { GET_A_FEEDBACK_BUGFIX } from 'src/sections/feedback/feedback-data-request';
// ----------------------------------------------------------------------

export default function BugfixTemplateCreateView() {
  const router = useRouter();

  const settings = useSettingsContext();

  const searchParams = useSearchParams();

  // Access the query parameters
  const feedbackId = searchParams.get('feedbackId');

  const { loading, data } = useQuery(GET_A_FEEDBACK_BUGFIX, {
    variables: {
      id: feedbackId,
    },
  });

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      {loading ? (
        <></>
      ) : (
        <>
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

          <BugfixTaskNewEditForm feedback={data?.feedback_by_pk} router={router} />
        </>
      )}
    </Container>
  );
}
