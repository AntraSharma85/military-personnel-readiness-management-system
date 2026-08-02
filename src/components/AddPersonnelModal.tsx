import React, { useState } from 'react';
import { X, UserPlus, Shield } from 'lucide-react';
import { Rank, DutyStatus, Personnel } from '../types';

interface AddPersonnelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPersonnel: (person: Partial<Personnel>) => Promise<void>;
}

const RANKS: Rank[] = [
  'General',
  'Colonel',
  'Major',
  'Captain',
  'Lieutenant',
  'Sergeant Major',
  'Sergeant',
  'Corporal',
  'Private'
];

const UNITS = [
  '1st Infantry Platoon',
  'Tactical Ops Command',
  'Logistics & Support',
  'Medical Readiness Corp'
];

export const AddPersonnelModal: React.FC<AddPersonnelModalProps> = ({
  isOpen,
  onClose,
  onAddPersonnel
}) => {
  const [formData, setFormData] = useState({
    name: '',
    serviceId: `MIL-${Math.floor(10000 + Math.random() * 90000)}`,
    rank: 'Sergeant' as Rank,
    unit: '1st Infantry Platoon',
    role: 'Squad Leader',
    status: 'On Duty' as DutyStatus,
    contact: '+1 (555) 019-2000',
    email: '',
    notes: ''
  });

  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    setSubmitting(true);
    try {
      await onAddPersonnel({
        ...formData,
        email: formData.email || `${formData.name.toLowerCase().replace(/\s+/g, '.')}@defense.mil`
      });
      onClose();
    } catch (err) {
      console.error('Error adding personnel:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border-2 border-emerald-800 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden font-mono text-xs">
        {/* Header */}
        <div className="bg-slate-950 px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-white">
            <UserPlus className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-sm uppercase tracking-wider">REGISTER NEW PERSONNEL</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-slate-300 uppercase mb-1">FULL NAME *</label>
            <input
              type="text"
              required
              placeholder="e.g. Johnathan Miller"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 uppercase mb-1">SERVICE ID</label>
              <input
                type="text"
                required
                value={formData.serviceId}
                onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 uppercase mb-1">MILITARY RANK</label>
              <select
                value={formData.rank}
                onChange={(e) => setFormData({ ...formData, rank: e.target.value as Rank })}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
              >
                {RANKS.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 uppercase mb-1">ASSIGNED UNIT</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
              >
                {UNITS.map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 uppercase mb-1">DUTY ROLE</label>
              <input
                type="text"
                required
                placeholder="e.g. Comms Specialist"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 uppercase mb-1">INITIAL STATUS</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as DutyStatus })}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
              >
                <option value="On Duty">On Duty</option>
                <option value="On Leave">On Leave</option>
                <option value="Training">Training</option>
                <option value="Off Duty">Off Duty</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 uppercase mb-1">CONTACT NUMBER</label>
              <input
                type="text"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

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
              {submitting ? 'SAVING...' : 'REGISTER PERSONNEL'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
