// sections
import { FeedbackDetailsView } from 'src/sections/feedback/view';

import { ApolloClient, InMemoryCache, createHttpLink, gql } from '@apollo/client';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Feedback Details',
};

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_HASURA_URL,
  headers: {
    'content-type': 'application/json',
    'x-hasura-admin-secret': process.env.NEXT_PUBLIC_MONITORING_HASURA_ADMIN_SECRET as string,
  },
});

const client = new ApolloClient({
  link: httpLink,
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
