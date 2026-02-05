import { TasksListPage, TaskCreatePage, TaskEditPage, ProfilePage, NotFoundPage } from '@pages/index';
import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '../layout';
import { ROUTES } from '@shared/routes';
import { ProtectedRoute } from './lib';
import { SignInPage, SignInCallbackPage } from '@pages/auth';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
        <Layout />
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
        path: 'profile',
        element: (
          <ProtectedRoute>
            <ProfilePage />
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