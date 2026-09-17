import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Mail,
  Phone,
  Building,
  Briefcase,
  DollarSign,
  Calendar,
  Clock,
  Edit2,
  Trash2,
} from 'lucide-react';
import type { Employee } from '../../types/employee';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface EmployeeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  isOpen,
  onClose,
  employee,
  onEdit,
  onDelete,
}) => {
  if (!employee) return null;

  const formattedSalary = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(Number(employee.salary || 0));

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs"
            aria-hidden="true"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg bg-white rounded-2xl border border-slate-200/90 shadow-2xl z-10 overflow-hidden"
          >
            {/* Header Hero */}
            <div className="bg-gradient-to-b from-slate-50 to-white px-6 pt-6 pb-5 border-b border-slate-100 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white font-semibold text-lg flex items-center justify-center shadow-sm">
                  {employee.full_name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900 leading-tight">
                      {employee.full_name}
                    </h2>
                    <Badge status={employee.status} size="sm" />
                  </div>
                  <p className="text-xs text-slate-500 font-mono mt-0.5 font-medium">
                    {employee.employee_id} • {employee.designation}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                aria-label="Close details"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body Info Grid */}
            <div className="p-6 space-y-5 text-left">
              {/* Contact Information */}
              <div>
                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
                  Contact Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10px] text-slate-400 font-medium">Email</p>
                      <p className="text-xs font-semibold text-slate-800 truncate">
                        {employee.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10px] text-slate-400 font-medium">Phone</p>
                      <p className="text-xs font-semibold text-slate-800 truncate">
                        {employee.phone}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Employment Information */}
              <div>
                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
                  Employment & Compensation
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                      <Building className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-medium">Department</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-800 truncate">
                      {employee.department}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                      <Briefcase className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-medium">Role</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-800 truncate">
                      {employee.designation}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                      <DollarSign className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-medium">Salary</span>
                    </div>
                    <p className="text-xs font-semibold text-emerald-700">
                      {formattedSalary}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dates & Records */}
              <div>
                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
                  Record Metadata
                </h4>
                <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100 text-xs text-slate-600 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> Joining Date:
                    </span>
                    <span className="font-medium text-slate-800">{employee.joining_date}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> Record Created:
                    </span>
                    <span className="font-medium text-slate-700">{employee.created_at}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> Last Updated:
                    </span>
                    <span className="font-medium text-slate-700">{employee.updated_at}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-4 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between">
              <Button
                variant="danger"
                size="sm"
                icon={<Trash2 className="w-3.5 h-3.5" />}
                onClick={() => {
                  onClose();
                  onDelete(employee);
                }}
              >
                Delete Record
              </Button>

              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" onClick={onClose}>
                  Close
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Edit2 className="w-3.5 h-3.5" />}
                  onClick={() => {
                    onClose();
                    onEdit(employee);
                  }}
                >
                  Edit Employee
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
