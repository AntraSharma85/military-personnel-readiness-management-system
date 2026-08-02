import React from 'react';
import { 
  Users, 
  CheckCircle, 
  Calendar, 
  BookOpen, 
  AlertOctagon, 
  ShieldCheck, 
  Plus, 
  FileText, 
  Settings as SettingsIcon,
  ChevronRight,
  UserCheck,
  Zap
} from 'lucide-react';
import { DashboardStats, SystemSettings, Personnel } from '../types';

interface DashboardViewProps {
  stats: DashboardStats | null;
  settings: SystemSettings | null;
  personnelList: Personnel[];
  onOpenAddPersonnel: () => void;
  onOpenSubmitLeave: () => void;
  onNavigateTab: (tab: string) => void;
  onUpdateStatus: (id: string, status: Personnel['status']) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  settings,
  personnelList,
  onOpenAddPersonnel,
  onOpenSubmitLeave,
  onNavigateTab,
  onUpdateStatus
}) => {
  if (!stats || !settings) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mr-3"></div>
        <span>Loading tactical operational telemetry...</span>
      </div>
    );
  }

  const minRequiredCount = settings.minManpowerCount;
  const minRequiredPct = settings.minManpowerPercentage;
  const currentDutyCount = stats.onDuty;
  const totalCount = stats.totalPersonnel;
  const currentPct = stats.readinessPercentage;
  const isShortage = stats.isShortageAlert;

  const onDutyPersonnel = personnelList.filter(p => p.status === 'On Duty');

  return (
    <div className="space-y-6">
      {/* Shortage Warning Banner */}
      {isShortage && (
        <div className="bg-red-950/90 border-2 border-red-600 rounded-xl p-4 sm:p-5 text-red-100 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-pulse">
          <div className="flex items-start space-x-3">
            <div className="p-2.5 bg-red-900/80 rounded-lg border border-red-500/50 text-red-300">
              <AlertOctagon className="w-7 h-7 text-red-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold bg-red-800 text-red-200 px-2 py-0.5 rounded uppercase tracking-wider">
                  TACTICAL DEFCON WARNING
                </span>
                <span className="text-xs text-red-300 font-mono">
                  MIN THRESHOLD VIOLATION
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                Manpower Capacity Below Safety Operational Limit
              </h3>
              <p className="text-xs sm:text-sm text-red-200 mt-0.5">
                Current active duty strength is <strong className="text-white font-mono">{currentDutyCount}</strong> ({currentPct}%), which is lower than required minimum of <strong className="text-white font-mono">{minRequiredCount}</strong> ({minRequiredPct}%).
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('leaves')}
            className="w-full sm:w-auto px-4 py-2 bg-red-800 hover:bg-red-700 text-white font-mono text-xs font-bold rounded-lg border border-red-500 shadow transition flex items-center justify-center space-x-1.5 whitespace-nowrap"
          >
            <span>REVIEW PENDING LEAVES</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Personnel */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-lg relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
              TOTAL PERSONNEL
            </span>
            <div className="p-2 rounded-lg bg-blue-950/60 text-blue-400 border border-blue-800/40">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white font-mono">{stats.totalPersonnel}</span>
            <span className="text-xs text-slate-400 font-mono">100% Registered</span>
          </div>
          <div className="mt-3 text-xs text-slate-400 border-t border-slate-800/80 pt-2 flex items-center justify-between">
            <span>Battalion Strength</span>
            <button 
              onClick={() => onNavigateTab('personnel')}
              className="text-emerald-400 hover:underline flex items-center font-mono text-[11px]"
            >
              View Roster &rarr;
            </button>
          </div>
        </div>

        {/* On Duty */}
        <div className={`bg-slate-900/90 border rounded-xl p-4 sm:p-5 shadow-lg relative overflow-hidden group transition ${
          currentDutyCount < minRequiredCount ? 'border-red-600/80' : 'border-slate-800 hover:border-slate-700'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
              ACTIVE ON DUTY
            </span>
            <div className="p-2 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white font-mono">{stats.onDuty}</span>
            <span className={`text-xs font-mono font-bold ${
              currentDutyCount < minRequiredCount ? 'text-red-400' : 'text-emerald-400'
            }`}>
              {stats.readinessPercentage}% Strength
            </span>
          </div>
          <div className="mt-3 text-xs text-slate-400 border-t border-slate-800/80 pt-2 flex items-center justify-between">
            <span>Threshold: {minRequiredCount} personnel</span>
            {currentDutyCount < minRequiredCount && (
              <span className="text-red-400 font-bold font-mono text-[10px] uppercase">Shortage</span>
            )}
          </div>
        </div>

        {/* On Leave */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-lg relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
              ON LEAVE
            </span>
            <div className="p-2 rounded-lg bg-amber-950/60 text-amber-400 border border-amber-800/40">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white font-mono">{stats.onLeave}</span>
            <span className="text-xs text-amber-400/90 font-mono">
              {totalCount > 0 ? Math.round((stats.onLeave / totalCount) * 100) : 0}% Off-Base
            </span>
          </div>
          <div className="mt-3 text-xs text-slate-400 border-t border-slate-800/80 pt-2 flex items-center justify-between">
            <span>Authorized Absences</span>
            <button 
              onClick={() => onNavigateTab('leaves')}
              className="text-amber-400 hover:underline flex items-center font-mono text-[11px]"
            >
              View Requests &rarr;
            </button>
          </div>
        </div>

        {/* In Training */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-lg relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-purple-400 font-semibold">
              IN TRAINING
            </span>
            <div className="p-2 rounded-lg bg-purple-950/60 text-purple-400 border border-purple-800/40">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white font-mono">{stats.inTraining}</span>
            <span className="text-xs text-purple-300 font-mono">
              {totalCount > 0 ? Math.round((stats.inTraining / totalCount) * 100) : 0}% Skill Dev
            </span>
          </div>
          <div className="mt-3 text-xs text-slate-400 border-t border-slate-800/80 pt-2 flex items-center justify-between">
            <span>Specialized Drills</span>
            <span className="text-purple-400 font-mono text-[10px]">Active Training</span>
          </div>
        </div>
      </div>

      {/* Manpower Readiness Gauge & Quick Action Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Readiness Bar & Threshold Logic Overview */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                MANPOWER READINESS GAUGE & SMART THRESHOLD
              </h2>
            </div>
            <button
              onClick={() => onNavigateTab('settings')}
              className="text-xs text-slate-400 hover:text-emerald-400 transition font-mono flex items-center space-x-1"
            >
              <SettingsIcon className="w-3.5 h-3.5" />
              <span>Configure Thresholds</span>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                <span className="text-slate-300">
                  CURRENT ACTIVE STRENGTH: <strong className="text-emerald-400">{currentDutyCount} / {totalCount}</strong>
                </span>
                <span className={`font-bold ${currentPct < minRequiredPct ? 'text-red-400' : 'text-emerald-400'}`}>
                  {currentPct}% READINESS (REQUIRED: &ge; {minRequiredPct}%)
                </span>
              </div>

              {/* Progress Bar with Safety Indicator */}
              <div className="w-full bg-slate-950 rounded-full h-4 p-0.5 border border-slate-800 relative">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    currentPct < minRequiredPct 
                      ? 'bg-gradient-to-r from-red-600 to-red-500' 
                      : 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400'
                  }`}
                  style={{ width: `${Math.min(currentPct, 100)}%` }}
                />

                {/* Threshold Marker Pin */}
                <div 
                  className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-10 flex flex-col items-center"
                  style={{ left: `${minRequiredPct}%` }}
                  title={`Required Threshold: ${minRequiredPct}%`}
                >
                  <div className="w-2 h-2 bg-amber-400 rotate-45 -mt-1 shadow-glow" />
                </div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>0%</span>
                <span className="text-amber-400 font-bold">Minimum Threshold ({minRequiredPct}%)</span>
                <span>100%</span>
              </div>
            </div>

            {/* Smart Logic Explanatory Box */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3.5 text-xs text-slate-300 font-mono space-y-2">
              <div className="flex items-center text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2"></span>
                AUTOMATED MANPOWER SHORTAGE PREVENTION ACTIVE
              </div>
              <p className="text-slate-400">
                The system dynamically enforces a minimum active count of <strong className="text-white">{minRequiredCount} personnel</strong>. When a leave request is submitted or approved, real-time recalculation verifies if post-approval strength drops below safety capacity.
              </p>
            </div>
          </div>
        </div>

        {/* Right Col: Quick Action Control */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider border-b border-slate-800 pb-3 mb-4">
              QUACK COMMAND ACTIONS
            </h2>

            <div className="space-y-2.5">
              <button
                onClick={onOpenSubmitLeave}
                className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-600 text-white font-mono text-xs font-bold rounded-lg border border-emerald-500 shadow-md transition flex items-center justify-between group"
              >
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-emerald-200" />
                  <span>SUBMIT LEAVE REQUEST</span>
                </div>
                <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </button>

              <button
                onClick={onOpenAddPersonnel}
                className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-750 text-slate-100 font-mono text-xs font-bold rounded-lg border border-slate-700 shadow transition flex items-center justify-between group"
              >
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-slate-300" />
                  <span>ADD NEW PERSONNEL</span>
                </div>
                <Plus className="w-4 h-4 text-slate-400 group-hover:scale-110 transition-transform" />
              </button>

              <button
                onClick={() => onNavigateTab('simulator')}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-950/80 to-slate-800 hover:from-amber-900 text-amber-200 font-mono text-xs font-bold rounded-lg border border-amber-600/60 shadow transition flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span>RUN LEAVE IMPACT SIMULATOR</span>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-400" />
              </button>

              <button
                onClick={() => onNavigateTab('leaves')}
                className="w-full py-2.5 px-4 bg-slate-800/80 hover:bg-slate-800 text-slate-300 font-mono text-xs font-bold rounded-lg border border-slate-700 shadow transition flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>REVIEW LEAVE QUEUE</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 font-mono flex items-center justify-between">
            <span>Auto-Block Shortages:</span>
            <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
              settings.autoBlockShortage 
                ? 'bg-red-950 text-red-400 border border-red-800' 
                : 'bg-amber-950 text-amber-300 border border-amber-800'
            }`}>
              {settings.autoBlockShortage ? 'STRICT ENFORCE' : 'WARNING ONLY'}
            </span>
          </div>
        </div>
      </div>

      {/* Unit Readiness Breakdown Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
        <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider mb-4 flex items-center justify-between">
          <span>UNIT MANPOWER & STRENGTH BREAKDOWN</span>
          <span className="text-xs text-slate-400 font-normal">Updated live from JSON database</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">UNIT / PLATOON</th>
                <th className="py-3 px-4">TOTAL</th>
                <th className="py-3 px-4">ACTIVE ON DUTY</th>
                <th className="py-3 px-4">ON LEAVE</th>
                <th className="py-3 px-4">TRAINING</th>
                <th className="py-3 px-4">REQUIRED MIN</th>
                <th className="py-3 px-4">UNIT STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {stats.unitBreakdown.map((unit) => (
                <tr key={unit.unit} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-bold text-white">{unit.unit}</td>
                  <td className="py-3 px-4">{unit.total}</td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-emerald-400">{unit.onDuty}</span>
                  </td>
                  <td className="py-3 px-4 text-amber-400">{unit.onLeave}</td>
                  <td className="py-3 px-4 text-purple-400">{unit.training}</td>
                  <td className="py-3 px-4 text-slate-400">{unit.required}</td>
                  <td className="py-3 px-4">
                    {unit.isShortage ? (
                      <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800">
                        <AlertOctagon className="w-3 h-3 mr-1" />
                        SHORTAGE
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                        <UserCheck className="w-3 h-3 mr-1" />
                        OPERATIONAL
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Today's Duty Roster Quick View */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              CURRENT ON-DUTY PERSONNEL ROSTER ({onDutyPersonnel.length})
            </h2>
            <p className="text-xs text-slate-400">Personnel currently deployed on active duty</p>
          </div>
          <button
            onClick={() => onNavigateTab('personnel')}
            className="text-xs text-emerald-400 hover:underline font-mono flex items-center space-x-1"
          >
            <span>Manage All Personnel</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {onDutyPersonnel.map((p) => (
            <div key={p.id} className="bg-slate-950 border border-slate-800 rounded-lg p-3 hover:border-emerald-700/60 transition">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">
                    {p.rank}
                  </span>
                  <h4 className="text-sm font-bold text-white mt-1">{p.name}</h4>
                  <p className="text-[11px] text-emerald-400 font-mono">{p.role}</p>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="On Active Duty" />
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>{p.unit}</span>
                <select
                  value={p.status}
                  onChange={(e) => onUpdateStatus(p.id, e.target.value as Personnel['status'])}
                  className="bg-slate-900 border border-slate-700 text-slate-200 text-[10px] rounded px-1.5 py-0.5 focus:border-emerald-500"
                >
                  <option value="On Duty">On Duty</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Training">Training</option>
                  <option value="Off Duty">Off Duty</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
