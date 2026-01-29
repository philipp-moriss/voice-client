import { TasksListPage, TaskCreatePage, TaskEditPage, NotFoundPage } from '@pages/index';
import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '../layout';
import { ROUTES } from '@shared/routes';
import { AuthProvider, ProtectedRoute, SignInPage, SignInCallbackPage } from '@features/auth';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthProvider>
        <Layout />
      </AuthProvider>
    ),
    children: [
      {
        path: ROUTES.SIGN_IN.slice(1),
        element: <SignInPage />,
      },
      {
        path: 'signin/callback',
        element: <SignInCallbackPage />,
      },
      {
        index: true,
        element: (
          <ProtectedRoute>
            <TasksListPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'task/create',
        element: (
          <ProtectedRoute>
            <TaskCreatePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'task/:id/edit',
        element: (
          <ProtectedRoute>
            <TaskEditPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);