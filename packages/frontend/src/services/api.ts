import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  signup: (email: string, password: string, name: string) =>
    api.post('/auth/signup', { email, password, name }),
};

export const tasks = {
  getAll: () => api.get('/tasks'),
  create: (data: {
    title: string;
    description?: string;
    priority?: string;
    dueDate?: string;
  }) => api.post('/tasks', data),
  update: (id: number, data: {
    title?: string;
    description?: string;
    priority?: string;
    status?: string;
    dueDate?: string;
  }) => api.put(`/tasks/${id}`, data),
  delete: (id: number) => api.delete(`/tasks/${id}`),
};
