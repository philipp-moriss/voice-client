export const ROUTES = {
  SIGN_IN: '/signin',
  SIGN_IN_CALLBACK: '/signin/callback',
  TASK_LIST: '/',
  TASK_CREATE: '/task/create',
  TASK_EDIT: (id: string) => `/task/${id}/edit`,
} as const;