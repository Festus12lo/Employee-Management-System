import React, { useState, useEffect, useCallback } from 'react';
import { Users, UserCheck, UserX, Building, RefreshCw, AlertCircle, Plus } from 'lucide-react';
import { api, formatApiError } from '../services/api';
import type { DashboardStats, Employee, EmployeeInput } from '../types/employee';
import { StatCard } from '../components/ui/StatCard';
import { DepartmentChart } from '../components/dashboard/DepartmentChart';
import { RecentEmployees } from '../components/dashboard/RecentEmployees';
import { EmployeeDetailModal } from '../components/employees/EmployeeDetailModal';
import { EmployeeFormModal } from '../components/employees/EmployeeFormModal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Button } from '../components/ui/Button';
import { useToast } from '../context/ToastContext';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { success, error: toastError } = useToast();

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getDashboardStats();
      setStats(data);
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleViewEmployee = (emp: Employee) => {
    setSelectedEmployee(emp);
    setIsDetailOpen(true);
  };

  const handleEditEmployee = (emp: Employee) => {
    setEditingEmployee(emp);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: EmployeeInput) => {
    try {
      if (editingEmployee) {
        await api.updateEmployee(editingEmployee.id, data);
        success('Employee updated successfully.');
      } else {
        await api.createEmployee(data);
        success('Employee added successfully.');
      }
      setIsFormOpen(false);
      setEditingEmployee(null);
      fetchStats();
    } catch (err) {
      toastError(formatApiError(err));
      throw err;
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingEmployee) return;
    setIsDeleting(true);
    try {
      await api.deleteEmployee(deletingEmployee.id);
      success('Employee deleted successfully.');
      setDeletingEmployee(null);
      fetchStats();
    } catch (err) {
      toastError(formatApiError(err));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Dashboard</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Overview of employee operations and workforce records.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={fetchStats}
            isLoading={isLoading}
            icon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Sync Data
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setEditingEmployee(null);
              setIsFormOpen(true);
            }}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Employee
          </Button>
        </div>
      </div>

      {/* Error state if server is down */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <h4 className="text-xs font-semibold text-rose-900">Unable to load dashboard data</h4>
              <p className="text-xs text-rose-600 mt-0.5">{error}</p>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={fetchStats}>
            Retry
          </Button>
        </div>
      )}

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Employees"
          value={stats?.total_employees ?? 0}
          subtext="Active workforce database"
          icon={<Users className="w-5 h-5" />}
          accentColor="slate"
          isLoading={isLoading}
        />
        <StatCard
          label="Active Employees"
          value={stats?.active_employees ?? 0}
          subtext={`${
            stats?.total_employees
              ? Math.round((stats.active_employees / stats.total_employees) * 100)
              : 0
          }% operational rate`}
          icon={<UserCheck className="w-5 h-5" />}
          accentColor="emerald"
          isLoading={isLoading}
        />
        <StatCard
          label="Inactive / On Leave"
          value={(stats?.inactive_employees ?? 0) + (stats?.on_leave_employees ?? 0)}
          subtext={`${stats?.on_leave_employees ?? 0} on approved leave`}
          icon={<UserX className="w-5 h-5" />}
          accentColor="amber"
          isLoading={isLoading}
        />
        <StatCard
          label="Departments"
          value={stats?.departments_count ?? 0}
          subtext="Organizational divisions"
          icon={<Building className="w-5 h-5" />}
          accentColor="blue"
          isLoading={isLoading}
        />
      </div>

      {/* Dashboard Visual Distribution & Recent Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DepartmentChart
          distribution={stats?.department_distribution ?? []}
          totalEmployees={stats?.total_employees ?? 0}
        />
        <RecentEmployees
          employees={stats?.recent_employees ?? []}
          onView={handleViewEmployee}
        />
      </div>

      {/* Slide-Over Detail Modal */}
      <EmployeeDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        employee={selectedEmployee}
        onEdit={(emp) => {
          setIsDetailOpen(false);
          handleEditEmployee(emp);
        }}
        onDelete={(emp) => {
          setIsDetailOpen(false);
          setDeletingEmployee(emp);
        }}
      />

      {/* Form Modal for Add / Edit */}
      <EmployeeFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingEmployee(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingEmployee}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deletingEmployee}
        onClose={() => setDeletingEmployee(null)}
        onConfirm={handleDeleteConfirm}
        employeeName={deletingEmployee?.full_name}
        isLoading={isDeleting}
      />
    </div>
  );
};
