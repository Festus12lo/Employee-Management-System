import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import type { Employee, EmployeeInput, Department, EmployeeStatus } from '../../types/employee';

interface EmployeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EmployeeInput) => Promise<void>;
  initialData?: Employee | null;
  isLoading?: boolean;
}

const DEPARTMENT_OPTIONS = [
  { value: '', label: 'Select Department...' },
  { value: 'Engineering', label: 'Engineering' },
  { value: 'IT', label: 'IT' },
  { value: 'Human Resources', label: 'Human Resources' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Sales', label: 'Sales' },
  { value: 'Operations', label: 'Operations' },
];

const STATUS_OPTIONS = [
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' },
  { value: 'On Leave', label: 'On Leave' },
];

export const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const isEditing = !!initialData;

  const [formData, setFormData] = useState<EmployeeInput>({
    employee_id: '',
    full_name: '',
    email: '',
    phone: '',
    department: '',
    designation: '',
    salary: '',
    joining_date: new Date().toISOString().split('T')[0],
    status: 'Active',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        employee_id: initialData.employee_id,
        full_name: initialData.full_name,
        email: initialData.email,
        phone: initialData.phone,
        department: initialData.department,
        designation: initialData.designation,
        salary: initialData.salary,
        joining_date: initialData.joining_date,
        status: initialData.status,
      });
    } else {
      setFormData({
        employee_id: '',
        full_name: '',
        email: '',
        phone: '',
        department: '',
        designation: '',
        salary: '',
        joining_date: new Date().toISOString().split('T')[0],
        status: 'Active',
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleChange = (field: keyof EmployeeInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required.';
    if (!formData.employee_id.trim()) newErrors.employee_id = 'Employee ID is required.';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (formData.phone.replace(/\D/g, '').length < 7) {
      newErrors.phone = 'Phone number must contain at least 7 digits.';
    }

    if (!formData.department) newErrors.department = 'Department selection is required.';
    if (!formData.designation.trim()) newErrors.designation = 'Designation is required.';

    if (formData.salary === '' || formData.salary === null || formData.salary === undefined) {
      newErrors.salary = 'Salary amount is required.';
    } else if (Number(formData.salary) < 0) {
      newErrors.salary = 'Salary must be a non-negative number.';
    }

    if (!formData.joining_date) newErrors.joining_date = 'Joining date is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await onSubmit(formData);
      onClose();
    } catch (err: any) {
      // If server returned field validation errors
      if (err.response?.data && typeof err.response.data === 'object') {
        const serverErrors: Record<string, string> = {};
        for (const [key, val] of Object.entries(err.response.data)) {
          serverErrors[key] = Array.isArray(val) ? val.join(' ') : String(val);
        }
        setErrors(serverErrors);
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Employee Record' : 'Add New Employee'}
      subtitle={
        isEditing
          ? `Updating details for ${initialData?.full_name} (${initialData?.employee_id})`
          : 'Enter personal and organizational employment details.'
      }
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Personal Information */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 pb-1 border-b border-slate-100">
            1. Personal Information
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input
                label="Full Name"
                placeholder="e.g. Priya Sharma"
                value={formData.full_name}
                onChange={(e) => handleChange('full_name', e.target.value)}
                error={errors.full_name}
                required
              />
            </div>
            <Input
              label="Email Address"
              type="email"
              placeholder="e.g. priya.sharma@company.com"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={errors.email}
              required
            />
            <Input
              label="Phone Number"
              type="tel"
              placeholder="e.g. +91 98765 43210"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              error={errors.phone}
              required
            />
          </div>
        </div>

        {/* Section 2: Employment Information */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 pb-1 border-b border-slate-100">
            2. Employment Information
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Employee ID"
              placeholder="e.g. EMP011"
              value={formData.employee_id}
              onChange={(e) => handleChange('employee_id', e.target.value)}
              error={errors.employee_id}
              disabled={isEditing}
              helperText={isEditing ? 'Employee ID cannot be changed once created.' : undefined}
              required
            />

            <Select
              label="Department"
              value={formData.department}
              onChange={(e) => handleChange('department', e.target.value as Department)}
              options={DEPARTMENT_OPTIONS}
              error={errors.department}
              required
            />

            <Input
              label="Designation / Role"
              placeholder="e.g. Senior Software Engineer"
              value={formData.designation}
              onChange={(e) => handleChange('designation', e.target.value)}
              error={errors.designation}
              required
            />

            <Input
              label="Salary (USD / Base)"
              type="number"
              step="0.01"
              min="0"
              placeholder="e.g. 75000.00"
              value={formData.salary}
              onChange={(e) => handleChange('salary', e.target.value)}
              error={errors.salary}
              required
            />

            <Input
              label="Joining Date"
              type="date"
              value={formData.joining_date}
              onChange={(e) => handleChange('joining_date', e.target.value)}
              error={errors.joining_date}
              required
            />

            <Select
              label="Employment Status"
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value as EmployeeStatus)}
              options={STATUS_OPTIONS}
              error={errors.status}
              required
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {isEditing ? 'Save Changes' : 'Create Employee'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
