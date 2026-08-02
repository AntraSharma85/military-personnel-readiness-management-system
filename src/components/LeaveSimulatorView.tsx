import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Users, 
  UserMinus, 
  Activity, 
  Search, 
  RefreshCw, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Zap,
  Info,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Personnel, LeaveRequest, LeaveSimulationResult, UnitSimulationImpact } from '../types';

interface LeaveSimulatorViewProps {
  personnelList: Personnel[];
  pendingLeaves: LeaveRequest[];
  onOpenLeaveModal?: () => void;
}

export const LeaveSimulatorView: React.FC<LeaveSimulatorViewProps> = ({
  personnelList,
  pendingLeaves,
  onOpenLeaveModal
}) => {
  const [selectedPersonnelIds, setSelectedPersonnelIds] = useState<string[]>([]);
  const [simulationResult, setSimulationResult] = useState<LeaveSimulationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [unitFilter, setUnitFilter] = useState<string>('All');

  // Available units
  const units = ['All', ...Array.from(new Set(personnelList.map(p => p.unit)))];

  // Auto-run simulation whenever selected personnel list changes
  useEffect(() => {
    runSimulation(selectedPersonnelIds);
  }, [selectedPersonnelIds]);

  const runSimulation = async (ids: string[]) => {
    setLoading(true);
    try {
      const res = await fetch('/api/simulate-leave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ personnelIds: ids })
      });
      if (res.ok) {
        const data = await res.json();
        setSimulationResult(data);
      }
    } catch (err) {
      console.error('Failed to execute leave simulation:', err);
    } finally {
      setLoading(false);
    }
  };

  const togglePersonnelSelection = (id: string) => {
    setSelectedPersonnelIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const selectAllPendingLeaves = () => {
    const pendingIds = pendingLeaves.map(l => l.personnelId);
    // Combine unique
    setSelectedPersonnelIds(Array.from(new Set([...selectedPersonnelIds, ...pendingIds])));
  };

  const clearSelection = () => {
    setSelectedPersonnelIds([]);
  };

  const filteredPersonnel = personnelList.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.rank.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUnit = unitFilter === 'All' || p.unit === unitFilter;
    return matchesSearch && matchesUnit;
  });

  // Helper for color classes
  const getIndicatorColorClasses = (indicator: 'GREEN' | 'YELLOW' | 'RED') => {
    switch (indicator) {
      case 'GREEN':
        return {
          bg: 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          bar: 'bg-emerald-500',
          text: 'text-emerald-400',
          icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />
        };
      case 'YELLOW':
        return {
          bg: 'bg-amber-950/40 border-amber-500/40 text-amber-400',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
          bar: 'bg-amber-500',
          text: 'text-amber-400',
          icon: <AlertTriangle className="w-5 h-5 text-amber-400" />
        };
      case 'RED':
        return {
          bg: 'bg-rose-950/40 border-rose-500/40 text-rose-400',
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
          bar: 'bg-rose-500',
          text: 'text-rose-400',
          icon: <ShieldAlert className="w-5 h-5 text-rose-400 animate-pulse" />
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none">
          <Activity className="w-80 h-80 text-emerald-400" />
        </div>
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-1">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Tactical Operations & Manpower Impact Matrix</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-100 font-mono">
              LEAVE IMPACT SIMULATOR
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Simulate prospective personnel leaves in real-time. Calculate unit readiness scores (0-100%), 
              detect threshold breaches, and preview unit strength indicators before granting leave approvals.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {pendingLeaves.length > 0 && (
              <button
                onClick={selectAllPendingLeaves}
                className="px-3.5 py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center space-x-2 transition-all shadow-sm"
              >
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span>Simulate All Pending Leaves ({pendingLeaves.length})</span>
              </button>
            )}
            
            {selectedPersonnelIds.length > 0 && (
              <button
                onClick={clearSelection}
                className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 text-xs font-semibold flex items-center space-x-1.5 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Simulation</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Simulation Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Personnel Selector Panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-5 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-emerald-400" />
                <h3 className="font-mono text-base font-bold text-slate-200">
                  Select Personnel for Simulation
                </h3>
              </div>
              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-slate-700/80 text-emerald-400 border border-slate-600">
                {selectedPersonnelIds.length} Selected
              </span>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search name/rank..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <select
                value={unitFilter}
                onChange={e => setUnitFilter(e.target.value)}
                className="bg-slate-900/90 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                {units.map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>

            {/* Personnel Checklist */}
            <div className="max-h-[500px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {filteredPersonnel.map(p => {
                const isSelected = selectedPersonnelIds.includes(p.id);
                const hasPendingLeave = pendingLeaves.some(l => l.personnelId === p.id);

                return (
                  <div
                    key={p.id}
                    onClick={() => togglePersonnelSelection(p.id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected 
                        ? 'bg-emerald-950/40 border-emerald-500/60 shadow-sm' 
                        : 'bg-slate-900/60 border-slate-700/60 hover:bg-slate-700/50 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                        isSelected 
                          ? 'bg-emerald-500 border-emerald-400 text-slate-950' 
                          : 'border-slate-600 bg-slate-800'
                      }`}>
                        {isSelected && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-sm text-slate-100">{p.rank} {p.name}</span>
                          {hasPendingLeave && (
                            <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.5 rounded font-mono font-semibold">
                              Pending Leave
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400 flex items-center space-x-2">
                          <span>{p.unit}</span>
                          <span>•</span>
                          <span className="text-slate-300">{p.role}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        p.status === 'On Duty' ? 'bg-emerald-900/40 text-emerald-400 border-emerald-500/30' :
                        p.status === 'On Leave' ? 'bg-amber-900/40 text-amber-400 border-amber-500/30' :
                        'bg-blue-900/40 text-blue-400 border-blue-500/30'
                      }`}>
                        {p.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Readiness Score & Unit Impact Matrix */}
        <div className="lg:col-span-7 space-y-6">
          {loading ? (
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-12 text-center flex flex-col items-center justify-center">
              <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mb-3" />
              <p className="text-sm font-mono text-slate-300">Calculating readiness scores & unit impact matrix...</p>
            </div>
          ) : simulationResult ? (
            <>
              {/* Overall Readiness Score Display */}
              {(() => {
                const styles = getIndicatorColorClasses(simulationResult.overallIndicator);
                return (
                  <div className={`border rounded-xl p-6 shadow-lg ${styles.bg} transition-all`}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-700/60 pb-5">
                      <div className="flex items-center space-x-3">
                        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/80">
                          {styles.icon}
                        </div>
                        <div>
                          <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold">
                            Battalion Operational Readiness
                          </span>
                          <div className="flex items-center space-x-2 mt-0.5">
                            <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded border uppercase ${styles.badge}`}>
                              {simulationResult.overallIndicator} INDICATOR
                            </span>
                            <span className="text-sm font-semibold text-slate-200">
                              {simulationResult.overallStatusText}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Score Badge */}
                      <div className="flex items-center space-x-3 bg-slate-900/90 border border-slate-700 rounded-xl px-5 py-3 shadow-inner">
                        <div className="text-right">
                          <div className="text-[10px] text-slate-400 font-mono uppercase">Readiness Score</div>
                          <div className={`text-3xl font-extrabold font-mono ${styles.text}`}>
                            {simulationResult.overallReadinessScore}%
                          </div>
                        </div>

                        <div className="h-9 w-px bg-slate-700" />

                        <div>
                          <div className="text-[10px] text-slate-400 font-mono uppercase">Baseline</div>
                          <div className="text-lg font-bold font-mono text-slate-300">
                            {simulationResult.baselineReadinessScore}%
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Comparative Stats Bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
                      <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                        <div className="text-[11px] text-slate-400">Baseline Duty</div>
                        <div className="text-lg font-mono font-bold text-slate-100">
                          {simulationResult.baselineActiveCount} <span className="text-xs text-slate-400 font-normal">/ {simulationResult.totalPersonnel}</span>
                        </div>
                      </div>

                      <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                        <div className="text-[11px] text-slate-400">Simulated Duty</div>
                        <div className={`text-lg font-mono font-bold ${styles.text}`}>
                          {simulationResult.simulatedActiveCount} <span className="text-xs text-slate-400 font-normal">/ {simulationResult.totalPersonnel}</span>
                        </div>
                      </div>

                      <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                        <div className="text-[11px] text-slate-400">Min. Required</div>
                        <div className="text-lg font-mono font-bold text-slate-200">
                          {simulationResult.minimumRequired} <span className="text-xs text-slate-400 font-normal">Active</span>
                        </div>
                      </div>

                      <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                        <div className="text-[11px] text-slate-400">Simulated Absences</div>
                        <div className="text-lg font-mono font-bold text-amber-400">
                          -{simulationResult.simulatedLeaveCount} <span className="text-xs text-slate-400 font-normal">Personnel</span>
                        </div>
                      </div>
                    </div>

                    {/* Overall Progress Bar */}
                    <div className="mt-5">
                      <div className="flex justify-between text-xs text-slate-400 mb-1 font-mono">
                        <span>Readiness Meter</span>
                        <span>{simulationResult.simulatedActiveCount} of {simulationResult.minimumRequired} Min Threshold</span>
                      </div>
                      <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 relative">
                        <div 
                          className={`h-full transition-all duration-500 ${styles.bar}`}
                          style={{ width: `${Math.min(100, simulationResult.overallReadinessScore)}%` }}
                        />
                        {/* Minimum required marker line */}
                        <div 
                          className="absolute top-0 bottom-0 w-0.5 bg-white z-10 shadow"
                          style={{ left: `${Math.round((simulationResult.minimumRequired / simulationResult.totalPersonnel) * 100)}%` }}
                          title={`Required Threshold (${simulationResult.minimumRequired})`}
                        />
                      </div>
                    </div>

                    {/* Warning Alerts */}
                    {simulationResult.warnings.length > 0 && (
                      <div className="mt-5 space-y-2">
                        {simulationResult.warnings.map((warn, idx) => (
                          <div key={idx} className="p-3 bg-rose-950/60 border border-rose-500/50 rounded-lg text-rose-300 text-xs flex items-start space-x-2">
                            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                            <span>{warn}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Unit-by-Unit Readiness Breakdown */}
              <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-5 shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Layers className="w-5 h-5 text-emerald-400" />
                    <h3 className="font-mono text-base font-bold text-slate-200">
                      Unit Readiness & Threshold Breakdown
                    </h3>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    {simulationResult.unitImpacts.length} Units Analyzed
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {simulationResult.unitImpacts.map(unitImpact => {
                    const uStyles = getIndicatorColorClasses(unitImpact.indicator);

                    return (
                      <div 
                        key={unitImpact.unit} 
                        className={`p-4 rounded-xl border bg-slate-900/80 ${
                          unitImpact.indicator === 'RED' ? 'border-rose-500/50 bg-rose-950/20' :
                          unitImpact.indicator === 'YELLOW' ? 'border-amber-500/50 bg-amber-950/20' :
                          'border-slate-700/80'
                        } transition-all`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-sm text-slate-200 font-mono">
                            {unitImpact.unit}
                          </h4>
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${uStyles.badge}`}>
                            {unitImpact.indicator}
                          </span>
                        </div>

                        {/* Readiness Score Bar */}
                        <div className="space-y-1 my-3">
                          <div className="flex justify-between text-xs font-mono">
                            <span className="text-slate-400">Unit Readiness Score</span>
                            <span className={`font-bold ${uStyles.text}`}>{unitImpact.unitReadinessScore}%</span>
                          </div>

                          <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 relative">
                            <div 
                              className={`h-full transition-all duration-300 ${uStyles.bar}`}
                              style={{ width: `${unitImpact.unitReadinessScore}%` }}
                            />
                          </div>
                        </div>

                        {/* Active vs Threshold Numbers */}
                        <div className="flex items-center justify-between text-xs py-1.5 px-2 bg-slate-950/60 rounded border border-slate-800/80 mb-2">
                          <span className="text-slate-400">Simulated Duty:</span>
                          <span className="font-mono font-bold text-slate-200">
                            {unitImpact.simulatedActive} / {unitImpact.totalMembers} Personnel
                          </span>
                          <span className="text-slate-500">•</span>
                          <span className="text-slate-400">Min Req:</span>
                          <span className="font-mono font-semibold text-amber-400">
                            {unitImpact.requiredThreshold}
                          </span>
                        </div>

                        {/* Status Message */}
                        <p className={`text-xs font-mono ${uStyles.text} mt-2`}>
                          {unitImpact.statusMessage}
                        </p>

                        {/* Affected Personnel Badges */}
                        {unitImpact.affectedPersonnel.length > 0 && (
                          <div className="mt-3 pt-2 border-t border-slate-800">
                            <div className="text-[10px] text-slate-400 uppercase font-mono mb-1">
                              Simulated Departures ({unitImpact.affectedPersonnel.length}):
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {unitImpact.affectedPersonnel.map(ap => (
                                <span 
                                  key={ap.id}
                                  className="text-[10px] font-mono bg-slate-800 text-slate-200 border border-slate-700 px-2 py-0.5 rounded flex items-center space-x-1"
                                >
                                  <UserMinus className="w-3 h-3 text-rose-400" />
                                  <span>{ap.rank} {ap.name}</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-12 text-center">
              <Activity className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-300">Select Personnel to Begin Simulation</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                Select one or more personnel from the left panel or click "Simulate All Pending Leaves" to test manpower impact.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
