'use client';
import { useQuery } from '@apollo/client';
// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// _mock
import { _feedbacks } from 'src/_mock';
// components
import { useSettingsContext } from 'src/components/settings';
//
import FeedbackDetails from '../feedback-details';
import FeedbackToolbar from '../feedback-toolbar';
import { GET_A_FEEDBACK } from '../feedback-data-request';
// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function FeedbackDetailsView({ id }: Props) {
  const settings = useSettingsContext();

  const { loading, data } = useQuery(GET_A_FEEDBACK, {
    variables: {
      id,
    },
  });

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      {loading ? (
        <></>
      ) : (
        <>
          <FeedbackToolbar
            backLink={paths.dashboard.task.root}
            feedbackIssue={data.feedback_by_pk.issue}
            feedbackId={data.feedback_by_pk.id}
          />
          <FeedbackDetails feedback={data.feedback_by_pk} />
        </>
      )}
    </Container>
  );
}
