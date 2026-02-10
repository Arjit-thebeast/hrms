
import { Employee, AttendanceRecord, ApiResponse, DashboardStats } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

/**
 * Service for communicating with Django REST backend.
 */
class HrmsService {
  private handleError(error: unknown): string {
    if (error instanceof Error) return error.message;
    return 'An error occurred';
  }

  // Employee API
  async fetchEmployees(): Promise<ApiResponse<Employee[]>> {
    try {
      const response = await fetch(`${API_URL}/employees/`);
      if (!response.ok) throw new Error('Failed to fetch employees');
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: this.handleError(error), data: [] };
    }
  }

  async addEmployee(employee: Omit<Employee, 'createdAt'>): Promise<ApiResponse<Employee>> {
    try {
      const response = await fetch(`${API_URL}/employees/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employee)
      });
      if (!response.ok) throw new Error('Failed to add employee');
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async deleteEmployee(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${API_URL}/employees/${id}/`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete employee');
      return { success: true };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  // Attendance API
  async fetchAttendance(date?: string): Promise<ApiResponse<AttendanceRecord[]>> {
    try {
      const url = new URL(`${API_URL}/attendance/`);
      if (date) url.searchParams.append('date', date);
      
      const response = await fetch(url.toString());
      if (!response.ok) throw new Error('Failed to fetch attendance');
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: this.handleError(error), data: [] };
    }
  }

  async markAttendance(record: Omit<AttendanceRecord, 'id'>): Promise<ApiResponse<AttendanceRecord>> {
    try {
      const response = await fetch(`${API_URL}/attendance/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record)
      });
      if (!response.ok) throw new Error('Failed to mark attendance');
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    try {
      const response = await fetch(`${API_URL}/dashboard/stats/`);
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }
}

export const hrmsService = new HrmsService();
