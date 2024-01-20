'use client';
import { useQuery } from '@apollo/client';
// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
//
import FeedbackDetails from '../feedback-details';
import FeedbackToolbar from '../feedback-toolbar';
import { GET_A_FEEDBACK } from '../feedback-data-request';
import { useState } from 'react';
import { FeedbackIssue } from 'src/types/feedback';
import { GET_FEEDBACK_ISSUES } from 'src/graphql/feedback';
// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function FeedbackDetailsView({ id }: Props) {
  const settings = useSettingsContext();
  const [issues, setIssue] = useState<string[]>([]);
  useQuery(GET_FEEDBACK_ISSUES, {
    onCompleted: (data) => {
      setIssue(data.feedback_issue.map((issue: FeedbackIssue) => issue.value));
    },
  });
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
            issues={issues}
          />
          <FeedbackDetails feedback={data.feedback_by_pk} />
        </>
      )}
    </Container>
  );
}
