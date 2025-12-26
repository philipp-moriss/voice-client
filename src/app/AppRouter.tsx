import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TasksListPage } from '@pages/tasks-list';
import { TaskEditPage } from '@pages/task-edit';
import { TaskCreatePage } from '@pages/task-create';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TasksListPage />} />
        <Route path="/task/create" element={<TaskCreatePage />} />
        <Route path="/task/:id/edit" element={<TaskEditPage />} />
      </Routes>
    </BrowserRouter>
  );
}

