// sections
import { FeedbackDetailsView } from 'src/sections/feedback/view';

import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Feedback Details',
};

const client = new ApolloClient({
  uri: 'https://your-graphql-endpoint.com',
  cache: new InMemoryCache(),
});

interface Feedback {
  id: string;
}

type Props = {
  params: {
    id: string;
  };
};

export default function FeedbackDetailsPage({ params }: Props) {
  const { id } = params;

  return <FeedbackDetailsView id={id} />;
}

export async function generateStaticParams() {
  const { data } = await client.query({
    query: gql`
      query GET_FEEDBACKS {
        feedback {
          id
        }
      }
    `,
  });

  return data.feedback.map((feedback: Feedback) => ({ id: feedback.id }));
}
