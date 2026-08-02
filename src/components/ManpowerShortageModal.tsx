import React, { useState } from 'react';
import { AlertOctagon, ShieldAlert, X, Check, Shield } from 'lucide-react';
import { LeaveRequest, ShortageImpactCheck } from '../types';

interface ManpowerShortageModalProps {
  isOpen: boolean;
  onClose: () => void;
  leaveRequest: LeaveRequest | null;
  shortageImpact: ShortageImpactCheck | null;
  onConfirmOverride: (leaveId: string, notes: string) => Promise<void>;
}

export const ManpowerShortageModal: React.FC<ManpowerShortageModalProps> = ({
  isOpen,
  onClose,
  leaveRequest,
  shortageImpact,
  onConfirmOverride
}) => {
  const [overrideReason, setOverrideReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !leaveRequest || !shortageImpact) return null;

  const handleOverride = async () => {
    setSubmitting(true);
    try {
      await onConfirmOverride(
        leaveRequest.id, 
        overrideReason || 'CO Sign-off: Operational override granted despite manpower threshold warning.'
      );
      onClose();
    } catch (err) {
      console.error('Error overriding shortage:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border-2 border-red-600 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden font-mono text-xs">
        {/* Red Alarm Banner Header */}
        <div className="bg-red-950 border-b-2 border-red-600 px-5 py-4 flex items-center justify-between text-red-100">
          <div className="flex items-center space-x-2.5">
            <AlertOctagon className="w-6 h-6 text-red-400 animate-pulse" />
            <div>
              <h3 className="font-bold text-sm uppercase tracking-wider text-white">
                CRITICAL MANPOWER SHORTAGE WARNING
              </h3>
              <p className="text-[11px] text-red-300">THRESHOLD SAFETY DEFICIT DETECTED</p>
            </div>
          </div>
          <button onClick={onClose} className="text-red-300 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 text-slate-200">
          {/* Personnel & Leave Request Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3.5 space-y-1">
            <span className="text-slate-500 uppercase text-[10px] block">PROPOSED LEAVE APPROVAL:</span>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white">
                {leaveRequest.personnelRank} {leaveRequest.personnelName}
              </span>
              <span className="text-emerald-400 font-bold">{leaveRequest.leaveType}</span>
            </div>
            <div className="text-slate-400 text-[11px]">
              Unit: <strong className="text-slate-200">{leaveRequest.unit}</strong> | Dates: <strong className="text-slate-200">{leaveRequest.startDate} &rarr; {leaveRequest.endDate}</strong>
            </div>
          </div>

          {/* Impact Stats Grid */}
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
              <span className="text-slate-500 text-[10px] uppercase block">CURRENT ACTIVE DUTY</span>
              <span className="text-lg font-bold text-emerald-400">{shortageImpact.currentOnDuty}</span>
              <span className="text-[10px] text-slate-400 block">{shortageImpact.currentPercentage}% Readiness</span>
            </div>

            <div className="bg-red-950/60 border border-red-800 rounded-lg p-3">
              <span className="text-red-300 text-[10px] uppercase block font-bold">PROJECTED AFTER APPROVAL</span>
              <span className="text-lg font-bold text-red-400">{shortageImpact.projectedOnDuty}</span>
              <span className="text-[10px] text-red-300 block font-bold">{shortageImpact.projectedPercentage}% Readiness</span>
            </div>
          </div>

          {/* Detailed Warning Text */}
          <div className="bg-red-950/40 border border-red-700/60 rounded-lg p-3.5 text-red-200 space-y-1.5 leading-relaxed">
            <div className="flex items-center space-x-1.5 font-bold text-red-300 uppercase text-[11px]">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span>IMPACT BREAKDOWN</span>
            </div>
            <p className="text-[11px]">{shortageImpact.warningMessage}</p>
          </div>

          {/* CO Override Notes */}
          <div>
            <label className="block text-slate-300 uppercase mb-1 font-bold">
              COMMANDING OFFICER OVERRIDE ENDORSEMENT *
            </label>
            <textarea
              rows={2}
              placeholder="State operational justification for granting leave despite manpower shortage..."
              value={overrideReason}
              onChange={(e) => setOverrideReason(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded"
            >
              CANCEL (KEEP PENDING)
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={handleOverride}
              className="w-full sm:w-auto px-4 py-2 bg-red-700 hover:bg-red-600 text-white font-bold rounded border border-red-500 shadow transition flex items-center justify-center space-x-1.5 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{submitting ? 'PROCESSING OVERRIDE...' : 'GRANT CO OVERRIDE'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
