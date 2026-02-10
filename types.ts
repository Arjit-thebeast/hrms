
export type Department = 'Engineering' | 'Human Resources' | 'Marketing' | 'Sales' | 'Finance' | 'Operations';

export interface Employee {
  id: string;
  fullName: string;
  email: string;
  department: Department;
  createdAt: string;
}

export type AttendanceStatus = 'Present' | 'Absent';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  status: AttendanceStatus;
}

export interface DashboardStats {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
  departmentCounts: Record<string, number>;
}

export type View = 'dashboard' | 'employees' | 'attendance';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}
