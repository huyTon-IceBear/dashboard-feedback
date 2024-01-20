'use client';

// @mui
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// _mock
import {
  _analyticTasks,
  _analyticPosts,
  _analyticTraffic,
  _analyticOrderTimeline,
} from 'src/_mock';
// components
import { useSettingsContext } from 'src/components/settings';
//
import AnalyticsCurrentVisits from '../analytics-current-visits';
import AnalyticsWebsiteVisits from '../analytics-website-visits';
import AnalyticsWidgetSummary from '../analytics-widget-summary';
import { subDays, format } from 'date-fns';
import { gql, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import {
  GET_FEEDBACK_BEFORE_DATE,
  GET_FEEDBACK_TOTAL,
  GET_FEEDBACK_SUM_ON_TYPE,
} from 'src/graphql/feedback';

// ----------------------------------------------------------------------
// Define the type for feedback
type Feedback = {
  created_at: string;
};

export default function OverviewAnalyticsView() {
  const settings = useSettingsContext();
  const labels = generateDateLabels();
  const [requestDate, setRequestDate] = useState<string>();
  const [countPerLabel, setCountPerLabel] = useState<number[]>([]);
  const [totalFeedback, setTotalFeedback] = useState<number>(0);
  const [totalNegativeFeedback, setTotalNegativeFeedback] = useState<number>(0);
  const [totalPositiveFeedback, setTotalPositiveFeedback] = useState<number>(0);

  const { loading } = useQuery(GET_FEEDBACK_BEFORE_DATE, {
    variables: {
      created_at: requestDate,
    },
    onCompleted: (data) => {
      const feedbackCountPerLabel = labels.map((label) => {
        const feedbackOnLabel = data.feedback.filter(
          (feedback: Feedback) => format(new Date(feedback.created_at), 'MM/dd/yyyy') === label
        );
        return {
          count: feedbackOnLabel.length,
        };
      });
      setCountPerLabel(feedbackCountPerLabel.map((item) => item.count));
    },
  });

  useEffect(() => {
    setRequestDate(generateRequestDateLastWeek());
  }, []);

  useQuery(GET_FEEDBACK_TOTAL, {
    onCompleted: (data) => {
      setTotalFeedback(data.feedback_aggregate.aggregate.count);
    },
  });

  useQuery(GET_FEEDBACK_SUM_ON_TYPE, {
    variables: {
      type: 'negative',
    },
    onCompleted: (data) => {
      setTotalNegativeFeedback(data.feedback_aggregate.aggregate.count);
    },
  });

  useQuery(GET_FEEDBACK_SUM_ON_TYPE, {
    variables: {
      type: 'positive',
    },
    onCompleted: (data) => {
      setTotalPositiveFeedback(data.feedback_aggregate.aggregate.count);
    },
  });

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography
        variant="h4"
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        Hi, Welcome back 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={4}>
          <AnalyticsWidgetSummary title="Feedbacks Received" total={totalFeedback} />
        </Grid>

        <Grid xs={12} sm={6} md={4}>
          <AnalyticsWidgetSummary
            title="Positive Feedback Received"
            total={totalPositiveFeedback}
            color="info"
          />
        </Grid>

        <Grid xs={12} sm={6} md={4}>
          <AnalyticsWidgetSummary
            title="Negative Feedback Received"
            total={totalNegativeFeedback}
            color="error"
          />
        </Grid>

        <Grid xs={12} md={6} lg={12}>
          <AnalyticsWebsiteVisits
            title="OpusFlow Recent Feedback"
            subheader="From the last 7 days"
            chart={{
              labels: labels,
              series: [
                {
                  name: 'Team A',
                  type: 'column',
                  fill: 'solid',
                  data: countPerLabel,
                },
              ],
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

function generateDateLabels() {
  const today = new Date();
  return Array.from({ length: 7 }, (_, index) => {
    const date = subDays(today, index);
    return format(date, 'MM/dd/yyyy');
  });
}

function generateRequestDateLastWeek() {
  const today = new Date();
  const lastWeek = subDays(today, 7);
  return lastWeek.toISOString();
}
