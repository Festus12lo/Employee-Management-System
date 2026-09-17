import React, { useState, useEffect, useCallback } from 'react';
import { Plus, RefreshCw, AlertCircle } from 'lucide-react';
import { api, formatApiError } from '../services/api';
import type { Employee, EmployeeInput, EmployeeFiltersState } from '../types/employee';
import { Button } from '../components/ui/Button';
import { TableSkeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmployeeFilters } from '../components/employees/EmployeeFilters';
import { EmployeeTable } from '../components/employees/EmployeeTable';
import { EmployeeFormModal } from '../components/employees/EmployeeFormModal';
import { EmployeeDetailModal } from '../components/employees/EmployeeDetailModal';
import { useToast } from '../context/ToastContext';

export const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [filters, setFilters] = useState<EmployeeFiltersState>({
    search: '',
    department: 'All',
    status: 'All',
    ordering: '-created_at',
  });

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { success, error: toastError } = useToast();

  const fetchEmployees = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getEmployees(filters);
      setEmployees(data);
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleResetFilters = () => {
    setFilters({
      search: '',
      department: 'All',
      status: 'All',
      ordering: '-created_at',
    });
  };

  const handleCreate = () => {
    setEditingEmployee(null);
    setIsFormOpen(true);
  };

  const handleView = (emp: Employee) => {
    setSelectedEmployee(emp);
    setIsDetailOpen(true);
  };

  const handleEdit = (emp: Employee) => {
    setEditingEmployee(emp);
    setIsFormOpen(true);
  };

  const handleDeleteTrigger = (emp: Employee) => {
    setDeletingEmployee(emp);
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
      fetchEmployees();
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
      fetchEmployees();
    } catch (err) {
      toastError(formatApiError(err));
    } finally {
      setIsDeleting(false);
    }
  };

  const isFiltered =
    filters.search !== '' ||
    filters.department !== 'All' ||
    filters.status !== 'All' ||
    filters.ordering !== '-created_at';

  return (
    <div className="space-y-6">
      {/* Header with Title and Primary CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Employees</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage employee records and organizational information.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={fetchEmployees}
            isLoading={isLoading}
            icon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleCreate}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Employee
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <EmployeeFilters
        filters={filters}
        onChange={setFilters}
        onReset={handleResetFilters}
        totalCount={employees.length}
      />

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <h4 className="text-xs font-semibold text-rose-900">Unable to load employees</h4>
              <p className="text-xs text-rose-600 mt-0.5">{error}</p>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={fetchEmployees}>
            Retry
          </Button>
        </div>
      )}

      {/* Main Table / Loading / Empty Content */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
          <TableSkeleton rows={6} />
        </div>
      ) : employees.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <EmptyState
            title={isFiltered ? 'No matching employees' : 'No employees found'}
            description={
              isFiltered
                ? 'Try adjusting your search criteria or clearing selected filters.'
                : 'Add your first employee to get started with record management.'
            }
            isFiltered={isFiltered}
            onResetFilters={handleResetFilters}
            actionLabel={!isFiltered ? 'Add Employee' : undefined}
            onAction={!isFiltered ? handleCreate : undefined}
          />
        </div>
      ) : (
        <EmployeeTable
          employees={employees}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDeleteTrigger}
        />
      )}

      {/* Add / Edit Form Modal */}
      <EmployeeFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingEmployee(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingEmployee}
      />

      {/* Detail View Slide-Over */}
      <EmployeeDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        employee={selectedEmployee}
        onEdit={(emp) => {
          setIsDetailOpen(false);
          handleEdit(emp);
        }}
        onDelete={(emp) => {
          setIsDetailOpen(false);
          handleDeleteTrigger(emp);
        }}
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
