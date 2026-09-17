import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

export const AppShell: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Determine page titles based on current route
  const getPageInfo = () => {
    const path = location.pathname;
    if (path.startsWith('/dashboard')) {
      return {
        title: 'Dashboard',
        subtitle: 'Overview of employee operations and workforce records.',
      };
    }
    if (path.startsWith('/employees')) {
      return {
        title: 'Employees',
        subtitle: 'Manage employee records and organizational information.',
      };
    }
    if (path.startsWith('/settings')) {
      return {
        title: 'Settings',
        subtitle: 'Application environment, API status, and database maintenance.',
      };
    }
    return { title: 'EMS Portal', subtitle: '' };
  };

  const { title, subtitle } = getPageInfo();

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          onMenuToggle={() => setIsMobileMenuOpen(true)}
          pageTitle={title}
          pageSubtitle={subtitle}
        />
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
