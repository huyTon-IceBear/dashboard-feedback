// sections
import { JwtLoginView } from 'src/sections/auth/jwt';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Jwt: Login',
};

export default function ModernLoginPage() {
  return <JwtLoginView />;
}
