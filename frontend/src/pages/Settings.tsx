import React, { useState, useEffect } from 'react';
import {
  Server,
  Database,
  Code2,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { api, apiClient } from '../services/api';
import { Button } from '../components/ui/Button';
import { useToast } from '../context/ToastContext';

export const Settings: React.FC = () => {
  const [apiStatus, setApiStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [employeeCount, setEmployeeCount] = useState<number | null>(null);
  const { success, error: toastError } = useToast();

  const checkConnection = async () => {
    setApiStatus('checking');
    try {
      const stats = await api.getDashboardStats();
      setEmployeeCount(stats.total_employees);
      setApiStatus('connected');
    } catch {
      setApiStatus('error');
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const handleTestPing = async () => {
    try {
      await apiClient.get('/employees/');
      success('REST API handshake successful! Response code: 200 OK');
      checkConnection();
    } catch {
      toastError('REST API unreachable. Ensure Django server is running on port 8000.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">System & Environment</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Application configuration, runtime diagnostics, and architecture specifications.
        </p>
      </div>

      {/* System Status Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
              apiStatus === 'connected'
                ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                : apiStatus === 'checking'
                ? 'bg-amber-50 text-amber-600 border-amber-100'
                : 'bg-rose-50 text-rose-600 border-rose-100'
            }`}
          >
            <Server className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-900">Django REST API Backend</h3>
              <span
                className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${
                  apiStatus === 'connected'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : apiStatus === 'checking'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}
              >
                {apiStatus === 'connected' ? 'Connected' : apiStatus === 'checking' ? 'Checking' : 'Disconnected'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Target endpoint: <span className="font-mono">http://127.0.0.1:8000/api/</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={handleTestPing} icon={<RefreshCw className="w-3.5 h-3.5" />}>
            Test API Ping
          </Button>
          <a
            href="http://127.0.0.1:8000/admin/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <span>Django Admin</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Tech Stack Specs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Frontend Layer */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2.5 text-slate-900 font-semibold text-sm">
            <Code2 className="w-4 h-4 text-blue-600" />
            <span>Frontend Architecture</span>
          </div>
          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-400">Library / Runtime:</span>
              <span className="font-medium text-slate-800">React 19 + TypeScript</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-400">Bundler:</span>
              <span className="font-medium text-slate-800">Vite 8</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-400">Styling Engine:</span>
              <span className="font-medium text-slate-800">Tailwind CSS (Apple Theme)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-400">Animations:</span>
              <span className="font-medium text-slate-800">Framer Motion (Micro-interactions)</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">HTTP Client:</span>
              <span className="font-medium text-slate-800">Axios Service Layer</span>
            </div>
          </div>
        </div>

        {/* Backend & Persistence */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2.5 text-slate-900 font-semibold text-sm">
            <Database className="w-4 h-4 text-emerald-600" />
            <span>Backend & Persistence</span>
          </div>
          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-400">Framework:</span>
              <span className="font-medium text-slate-800">Django 6.1 (Python 3.14)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-400">API Toolkit:</span>
              <span className="font-medium text-slate-800">Django REST Framework 3.18</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-400">Database Engine:</span>
              <span className="font-medium text-slate-800">SQLite 3 (Django ORM)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-400">Active Records:</span>
              <span className="font-medium text-slate-800">
                {employeeCount !== null ? `${employeeCount} Employees` : 'Connecting...'}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">CORS Policy:</span>
              <span className="font-medium text-slate-800">Allowed for localhost:5173</span>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance / SOP Verification Checklist */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-semibold text-slate-900">SOP Compliance Checklist</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Create (POST /api/employees/)</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Read All & One (GET /api/employees/)</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Update (PUT/PATCH /api/employees/&lt;id&gt;/)</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Delete with custom modal confirmation</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Dual validation (Client & Django ORM)</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Search & Department/Status filtering</span>
          </div>
        </div>
      </div>
    </div>
  );
};
