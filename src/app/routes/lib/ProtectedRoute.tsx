import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@shared/auth/hook/use-auth';
import { ROUTES } from '@shared/routes';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to={ROUTES.SIGN_IN}
        state={{ from: location }}
        replace
      />
    );
  }

  return <>{children}</>;
}
