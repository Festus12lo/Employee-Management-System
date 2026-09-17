import React from 'react';
import { Users, SearchX } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  isFiltered?: boolean;
  onResetFilters?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No employees found',
  description = 'Add your first employee to get started with record management.',
  icon,
  actionLabel,
  onAction,
  isFiltered = false,
  onResetFilters,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-400 mb-3.5 shadow-xs">
        {icon || (isFiltered ? <SearchX className="w-6 h-6" /> : <Users className="w-6 h-6" />)}
      </div>
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <p className="text-xs text-slate-500 max-w-sm mt-1 mb-5 leading-relaxed">{description}</p>
      <div className="flex items-center gap-2">
        {isFiltered && onResetFilters && (
          <Button variant="secondary" size="sm" onClick={onResetFilters}>
            Clear Filters
          </Button>
        )}
        {actionLabel && onAction && (
          <Button variant="primary" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};
