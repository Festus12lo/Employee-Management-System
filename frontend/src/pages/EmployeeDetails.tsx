import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  Building,
  Briefcase,
  DollarSign,
  Calendar,
  Clock,
  Edit2,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import { api, formatApiError } from '../services/api';
import type { Employee, EmployeeInput } from '../types/employee';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmployeeFormModal } from '../components/employees/EmployeeFormModal';
import { useToast } from '../context/ToastContext';

export const EmployeeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchEmployee = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getEmployee(id);
      setEmployee(data);
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEmployee();
  }, [fetchEmployee]);

  const handleUpdate = async (data: EmployeeInput) => {
    if (!employee) return;
    try {
      const updated = await api.updateEmployee(employee.id, data);
      setEmployee(updated);
      success('Employee record updated successfully.');
      setIsEditOpen(false);
    } catch (err) {
      toastError(formatApiError(err));
      throw err;
    }
  };

  const handleDelete = async () => {
    if (!employee) return;
    setIsDeleting(true);
    try {
      await api.deleteEmployee(employee.id);
      success('Employee deleted successfully.');
      navigate('/employees');
    } catch (err) {
      toastError(formatApiError(err));
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-8 w-40 rounded-xl" />
        <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton className="w-16 h-16 rounded-2xl" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="max-w-xl mx-auto my-12 bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4 shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-900">Employee Record Not Found</h3>
        <p className="text-xs text-slate-500">{error || 'The requested employee ID does not exist.'}</p>
        <div className="pt-2">
          <Link to="/employees">
            <Button variant="secondary" size="sm" icon={<ArrowLeft className="w-3.5 h-3.5" />}>
              Back to Employees Directory
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const formattedSalary = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(Number(employee.salary || 0));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Link */}
      <div>
        <Link
          to="/employees"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Employees</span>
        </Link>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Header Strip */}
        <div className="bg-slate-50/70 px-6 sm:px-8 py-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white font-bold text-xl flex items-center justify-center shadow-xs">
              {employee.full_name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-bold text-slate-900">{employee.full_name}</h1>
                <Badge status={employee.status} />
              </div>
              <p className="text-xs text-slate-500 font-mono mt-1 font-medium">
                {employee.employee_id} • {employee.designation} • {employee.department}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={<Edit2 className="w-3.5 h-3.5" />}
              onClick={() => setIsEditOpen(true)}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={<Trash2 className="w-3.5 h-3.5" />}
              onClick={() => setIsDeleteOpen(true)}
            >
              Delete
            </Button>
          </div>
        </div>

        {/* Content Sections */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Contact Details */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-400 uppercase font-medium">Work Email</p>
                  <p className="text-xs font-semibold text-slate-900 truncate">{employee.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-400 uppercase font-medium">Contact Number</p>
                  <p className="text-xs font-semibold text-slate-900 truncate">{employee.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Organizational Position */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Employment & Role
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                  <Building className="w-3.5 h-3.5" />
                  <span>Department</span>
                </div>
                <p className="text-sm font-semibold text-slate-900">{employee.department}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Designation</span>
                </div>
                <p className="text-sm font-semibold text-slate-900">{employee.designation}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Base Compensation</span>
                </div>
                <p className="text-sm font-semibold text-emerald-700">{formattedSalary}</p>
              </div>
            </div>
          </div>

          {/* Record History */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Lifecycle Metadata
            </h3>
            <div className="p-4 rounded-xl bg-slate-50/60 border border-slate-100 text-xs text-slate-600 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Date Joined:
                </span>
                <span className="font-semibold text-slate-800">{employee.joining_date}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Record Registered:
                </span>
                <span className="font-medium text-slate-700">{employee.created_at}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Record Modified:
                </span>
                <span className="font-medium text-slate-700">{employee.updated_at}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form Modal */}
      <EmployeeFormModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleUpdate}
        initialData={employee}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        employeeName={employee.full_name}
        isLoading={isDeleting}
      />
    </div>
  );
};
