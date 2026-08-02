import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Trash2, 
  Filter, 
  Shield, 
  Mail, 
  Phone, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Personnel, Rank, DutyStatus } from '../types';

interface PersonnelViewProps {
  personnelList: Personnel[];
  onOpenAddPersonnel: () => void;
  onDeletePersonnel: (id: string) => void;
  onUpdateStatus: (id: string, newStatus: DutyStatus) => void;
}

const RANKS: (Rank | 'All')[] = [
  'All',
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

const STATUSES: (DutyStatus | 'All')[] = ['All', 'On Duty', 'On Leave', 'Training', 'Off Duty'];

export const PersonnelView: React.FC<PersonnelViewProps> = ({
  personnelList,
  onOpenAddPersonnel,
  onDeletePersonnel,
  onUpdateStatus
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [rankFilter, setRankFilter] = useState<Rank | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<DutyStatus | 'All'>('All');
  const [unitFilter, setUnitFilter] = useState<string>('All');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const units = ['All', ...Array.from(new Set(personnelList.map(p => p.unit)))];

  const filteredList = personnelList.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.serviceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.role.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRank = rankFilter === 'All' || p.rank === rankFilter;
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    const matchesUnit = unitFilter === 'All' || p.unit === unitFilter;

    return matchesSearch && matchesRank && matchesStatus && matchesUnit;
  });

  const getStatusBadge = (status: DutyStatus) => {
    switch (status) {
      case 'On Duty':
        return 'bg-emerald-950 text-emerald-400 border-emerald-700/60';
      case 'On Leave':
        return 'bg-amber-950 text-amber-400 border-amber-700/60';
      case 'Training':
        return 'bg-purple-950 text-purple-400 border-purple-700/60';
      case 'Off Duty':
        return 'bg-slate-900 text-slate-400 border-slate-700';
      default:
        return 'bg-slate-900 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Add Button */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
              PERSONNEL ROSTER MANAGEMENT
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Registered Service Personnel, Ranks, Unit Assignments, and Active Duty Status
          </p>
        </div>

        <button
          onClick={onOpenAddPersonnel}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-mono text-xs font-bold rounded-lg border border-emerald-500 shadow transition flex items-center justify-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>ADD NEW PERSONNEL</span>
        </button>
      </div>

      {/* Filter Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search name, Service ID, role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Rank Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
          <select
            value={rankFilter}
            onChange={(e) => setRankFilter(e.target.value as Rank | 'All')}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="All">All Ranks</option>
            {RANKS.filter(r => r !== 'All').map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as DutyStatus | 'All')}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="All">All Statuses</option>
            {STATUSES.filter(s => s !== 'All').map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Unit Filter */}
        <div>
          <select
            value={unitFilter}
            onChange={(e) => setUnitFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="All">All Units</option>
            {units.filter(u => u !== 'All').map(u => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredList.map((person) => (
          <div 
            key={person.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg hover:border-slate-700 transition flex flex-col justify-between"
          >
            <div>
              {/* Header Badge */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                    {person.rank}
                  </span>
                  <span className="ml-2 text-[10px] font-mono text-emerald-400">
                    {person.serviceId}
                  </span>
                </div>

                {/* Status Switcher */}
                <select
                  value={person.status}
                  onChange={(e) => onUpdateStatus(person.id, e.target.value as DutyStatus)}
                  className={`text-[10px] font-mono font-bold rounded-full px-2.5 py-1 border focus:outline-none cursor-pointer ${getStatusBadge(person.status)}`}
                >
                  <option value="On Duty">On Duty</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Training">Training</option>
                  <option value="Off Duty">Off Duty</option>
                </select>
              </div>

              {/* Name & Role */}
              <h3 className="text-base font-bold text-white mt-2.5">{person.name}</h3>
              <p className="text-xs font-mono text-emerald-400 font-semibold">{person.role}</p>

              {/* Unit Tag */}
              <div className="mt-2.5 inline-flex items-center text-[11px] font-mono text-slate-300 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                <Shield className="w-3 h-3 text-slate-500 mr-1.5" />
                <span>{person.unit}</span>
              </div>

              {/* Contact info */}
              <div className="mt-3 space-y-1 text-xs text-slate-400 font-mono">
                <div className="flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span className="truncate">{person.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>{person.contact}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>Enlisted: {person.joinedDate}</span>
                </div>
              </div>
            </div>

            {/* Footer / Delete Confirmation */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono">ID: {person.id}</span>

              {deleteConfirmId === person.id ? (
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] text-red-400 font-mono font-bold">Delete?</span>
                  <button
                    onClick={() => {
                      onDeletePersonnel(person.id);
                      setDeleteConfirmId(null);
                    }}
                    className="px-2 py-0.5 bg-red-800 hover:bg-red-700 text-white text-[10px] font-mono font-bold rounded"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(null)}
                    className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono rounded"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setDeleteConfirmId(person.id)}
                  title="Remove personnel record"
                  className="text-slate-500 hover:text-red-400 transition p-1 rounded hover:bg-slate-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredList.length === 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400 font-mono">
          <AlertCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
          <p>No personnel records found matching your current search or filter criteria.</p>
        </div>
      )}
    </div>
  );
};
