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

// ----------------------------------------------------------------------

const GET_FEEDBACK_THIS_WEEK = gql`
  query GET_FEEDBACK_THIS_WEEK($created_at: timestamptz!) {
    feedback(where: { created_at: { _gte: $created_at } }) {
      created_at
    }
  }
`;

// Define the type for feedback
type Feedback = {
  created_at: string;
};

export default function OverviewAnalyticsView() {
  const settings = useSettingsContext();
  const labels = generateDateLabels();
  const [requestDate, setRequestDate] = useState<string>();
  const [countPerLabel, setCountPerLabel] = useState<number[]>([]);

  const { loading } = useQuery(GET_FEEDBACK_THIS_WEEK, {
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

  console.log(labels.reverse(), 'labels.reverse()');
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
          <AnalyticsWidgetSummary title="Feedbacks Received" total={714} />
        </Grid>

        <Grid xs={12} sm={6} md={4}>
          <AnalyticsWidgetSummary title="Positive Feedback Received" total={234} color="info" />
        </Grid>

        <Grid xs={12} sm={6} md={4}>
          <AnalyticsWidgetSummary title="Negative Feedback Received" total={234} color="error" />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
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

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsCurrentVisits
            title="Current Visits"
            chart={{
              series: [
                { label: 'America', value: 4344 },
                { label: 'Asia', value: 5435 },
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
