import { TasksListPage, TaskCreatePage, TaskEditPage, NotFoundPage } from '@pages/index';
import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '../layout';
import { ROUTES } from '@shared/routes';

export const router = createBrowserRouter([
  {
    path: ROUTES.TASK_LIST,
    element: <Layout />,
    children: [
      {
        index: true,
        element: <TasksListPage />,
      },
    ],
  },
  {
    path: '/task',
    children: [
      {
        path: ROUTES.TASK_CREATE,
        element: <TaskCreatePage />,
      },
      {
        path: ROUTES.TASK_EDIT(':id'),
        element: <TaskEditPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);