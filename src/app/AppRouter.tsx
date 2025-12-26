import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TasksListPage } from '@pages/tasks-list';
import { TaskEditPage } from '@pages/task-edit';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TasksListPage />} />
        <Route path="/task/:id/edit" element={<TaskEditPage />} />
      </Routes>
    </BrowserRouter>
  );
}

