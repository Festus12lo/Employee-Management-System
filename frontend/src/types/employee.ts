export type EmployeeStatus = 'Active' | 'Inactive' | 'On Leave';

export type Department =
  | 'Engineering'
  | 'IT'
  | 'Human Resources'
  | 'Finance'
  | 'Marketing'
  | 'Sales'
  | 'Operations';

export interface Employee {
  id: number;
  employee_id: string;
  full_name: string;
  email: string;
  phone: string;
  department: Department;
  designation: string;
  salary: string; // Decimal string from DRF e.g. "85000.00"
  joining_date: string; // YYYY-MM-DD
  status: EmployeeStatus;
  created_at: string;
  updated_at: string;
}

export interface EmployeeInput {
  employee_id: string;
  full_name: string;
  email: string;
  phone: string;
  department: Department | '';
  designation: string;
  salary: string | number;
  joining_date: string;
  status: EmployeeStatus;
}

export interface DepartmentStat {
  department: string;
  count: number;
  percentage: number;
}

export interface DashboardStats {
  total_employees: number;
  active_employees: number;
  inactive_employees: number;
  on_leave_employees: number;
  departments_count: number;
  department_distribution: DepartmentStat[];
  recent_employees: Employee[];
}

export interface UserProfile {
  email: string;
  name: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
  message?: string;
}

export interface EmployeeFiltersState {
  search: string;
  department: string;
  status: string;
  ordering: string;
}
