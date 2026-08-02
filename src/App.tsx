import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { PersonnelView } from './components/PersonnelView';
import { LeaveManagementView } from './components/LeaveManagementView';
import { LeaveSimulatorView } from './components/LeaveSimulatorView';
import { SettingsView } from './components/SettingsView';
import { AddPersonnelModal } from './components/AddPersonnelModal';
import { LeaveRequestModal } from './components/LeaveRequestModal';
import { ManpowerShortageModal } from './components/ManpowerShortageModal';
import { Personnel, LeaveRequest, SystemSettings, DashboardStats, ShortageImpactCheck, DutyStatus } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // State loaded from REST API
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [personnelList, setPersonnelList] = useState<Personnel[]>([]);
  const [leavesList, setLeavesList] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Modals state
  const [isAddPersonnelOpen, setIsAddPersonnelOpen] = useState<boolean>(false);
  const [isSubmitLeaveOpen, setIsSubmitLeaveOpen] = useState<boolean>(false);

  // Shortage Warning Dialog State
  const [shortageModal, setShortageModal] = useState<{
    isOpen: boolean;
    leave: LeaveRequest | null;
    impact: ShortageImpactCheck | null;
  }>({
    isOpen: false,
    leave: null,
    impact: null
  });

  // Global Toast Message
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch all data from REST API
  const fetchData = useCallback(async () => {
    try {
      const [statsRes, settingsRes, personnelRes, leavesRes] = await Promise.all([
        fetch('/api/dashboard'),
        fetch('/api/settings'),
        fetch('/api/personnel'),
        fetch('/api/leaves')
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (settingsRes.ok) setSettings(await settingsRes.json());
      if (personnelRes.ok) setPersonnelList(await personnelRes.json());
      if (leavesRes.ok) setLeavesList(await leavesRes.json());
    } catch (err) {
      console.error('Error fetching data from server:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handler: Add Personnel
  const handleAddPersonnel = async (data: Partial<Personnel>) => {
    try {
      const res = await fetch('/api/personnel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        showToast('New personnel record successfully registered.');
        await fetchData();
      }
    } catch (err) {
      showToast('Failed to add personnel.', 'error');
    }
  };

  // Handler: Update Duty Status
  const handleUpdateStatus = async (id: string, newStatus: DutyStatus) => {
    try {
      const res = await fetch(`/api/personnel/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        showToast(`Duty status updated to "${newStatus}".`);
        await fetchData();
      }
    } catch (err) {
      showToast('Failed to update status.', 'error');
    }
  };

  // Handler: Delete Personnel
  const handleDeletePersonnel = async (id: string) => {
    try {
      const res = await fetch(`/api/personnel/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        showToast('Personnel record removed from battalion database.');
        await fetchData();
      }
    } catch (err) {
      showToast('Failed to delete personnel.', 'error');
    }
  };

  // Handler: Pre-check shortage impact
  const handleCheckImpact = async (personnelId: string, startDate: string, endDate: string): Promise<ShortageImpactCheck> => {
    const res = await fetch('/api/leaves/check-impact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ personnelId, startDate, endDate })
    });
    return await res.json();
  };

  // Handler: Submit Leave Request
  const handleSubmitLeave = async (data: {
    personnelId: string;
    leaveType: LeaveRequest['leaveType'];
    startDate: string;
    endDate: string;
    reason: string;
  }) => {
    try {
      const res = await fetch('/api/leaves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const result = await res.json();
        if (result.shortageImpact?.willCauseShortage) {
          showToast('Leave request submitted. WARNING: Shortage risk flagged!', 'error');
        } else {
          showToast('Leave request submitted to approval queue.');
        }
        await fetchData();
      }
    } catch (err) {
      showToast('Failed to submit leave request.', 'error');
    }
  };

  // Handler: Approve Leave
  const handleApproveLeave = async (
    leaveId: string, 
    reviewerNotes?: string, 
    forceOverride?: boolean
  ): Promise<{ success: boolean; impact?: ShortageImpactCheck; error?: string }> => {
    try {
      const res = await fetch(`/api/leaves/${leaveId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'Approved',
          reviewerNotes,
          forceOverride
        })
      });

      const body = await res.json();
      if (!res.ok) {
        return { success: false, error: body.error, impact: body.impact };
      }

      showToast('Leave request officially APPROVED.');
      await fetchData();
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Network error approving leave' };
    }
  };

  // Handler: Reject Leave
  const handleRejectLeave = async (leaveId: string, reviewerNotes?: string) => {
    try {
      const res = await fetch(`/api/leaves/${leaveId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'Rejected',
          reviewerNotes
        })
      });

      if (res.ok) {
        showToast('Leave request REJECTED.');
        await fetchData();
      }
    } catch (err) {
      showToast('Failed to reject leave.', 'error');
    }
  };

  // Handler: Delete Leave
  const handleDeleteLeave = async (leaveId: string) => {
    try {
      const res = await fetch(`/api/leaves/${leaveId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        showToast('Leave record removed.');
        await fetchData();
      }
    } catch (err) {
      showToast('Failed to delete leave.', 'error');
    }
  };

  // Handler: Confirm CO Override in Shortage Modal
  const handleConfirmOverride = async (leaveId: string, notes: string) => {
    await handleApproveLeave(leaveId, notes, true);
  };

  // Handler: Save Settings
  const handleSaveSettings = async (newSettings: SystemSettings) => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
      if (res.ok) {
        showToast('Manpower thresholds and unit parameters saved.');
        await fetchData();
      }
    } catch (err) {
      showToast('Failed to save settings.', 'error');
    }
  };

  // Handler: Reset Database Data
  const handleResetData = async () => {
    try {
      const res = await fetch('/api/reset-data', { method: 'POST' });
      if (res.ok) {
        showToast('System database reset to initial battalion seed data.');
        await fetchData();
      }
    } catch (err) {
      showToast('Failed to reset data.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-800 selection:text-white">
      {/* Tactical Header */}
      <Header
        stats={stats}
        settings={settings}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onResetData={handleResetData}
      />

      {/* Global Toast Notification */}
      {toast && (
        <div className={`fixed top-20 right-4 z-50 px-4 py-2.5 rounded-lg shadow-2xl border font-mono text-xs font-bold animate-bounce ${
          toast.type === 'error'
            ? 'bg-red-950 text-red-200 border-red-600'
            : 'bg-emerald-950 text-emerald-200 border-emerald-600'
        }`}>
          {toast.message}
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-16 text-slate-400 font-mono space-y-3">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500"></div>
            <span>Connecting to Tactical REST Backend...</span>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <DashboardView
                stats={stats}
                settings={settings}
                personnelList={personnelList}
                onOpenAddPersonnel={() => setIsAddPersonnelOpen(true)}
                onOpenSubmitLeave={() => setIsSubmitLeaveOpen(true)}
                onNavigateTab={(tab) => setActiveTab(tab)}
                onUpdateStatus={handleUpdateStatus}
              />
            )}

            {activeTab === 'personnel' && (
              <PersonnelView
                personnelList={personnelList}
                onOpenAddPersonnel={() => setIsAddPersonnelOpen(true)}
                onDeletePersonnel={handleDeletePersonnel}
                onUpdateStatus={handleUpdateStatus}
              />
            )}

            {activeTab === 'leaves' && (
              <LeaveManagementView
                leavesList={leavesList}
                onOpenSubmitLeave={() => setIsSubmitLeaveOpen(true)}
                onCheckImpact={handleCheckImpact}
                onApproveLeave={handleApproveLeave}
                onRejectLeave={handleRejectLeave}
                onDeleteLeave={handleDeleteLeave}
                onTriggerShortageModal={(leave, impact) => {
                  setShortageModal({
                    isOpen: true,
                    leave,
                    impact
                  });
                }}
                onOpenSimulatorForPersonnel={() => setActiveTab('simulator')}
              />
            )}

            {activeTab === 'simulator' && (
              <LeaveSimulatorView
                personnelList={personnelList}
                pendingLeaves={leavesList.filter(l => l.status === 'Pending')}
                onOpenLeaveModal={() => setIsSubmitLeaveOpen(true)}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsView
                settings={settings}
                onSaveSettings={handleSaveSettings}
                onResetData={handleResetData}
              />
            )}
          </>
        )}
      </main>

      {/* Modals */}
      <AddPersonnelModal
        isOpen={isAddPersonnelOpen}
        onClose={() => setIsAddPersonnelOpen(false)}
        onAddPersonnel={handleAddPersonnel}
      />

      <LeaveRequestModal
        isOpen={isSubmitLeaveOpen}
        onClose={() => setIsSubmitLeaveOpen(false)}
        personnelList={personnelList}
        onSubmitLeave={handleSubmitLeave}
        onCheckImpact={handleCheckImpact}
      />

      <ManpowerShortageModal
        isOpen={shortageModal.isOpen}
        onClose={() => setShortageModal({ isOpen: false, leave: null, impact: null })}
        leaveRequest={shortageModal.leave}
        shortageImpact={shortageModal.impact}
        onConfirmOverride={handleConfirmOverride}
      />
    </div>
  );
}
