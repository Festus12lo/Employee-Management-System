import axios from 'axios';
import type {
  Employee,
  EmployeeInput,
  DashboardStats,
  AuthResponse,
  EmployeeFiltersState,
} from '../types/employee';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Attach token if present
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('ems_auth_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Format API error messages
export const formatApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return 'Unable to connect to the server. Please ensure the backend is running.';
    }
    const data = error.response.data;
    if (typeof data === 'string') {
      return data;
    }
    if (typeof data === 'object' && data !== null) {
      if ('detail' in data && typeof data.detail === 'string') {
        return data.detail;
      }
      if ('error' in data && typeof data.error === 'string') {
        return data.error;
      }
      // Field error messages
      const fieldErrors = Object.entries(data)
        .map(([field, msgs]) => {
          const formattedField = field.replace('_', ' ');
          const message = Array.isArray(msgs) ? msgs.join(' ') : String(msgs);
          return `${formattedField}: ${message}`;
        })
        .join(' | ');
      if (fieldErrors) return fieldErrors;
    }
    return `Server returned error (${error.response.status}).`;
  }
  return 'An unexpected error occurred.';
};

export const api = {
  // Employees CRUD
  getEmployees: async (filters?: Partial<EmployeeFiltersState>): Promise<Employee[]> => {
    const params: Record<string, string> = {};
    if (filters?.search) params.search = filters.search;
    if (filters?.department && filters.department !== 'All') params.department = filters.department;
    if (filters?.status && filters.status !== 'All') params.status = filters.status;
    if (filters?.ordering) params.ordering = filters.ordering;

    const response = await apiClient.get<Employee[]>('/employees/', { params });
    return response.data;
  },

  getEmployee: async (id: number | string): Promise<Employee> => {
    const response = await apiClient.get<Employee>(`/employees/${id}/`);
    return response.data;
  },

  createEmployee: async (data: EmployeeInput): Promise<Employee> => {
    const response = await apiClient.post<Employee>('/employees/', data);
    return response.data;
  },

  updateEmployee: async (id: number | string, data: Partial<EmployeeInput>): Promise<Employee> => {
    const response = await apiClient.put<Employee>(`/employees/${id}/`, data);
    return response.data;
  },

  patchEmployee: async (id: number | string, data: Partial<EmployeeInput>): Promise<Employee> => {
    const response = await apiClient.patch<Employee>(`/employees/${id}/`, data);
    return response.data;
  },

  deleteEmployee: async (id: number | string): Promise<void> => {
    await apiClient.delete(`/employees/${id}/`);
  },

  // Dashboard Stats
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<DashboardStats>('/dashboard/stats/');
    return response.data;
  },

  // Authentication
  login: async (credentials: { email: string; password?: string }): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login/', credentials);
    return response.data;
  },
};
