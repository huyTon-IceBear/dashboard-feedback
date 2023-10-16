'use client';

// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// _mock
import { _feedbacks } from 'src/_mock';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import FeedbackDetails from '../feedback-details';
import FeedbackToolbar from '../feedback-toolbar';
// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function FeedbackDetailsView({ id }: Props) {
  const settings = useSettingsContext();

  const currentFeedback = _feedbacks.filter((feedback) => feedback.id === id)[0];

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <FeedbackToolbar backLink={paths.dashboard.task.root} feedbackIssue={currentFeedback.issue} />
      <FeedbackDetails feedback={currentFeedback} />
    </Container>
  );
}
