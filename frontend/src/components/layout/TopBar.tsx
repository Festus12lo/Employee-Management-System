import React from 'react';
import { Menu, Bell, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface TopBarProps {
  onMenuToggle?: () => void;
  pageTitle?: string;
  pageSubtitle?: string;
  actions?: React.ReactNode;
}

export const TopBar: React.FC<TopBarProps> = ({
  onMenuToggle,
  pageTitle,
  pageSubtitle,
  actions,
}) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-20 bg-white/85 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between transition-all">
      <div className="flex items-center gap-3">
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div>
          {pageTitle && (
            <h1 className="text-base sm:text-lg font-semibold text-slate-900 tracking-tight leading-tight">
              {pageTitle}
            </h1>
          )}
          {pageSubtitle && (
            <p className="text-xs text-slate-500 font-normal hidden sm:block">{pageSubtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {actions && <div className="flex items-center gap-2">{actions}</div>}

        <div className="h-4 w-px bg-slate-200 hidden sm:block mx-1" />

        {/* Live Database/API indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200/60 text-[11px] font-medium text-slate-600">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>System Online</span>
        </div>

        {/* Notifications Icon button */}
        <button
          className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors relative"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-blue-600 rounded-full" />
        </button>

        {/* Profile Avatar */}
        <div className="flex items-center gap-2 pl-1">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-medium text-xs flex items-center justify-center ring-2 ring-slate-100">
            {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AD'}
          </div>
        </div>
      </div>
    </header>
  );
};
