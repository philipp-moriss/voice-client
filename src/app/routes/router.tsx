import { TasksListPage, TaskCreatePage, TaskEditPage, NotFoundPage } from '@pages/index';
import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <TasksListPage />,
  },
  {
    path: '/task',
    children: [
      {
        path: 'create',
        element: <TaskCreatePage />,
      },
      {
        path: ':id/edit',
        element: <TaskEditPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);