export const ROUTES = {
  TASK_LIST: '/',
  TASK_CREATE: '/task/create',
  TASK_EDIT: (id: string) => `/task/${id}/edit`,
} as const;