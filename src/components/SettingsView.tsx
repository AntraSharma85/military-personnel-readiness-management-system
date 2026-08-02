import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, ShieldCheck, AlertOctagon, RefreshCw } from 'lucide-react';
import { SystemSettings } from '../types';

interface SettingsViewProps {
  settings: SystemSettings | null;
  onSaveSettings: (newSettings: SystemSettings) => Promise<void>;
  onResetData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSaveSettings,
  onResetData
}) => {
  const [formData, setFormData] = useState<SystemSettings>({
    minManpowerPercentage: 70,
    minManpowerCount: 12,
    unitThresholds: {
      '1st Infantry Platoon': 4,
      'Tactical Ops Command': 3,
      'Logistics & Support': 3,
      'Medical Readiness Corp': 2
    },
    commandingOfficerName: 'Col. Vance Sterling',
    unitName: '7th Tactical Readiness Battalion',
    autoBlockShortage: false
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await onSaveSettings(formData);
      setMessage('Tactical manpower settings successfully saved and synced to database.');
    } catch (err) {
      setMessage('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleUnitThresholdChange = (unit: string, value: number) => {
    setFormData({
      ...formData,
      unitThresholds: {
        ...formData.unitThresholds,
        [unit]: Math.max(1, value)
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <SettingsIcon className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
              MANPOWER THRESHOLDS & COMMAND CONFIGURATION
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure automated shortage detection rules, minimum readiness thresholds, and unit parameters
          </p>
        </div>

        <button
          onClick={onResetData}
          className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 font-mono text-xs font-bold rounded-lg border border-slate-700 shadow transition flex items-center justify-center space-x-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
          <span>Reset Battalion Seed Data</span>
        </button>
      </div>

      {message && (
        <div className="bg-emerald-950/90 border border-emerald-600/80 rounded-xl p-4 text-emerald-200 text-xs font-mono font-bold flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Readiness Thresholds */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider border-b border-slate-800 pb-3 mb-4">
            1. BATTALION READINESS THRESHOLDS
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-mono">
            {/* Min Percentage */}
            <div>
              <label className="block text-slate-300 uppercase mb-1">
                MINIMUM READINESS PERCENTAGE (%):
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  min="30"
                  max="100"
                  value={formData.minManpowerPercentage}
                  onChange={(e) => setFormData({ ...formData, minManpowerPercentage: parseInt(e.target.value) || 70 })}
                  className="w-32 bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100 font-bold focus:outline-none focus:border-emerald-500"
                />
                <span className="text-slate-400">Default: 70% active strength</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Warns commanding officers whenever active personnel strength falls below this percentage.
              </p>
            </div>

            {/* Min Count */}
            <div>
              <label className="block text-slate-300 uppercase mb-1">
                MINIMUM REQUIRED ACTIVE PERSONNEL COUNT:
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={formData.minManpowerCount}
                  onChange={(e) => setFormData({ ...formData, minManpowerCount: parseInt(e.target.value) || 12 })}
                  className="w-32 bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100 font-bold focus:outline-none focus:border-emerald-500"
                />
                <span className="text-slate-400">Default: 12 personnel</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Hard headcount lower bound. Approving leave that drops active duty below this triggers shortage alert.
              </p>
            </div>
          </div>
        </div>

        {/* Unit Specific Thresholds */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider border-b border-slate-800 pb-3 mb-4">
            2. PER-UNIT MINIMUM DUTY REQUIREMENTS
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
            {Object.entries(formData.unitThresholds).map(([unit, threshold]) => (
              <div key={unit} className="bg-slate-950 border border-slate-800 rounded-lg p-3">
                <span className="block font-bold text-slate-200 truncate">{unit}</span>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Min Active:</span>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={threshold}
                    onChange={(e) => handleUnitThresholdChange(unit, parseInt(e.target.value) || 1)}
                    className="w-16 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-center font-bold text-emerald-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Command Details & Auto Block Option */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider border-b border-slate-800 pb-3 mb-4">
            3. COMMAND DETAILS & ENFORCEMENT MODE
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-mono mb-5">
            <div>
              <label className="block text-slate-300 uppercase mb-1">
                BATTALION / UNIT DESIGNATION:
              </label>
              <input
                type="text"
                value={formData.unitName}
                onChange={(e) => setFormData({ ...formData, unitName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100 font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 uppercase mb-1">
                COMMANDING OFFICER (CO) NAME:
              </label>
              <input
                type="text"
                value={formData.commandingOfficerName}
                onChange={(e) => setFormData({ ...formData, commandingOfficerName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100 font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 flex items-start space-x-3">
            <input
              type="checkbox"
              id="autoBlock"
              checked={formData.autoBlockShortage}
              onChange={(e) => setFormData({ ...formData, autoBlockShortage: e.target.checked })}
              className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-900 text-emerald-600 focus:ring-emerald-500"
            />
            <div>
              <label htmlFor="autoBlock" className="text-sm font-bold text-white font-mono cursor-pointer">
                STRICT ENFORCE MODE (AUTO-BLOCK SHORTAGES)
              </label>
              <p className="text-xs text-slate-400 mt-0.5">
                If checked, the system will completely block officers from approving leave that violates thresholds. If unchecked, a high-priority warning is displayed, requiring CO override sign-off.
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-mono text-xs font-bold rounded-lg border border-emerald-500 shadow-lg transition flex items-center space-x-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'SAVING THRESHOLDS...' : 'SAVE TACTICAL SETTINGS'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
