import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Check, 
  X, 
  AlertTriangle, 
  Clock, 
  Calendar, 
  User, 
  ShieldAlert,
  Trash2,
  CheckCircle,
  XCircle,
  Zap
} from 'lucide-react';
import { LeaveRequest, ShortageImpactCheck, LeaveStatus } from '../types';

interface LeaveManagementViewProps {
  leavesList: LeaveRequest[];
  onOpenSubmitLeave: () => void;
  onCheckImpact: (personnelId: string, startDate: string, endDate: string) => Promise<ShortageImpactCheck>;
  onApproveLeave: (leaveId: string, notes?: string, forceOverride?: boolean) => Promise<{ success: boolean; impact?: ShortageImpactCheck; error?: string }>;
  onRejectLeave: (leaveId: string, notes?: string) => Promise<void>;
  onDeleteLeave: (leaveId: string) => Promise<void>;
  onTriggerShortageModal: (leave: LeaveRequest, impact: ShortageImpactCheck) => void;
  onOpenSimulatorForPersonnel?: (personnelId: string) => void;
}

export const LeaveManagementView: React.FC<LeaveManagementViewProps> = ({
  leavesList,
  onOpenSubmitLeave,
  onCheckImpact,
  onApproveLeave,
  onRejectLeave,
  onDeleteLeave,
  onTriggerShortageModal,
  onOpenSimulatorForPersonnel
}) => {
  const [activeTab, setActiveTab] = useState<LeaveStatus | 'All'>('All');
  const [reviewerNotes, setReviewerNotes] = useState<Record<string, string>>({});
  const [loadingActionId, setLoadingActionId] = useState<string | null>(null);

  const filteredLeaves = leavesList.filter(l => activeTab === 'All' || l.status === activeTab);

  const handleApprove = async (leave: LeaveRequest) => {
    setLoadingActionId(leave.id);
    try {
      const notes = reviewerNotes[leave.id] || '';
      // First check shortage impact
      const impact = await onCheckImpact(leave.personnelId, leave.startDate, leave.endDate);

      if (impact.willCauseShortage) {
        // Trigger Shortage Modal for user decision / CO override
        onTriggerShortageModal(leave, impact);
      } else {
        // Safe approval
        await onApproveLeave(leave.id, notes, false);
      }
    } catch (err) {
      console.error('Error approving leave:', err);
    } finally {
      setLoadingActionId(null);
    }
  };

  const handleReject = async (leaveId: string) => {
    setLoadingActionId(leaveId);
    try {
      const notes = reviewerNotes[leaveId] || '';
      await onRejectLeave(leaveId, notes);
    } catch (err) {
      console.error('Error rejecting leave:', err);
    } finally {
      setLoadingActionId(null);
    }
  };

  const getStatusBadge = (status: LeaveStatus) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-950 text-emerald-400 border-emerald-700/60';
      case 'Rejected':
        return 'bg-red-950 text-red-400 border-red-700/60';
      case 'Pending':
        return 'bg-amber-950 text-amber-300 border-amber-700/60 animate-pulse';
      default:
        return 'bg-slate-900 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
              LEAVE REQUESTS & APPROVAL QUEUE
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Submit, Evaluate, and Process Personnel Leave with Real-Time Shortage Warnings
          </p>
        </div>

        <button
          onClick={onOpenSubmitLeave}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-mono text-xs font-bold rounded-lg border border-emerald-500 shadow transition flex items-center justify-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>SUBMIT LEAVE REQUEST</span>
        </button>
      </div>

      {/* Queue Tabs */}
      <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 w-fit text-xs font-mono">
        <button
          onClick={() => setActiveTab('All')}
          className={`px-3 py-1.5 rounded-lg transition ${
            activeTab === 'All' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          ALL REQUESTS ({leavesList.length})
        </button>
        <button
          onClick={() => setActiveTab('Pending')}
          className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1 ${
            activeTab === 'Pending' ? 'bg-amber-900/80 text-amber-200 font-bold border border-amber-700/50' : 'text-amber-400 hover:text-amber-300'
          }`}
        >
          <Clock className="w-3 h-3" />
          <span>PENDING ({leavesList.filter(l => l.status === 'Pending').length})</span>
        </button>
        <button
          onClick={() => setActiveTab('Approved')}
          className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1 ${
            activeTab === 'Approved' ? 'bg-emerald-900/80 text-emerald-200 font-bold border border-emerald-700/50' : 'text-emerald-400 hover:text-emerald-300'
          }`}
        >
          <CheckCircle className="w-3 h-3" />
          <span>APPROVED ({leavesList.filter(l => l.status === 'Approved').length})</span>
        </button>
        <button
          onClick={() => setActiveTab('Rejected')}
          className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1 ${
            activeTab === 'Rejected' ? 'bg-red-900/80 text-red-200 font-bold border border-red-700/50' : 'text-red-400 hover:text-red-300'
          }`}
        >
          <XCircle className="w-3 h-3" />
          <span>REJECTED ({leavesList.filter(l => l.status === 'Rejected').length})</span>
        </button>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredLeaves.map((leave) => (
          <div 
            key={leave.id}
            className={`bg-slate-900 border rounded-xl p-5 shadow-lg transition relative overflow-hidden ${
              leave.triggersShortage && leave.status === 'Pending'
                ? 'border-amber-600/80'
                : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            {/* Top Bar inside card */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold text-slate-400">
                  REF: {leave.id}
                </span>
                <span className="text-slate-600">|</span>
                <span className="text-xs font-mono font-bold bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                  {leave.personnelRank}
                </span>
                <span className="text-sm font-bold text-white font-mono">
                  {leave.personnelName}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  ({leave.unit})
                </span>
              </div>

              <div className="flex items-center space-x-2">
                {leave.triggersShortage && leave.status === 'Pending' && (
                  <span className="bg-amber-950 text-amber-300 border border-amber-600 px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center">
                    <ShieldAlert className="w-3 h-3 mr-1 text-amber-400" />
                    SHORTAGE RISK DETECTED
                  </span>
                )}

                <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold border ${getStatusBadge(leave.status)}`}>
                  {leave.status.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Leave Details Body */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono text-slate-300">
              <div>
                <span className="text-slate-500 uppercase tracking-wider text-[10px]">LEAVE CATEGORY</span>
                <p className="text-sm font-bold text-emerald-400 mt-0.5">{leave.leaveType}</p>
              </div>

              <div>
                <span className="text-slate-500 uppercase tracking-wider text-[10px]">DURATION & DATES</span>
                <div className="flex items-center space-x-1.5 text-slate-200 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{leave.startDate} &rarr; {leave.endDate}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-500 uppercase tracking-wider text-[10px]">SUBMITTED AT</span>
                <p className="text-slate-400 mt-0.5">{new Date(leave.requestedAt).toLocaleString()}</p>
              </div>
            </div>

            {/* Reason */}
            <div className="mt-3 bg-slate-950/80 border border-slate-800/80 rounded-lg p-3 text-xs text-slate-300">
              <span className="text-slate-500 font-mono uppercase text-[10px] block mb-1">JUSTIFICATION / REASON:</span>
              <p className="italic text-slate-200">{leave.reason}</p>
            </div>

            {/* Reviewer Notes if already reviewed */}
            {leave.reviewerNotes && (
              <div className="mt-3 bg-slate-800/50 border border-slate-700/50 rounded-lg p-2.5 text-xs text-slate-300 font-mono">
                <span className="text-slate-400 font-bold">Reviewer Note: </span>
                <span>{leave.reviewerNotes}</span>
              </div>
            )}

            {/* Pending Action Controls */}
            {leave.status === 'Pending' && (
              <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <input
                  type="text"
                  placeholder="Optional CO approval note or endorsement..."
                  value={reviewerNotes[leave.id] || ''}
                  onChange={(e) => setReviewerNotes({ ...reviewerNotes, [leave.id]: e.target.value })}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs font-mono text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />

                <div className="flex flex-wrap items-center gap-2">
                  {onOpenSimulatorForPersonnel && (
                    <button
                      type="button"
                      onClick={() => onOpenSimulatorForPersonnel(leave.personnelId)}
                      className="px-3 py-1.5 bg-amber-950/80 hover:bg-amber-900 text-amber-300 font-mono text-xs font-bold rounded border border-amber-600/60 transition flex items-center justify-center space-x-1.5"
                      title="Simulate manpower & readiness score impact on each unit"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>SIMULATE IMPACT</span>
                    </button>
                  )}

                  <button
                    disabled={loadingActionId === leave.id}
                    onClick={() => handleApprove(leave)}
                    className="flex-1 sm:flex-none px-4 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-mono text-xs font-bold rounded border border-emerald-500 shadow transition flex items-center justify-center space-x-1.5 disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" />
                    <span>APPROVE LEAVE</span>
                  </button>

                  <button
                    disabled={loadingActionId === leave.id}
                    onClick={() => handleReject(leave.id)}
                    className="flex-1 sm:flex-none px-4 py-1.5 bg-red-900/80 hover:bg-red-800 text-red-200 font-mono text-xs font-bold rounded border border-red-700 transition flex items-center justify-center space-x-1.5 disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                    <span>REJECT</span>
                  </button>
                </div>
              </div>
            )}

            {/* Delete button for clean up */}
            <div className="mt-3 text-right">
              <button
                onClick={() => onDeleteLeave(leave.id)}
                className="text-[11px] font-mono text-slate-500 hover:text-red-400 transition inline-flex items-center space-x-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Remove Request Record</span>
              </button>
            </div>
          </div>
        ))}

        {filteredLeaves.length === 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400 font-mono">
            <Clock className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p>No leave requests found in the current filter queue.</p>
          </div>
        )}
      </div>
    </div>
  );
};
