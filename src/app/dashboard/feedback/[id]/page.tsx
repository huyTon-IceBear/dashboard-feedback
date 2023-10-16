// _mock
import { _feedbacks } from 'src/_mock/_feedback';
// sections
import { FeedbackDetailsView } from 'src/sections/feedback/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Feedback Details',
};

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
  return _feedbacks.map((feedback) => ({
    id: feedback.id,
  }));
}
