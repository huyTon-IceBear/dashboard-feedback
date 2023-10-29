import { redirect } from 'next/navigation';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Monitoring: The starting point for your next project',
};

export default function HomePage() {
  redirect('/auth/login');

  return null;
}
