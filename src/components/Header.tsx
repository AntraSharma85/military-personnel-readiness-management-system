import React from 'react';
import { Shield, AlertTriangle, RefreshCw, Radio, Award } from 'lucide-react';
import { SystemSettings, DashboardStats } from '../types';

interface HeaderProps {
  stats: DashboardStats | null;
  settings: SystemSettings | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  stats,
  settings,
  activeTab,
  setActiveTab,
  onResetData
}) => {
  const isShortage = stats?.isShortageAlert || false;

  return (
    <header className="bg-slate-950 border-b border-emerald-900/60 sticky top-0 z-40 shadow-xl">
      {/* Top Ticker / Status Bar */}
      <div className="bg-slate-900 border-b border-emerald-900/30 px-4 py-1.5 flex flex-wrap items-center justify-between text-xs font-mono">
        <div className="flex items-center space-x-3 text-slate-300">
          <span className="flex items-center text-emerald-400 font-bold uppercase tracking-wider">
            <Radio className="w-3.5 h-3.5 mr-1.5 animate-pulse text-emerald-500" />
            {settings?.unitName || '7th Tactical Readiness Battalion'}
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">CO: <strong className="text-slate-200">{settings?.commandingOfficerName || 'Col. Vance Sterling'}</strong></span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-400">STATUS:</span>
            {isShortage ? (
              <span className="bg-red-950/80 text-red-400 border border-red-700/60 px-2 py-0.5 rounded flex items-center font-bold tracking-wider animate-pulse">
                <AlertTriangle className="w-3 h-3 mr-1 text-red-500" />
                SHORTAGE ALERT
              </span>
            ) : (
              <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-700/60 px-2 py-0.5 rounded flex items-center font-bold tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-ping"></span>
                READINESS CLEAR ({stats?.readinessPercentage || 0}%)
              </span>
            )}
          </div>

          <button
            onClick={onResetData}
            title="Reset system database to default military seed data"
            className="text-slate-400 hover:text-emerald-400 transition flex items-center space-x-1 px-2 py-0.5 rounded hover:bg-slate-800"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset Data</span>
          </button>
        </div>
      </div>

      {/* Main Command Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-950 border border-emerald-600/50 flex items-center justify-center text-emerald-400 shadow-inner">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white font-mono uppercase">
                SMART LEAVE & DUTY COMMAND
              </h1>
              <span className="bg-emerald-900/40 text-emerald-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-emerald-700/50">
                v2.4 TAC
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans">
              Automated Manpower Threshold & Personnel Readiness System
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center bg-slate-900/90 p-1 rounded-lg border border-slate-800 space-x-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-mono font-medium transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-emerald-800/80 text-emerald-100 shadow border border-emerald-500/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span>📊</span>
            <span>DASHBOARD</span>
          </button>

          <button
            onClick={() => setActiveTab('personnel')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-mono font-medium transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'personnel'
                ? 'bg-emerald-800/80 text-emerald-100 shadow border border-emerald-500/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span>👥</span>
            <span>PERSONNEL</span>
            {stats && (
              <span className="bg-slate-800 text-slate-300 text-[10px] px-1.5 py-0.2 rounded-full">
                {stats.totalPersonnel}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('leaves')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-mono font-medium transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'leaves'
                ? 'bg-emerald-800/80 text-emerald-100 shadow border border-emerald-500/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span>📄</span>
            <span>LEAVE REQUESTS</span>
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-mono font-medium transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'simulator'
                ? 'bg-emerald-800/80 text-emerald-100 shadow border border-emerald-500/50'
                : 'text-amber-400 hover:text-amber-200 hover:bg-slate-800/60'
            }`}
          >
            <span>⚡</span>
            <span>IMPACT SIMULATOR</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-mono font-medium transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-emerald-800/80 text-emerald-100 shadow border border-emerald-500/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span>⚙️</span>
            <span>THRESHOLDS</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
