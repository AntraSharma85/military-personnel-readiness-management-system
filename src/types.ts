export type Rank = 
  | 'General'
  | 'Colonel'
  | 'Major'
  | 'Captain'
  | 'Lieutenant'
  | 'Sergeant Major'
  | 'Sergeant'
  | 'Corporal'
  | 'Private';

export type DutyStatus = 'On Duty' | 'On Leave' | 'Training' | 'Off Duty';

export type LeaveType = 
  | 'Annual Leave'
  | 'Sick Leave'
  | 'Emergency Leave'
  | 'Convalescent Leave'
  | 'Compassionate Leave'
  | 'Special Duty Leave';

export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export interface Personnel {
  id: string;
  serviceId: string;
  name: string;
  rank: Rank;
  unit: string;
  role: string;
  status: DutyStatus;
  contact: string;
  email: string;
  joinedDate: string;
  avatarUrl?: string;
  notes?: string;
}

export interface LeaveRequest {
  id: string;
  personnelId: string;
  personnelName: string;
  personnelRank: Rank;
  unit: string;
  leaveType: LeaveType;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  reason: string;
  status: LeaveStatus;
  requestedAt: string;
  reviewedAt?: string;
  reviewerNotes?: string;
  triggersShortage?: boolean;
}

export interface SystemSettings {
  minManpowerPercentage: number; // e.g. 70%
  minManpowerCount: number;      // e.g. 10 personnel
  unitThresholds: Record<string, number>; // Minimum active count per unit
  commandingOfficerName: string;
  unitName: string;
  autoBlockShortage: boolean;
}

export interface DashboardStats {
  totalPersonnel: number;
  onDuty: number;
  onLeave: number;
  inTraining: number;
  offDuty: number;
  readinessPercentage: number;
  isShortageAlert: boolean;
  activeShortageMessage: string | null;
  unitBreakdown: Array<{
    unit: string;
    total: number;
    onDuty: number;
    onLeave: number;
    training: number;
    required: number;
    isShortage: boolean;
  }>;
}

export interface ShortageImpactCheck {
  willCauseShortage: boolean;
  currentOnDuty: number;
  projectedOnDuty: number;
  requiredMin: number;
  currentPercentage: number;
  projectedPercentage: number;
  unitImpact?: {
    unit: string;
    currentUnitOnDuty: number;
    projectedUnitOnDuty: number;
    unitRequired: number;
    unitShortage: boolean;
  };
  warningMessage: string;
}

export interface UnitSimulationImpact {
  unit: string;
  totalMembers: number;
  baselineActive: number;
  simulatedActive: number;
  requiredThreshold: number;
  unitReadinessScore: number; // 0-100%
  indicator: 'GREEN' | 'YELLOW' | 'RED';
  impactDelta: number;
  statusMessage: string;
  affectedPersonnel: Array<{
    id: string;
    name: string;
    rank: Rank;
    role: string;
  }>;
}

export interface LeaveSimulationResult {
  overallReadinessScore: number; // 0-100%
  baselineReadinessScore: number; // 0-100%
  overallIndicator: 'GREEN' | 'YELLOW' | 'RED';
  overallStatusText: string;
  baselineActiveCount: number;
  simulatedActiveCount: number;
  totalPersonnel: number;
  minimumRequired: number;
  simulatedLeaveCount: number;
  unitImpacts: UnitSimulationImpact[];
  warnings: string[];
}

