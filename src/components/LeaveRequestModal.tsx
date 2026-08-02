import React, { useState, useEffect } from 'react';
import { X, FilePlus, AlertTriangle, ShieldCheck, Calendar } from 'lucide-react';
import { Personnel, LeaveType, ShortageImpactCheck } from '../types';

interface LeaveRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  personnelList: Personnel[];
  onSubmitLeave: (data: {
    personnelId: string;
    leaveType: LeaveType;
    startDate: string;
    endDate: string;
    reason: string;
  }) => Promise<void>;
  onCheckImpact: (personnelId: string, startDate: string, endDate: string) => Promise<ShortageImpactCheck>;
}

const LEAVE_TYPES: LeaveType[] = [
  'Annual Leave',
  'Sick Leave',
  'Emergency Leave',
  'Convalescent Leave',
  'Compassionate Leave',
  'Special Duty Leave'
];

export const LeaveRequestModal: React.FC<LeaveRequestModalProps> = ({
  isOpen,
  onClose,
  personnelList,
  onSubmitLeave,
  onCheckImpact
}) => {
  const today = new Date().toISOString().split('T')[0];
  const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

  const [selectedPersonnelId, setSelectedPersonnelId] = useState<string>(personnelList[0]?.id || '');
  const [leaveType, setLeaveType] = useState<LeaveType>('Annual Leave');
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(nextWeek);
  const [reason, setReason] = useState('');

  const [impactCheck, setImpactCheck] = useState<ShortageImpactCheck | null>(null);
  const [checkingImpact, setCheckingImpact] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (personnelList.length > 0 && !selectedPersonnelId) {
      setSelectedPersonnelId(personnelList[0].id);
    }
  }, [personnelList, selectedPersonnelId]);

  // Live real-time impact preview whenever personnel or dates change
  useEffect(() => {
    if (!isOpen || !selectedPersonnelId || !startDate || !endDate) return;

    let isMounted = true;
    setCheckingImpact(true);

    onCheckImpact(selectedPersonnelId, startDate, endDate)
      .then(res => {
        if (isMounted) {
          setImpactCheck(res);
          setCheckingImpact(false);
        }
      })
      .catch(() => {
        if (isMounted) setCheckingImpact(false);
      });

    return () => { isMounted = false; };
  }, [isOpen, selectedPersonnelId, startDate, endDate, onCheckImpact]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPersonnelId || !reason) return;

    setSubmitting(true);
    try {
      await onSubmitLeave({
        personnelId: selectedPersonnelId,
        leaveType,
        startDate,
        endDate,
        reason
      });
      onClose();
    } catch (err) {
      console.error('Error submitting leave:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const targetPerson = personnelList.find(p => p.id === selectedPersonnelId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border-2 border-emerald-800 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden font-mono text-xs">
        {/* Header */}
        <div className="bg-slate-950 px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-white">
            <FilePlus className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-sm uppercase tracking-wider">SUBMIT LEAVE APPLICATION</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-slate-300 uppercase mb-1">SELECT SERVICE PERSONNEL *</label>
            <select
              required
              value={selectedPersonnelId}
              onChange={(e) => setSelectedPersonnelId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
            >
              {personnelList.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.rank} {p.name} ({p.serviceId}) - {p.unit} [{p.status}]
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 uppercase mb-1">LEAVE TYPE</label>
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value as LeaveType)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
              >
                {LEAVE_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 uppercase mb-1">CURRENT STATUS</label>
              <div className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-300 font-bold">
                {targetPerson?.status || 'Unknown'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 uppercase mb-1">START DATE *</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 uppercase mb-1">END DATE *</label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 uppercase mb-1">OFFICIAL REASON / JUSTIFICATION *</label>
            <textarea
              required
              rows={3}
              placeholder="Provide reason for leave request..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Real-time Shortage Impact Preview */}
          {checkingImpact ? (
            <div className="bg-slate-950 border border-slate-800 rounded p-3 text-slate-400 text-center animate-pulse">
              Calculating manpower threshold impact...
            </div>
          ) : impactCheck ? (
            <div className={`p-3 rounded-lg border flex items-start space-x-2.5 ${
              impactCheck.willCauseShortage
                ? 'bg-red-950/80 border-red-700/80 text-red-200'
                : 'bg-emerald-950/80 border-emerald-700/80 text-emerald-200'
            }`}>
              {impactCheck.willCauseShortage ? (
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              ) : (
                <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <span className="font-bold block uppercase text-[11px]">
                  {impactCheck.willCauseShortage ? 'REAL-TIME MANPOWER SHORTAGE WARNING' : 'MANPOWER CLEARANCE'}
                </span>
                <p className="text-[11px] mt-0.5 leading-relaxed">{impactCheck.warningMessage}</p>
              </div>
            </div>
          ) : null}

          {/* Footer Buttons */}
          <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded border border-emerald-500 disabled:opacity-50"
            >
              {submitting ? 'SUBMITTING...' : 'SUBMIT REQUEST'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
