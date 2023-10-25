'use client';
import { gql, useQuery } from '@apollo/client';
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

const GET_A_FEEDBACK = gql`
  query GET_A_FEEDBACK($id: uuid!) {
    feedback_by_pk(id: $id) {
      id
      description
      element
      issue
      type
      imageUrl
      videosUrl
      created_at
      created_by
    }
  }
`;

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
            feedbackIssue={data?.feedback_by_pk?.issue}
            feedbackId={data?.feedback_by_pk?.id}
          />
          <FeedbackDetails feedback={data?.feedback_by_pk} />
        </>
      )}
    </Container>
  );
}
