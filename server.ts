import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { Personnel, LeaveRequest, SystemSettings, DashboardStats, ShortageImpactCheck, LeaveSimulationResult, UnitSimulationImpact } from './src/types.js';

const app = express();
const PORT = 3000;

app.use(express.json());

// JSON File Storage paths
const DATA_DIR = path.join(process.cwd(), 'data');
const PERSONNEL_FILE = path.join(DATA_DIR, 'personnel.json');
const LEAVES_FILE = path.join(DATA_DIR, 'leaves.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial Seed Data
const initialSettings: SystemSettings = {
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
};

const initialPersonnel: Personnel[] = [
  {
    id: 'PERS-001',
    serviceId: 'MIL-70142',
    name: 'Marcus Vance',
    rank: 'Captain',
    unit: 'Tactical Ops Command',
    role: 'Commanding Officer',
    status: 'On Duty',
    contact: '+1 (555) 019-2831',
    email: 'm.vance@defense.mil',
    joinedDate: '2018-03-15',
    notes: 'Tactical strategist with high clearance.'
  },
  {
    id: 'PERS-002',
    serviceId: 'MIL-89210',
    name: 'Elena Rostova',
    rank: 'Lieutenant',
    unit: 'Tactical Ops Command',
    role: 'Comms & Intelligence',
    status: 'On Duty',
    contact: '+1 (555) 019-8821',
    email: 'e.rostova@defense.mil',
    joinedDate: '2020-06-10'
  },
  {
    id: 'PERS-003',
    serviceId: 'MIL-55109',
    name: 'Jackson Reed',
    rank: 'Sergeant Major',
    unit: '1st Infantry Platoon',
    role: 'Platoon Sergeant',
    status: 'On Duty',
    contact: '+1 (555) 012-9988',
    email: 'j.reed@defense.mil',
    joinedDate: '2016-11-01'
  },
  {
    id: 'PERS-004',
    serviceId: 'MIL-44012',
    name: 'Darius Miller',
    rank: 'Sergeant',
    unit: '1st Infantry Platoon',
    role: 'Squad Leader',
    status: 'On Leave',
    contact: '+1 (555) 014-7722',
    email: 'd.miller@defense.mil',
    joinedDate: '2021-01-20'
  },
  {
    id: 'PERS-005',
    serviceId: 'MIL-33829',
    name: 'Sarah Connor',
    rank: 'Corporal',
    unit: '1st Infantry Platoon',
    role: 'Fireteam Lead',
    status: 'On Duty',
    contact: '+1 (555) 018-3341',
    email: 's.connor@defense.mil',
    joinedDate: '2022-04-12'
  },
  {
    id: 'PERS-006',
    serviceId: 'MIL-22910',
    name: 'David Kim',
    rank: 'Private',
    unit: '1st Infantry Platoon',
    role: 'Rifleman',
    status: 'On Duty',
    contact: '+1 (555) 016-2299',
    email: 'd.kim@defense.mil',
    joinedDate: '2023-09-01'
  },
  {
    id: 'PERS-007',
    serviceId: 'MIL-11048',
    name: 'Aisha Patel',
    rank: 'Captain',
    unit: 'Medical Readiness Corp',
    role: 'Chief Medical Specialist',
    status: 'On Duty',
    contact: '+1 (555) 013-5566',
    email: 'a.patel@defense.mil',
    joinedDate: '2019-08-14'
  },
  {
    id: 'PERS-008',
    serviceId: 'MIL-99312',
    name: 'Lucas Thorne',
    rank: 'Sergeant',
    unit: 'Medical Readiness Corp',
    role: 'Combat Medic',
    status: 'Training',
    contact: '+1 (555) 017-4400',
    email: 'l.thorne@defense.mil',
    joinedDate: '2021-05-18'
  },
  {
    id: 'PERS-009',
    serviceId: 'MIL-88421',
    name: 'Benjamin Hayes',
    rank: 'Major',
    unit: 'Logistics & Support',
    role: 'Quartermaster Chief',
    status: 'On Duty',
    contact: '+1 (555) 011-3311',
    email: 'b.hayes@defense.mil',
    joinedDate: '2017-02-28'
  },
  {
    id: 'PERS-010',
    serviceId: 'MIL-77290',
    name: 'Samantha Cross',
    rank: 'Corporal',
    unit: 'Logistics & Support',
    role: 'Supply Specialist',
    status: 'On Duty',
    contact: '+1 (555) 015-6677',
    email: 's.cross@defense.mil',
    joinedDate: '2022-10-05'
  },
  {
    id: 'PERS-011',
    serviceId: 'MIL-66102',
    name: 'Carlos Mendez',
    rank: 'Private',
    unit: 'Logistics & Support',
    role: 'Transport Driver',
    status: 'On Duty',
    contact: '+1 (555) 019-1122',
    email: 'c.mendez@defense.mil',
    joinedDate: '2023-11-12'
  },
  {
    id: 'PERS-012',
    serviceId: 'MIL-55401',
    name: 'Rachel Sterling',
    rank: 'Lieutenant',
    unit: '1st Infantry Platoon',
    role: 'Platoon Leader',
    status: 'Training',
    contact: '+1 (555) 013-9911',
    email: 'r.sterling@defense.mil',
    joinedDate: '2020-04-01'
  },
  {
    id: 'PERS-013',
    serviceId: 'MIL-44390',
    name: 'John Callahan',
    rank: 'Sergeant',
    unit: 'Tactical Ops Command',
    role: 'Systems Analyst',
    status: 'On Duty',
    contact: '+1 (555) 012-4455',
    email: 'j.callahan@defense.mil',
    joinedDate: '2021-08-19'
  },
  {
    id: 'PERS-014',
    serviceId: 'MIL-33211',
    name: 'Maya Lin',
    rank: 'Corporal',
    unit: 'Medical Readiness Corp',
    role: 'Nurse Specialist',
    status: 'On Duty',
    contact: '+1 (555) 018-7788',
    email: 'm.lin@defense.mil',
    joinedDate: '2023-01-15'
  },
  {
    id: 'PERS-015',
    serviceId: 'MIL-22100',
    name: 'Travis Scott',
    rank: 'Private',
    unit: '1st Infantry Platoon',
    role: 'Scout',
    status: 'On Duty',
    contact: '+1 (555) 016-5544',
    email: 't.scott@defense.mil',
    joinedDate: '2024-02-10'
  },
  {
    id: 'PERS-016',
    serviceId: 'MIL-11209',
    name: 'Victoria Hughes',
    rank: 'Major',
    unit: 'Tactical Ops Command',
    role: 'Deputy CO',
    status: 'On Duty',
    contact: '+1 (555) 014-3322',
    email: 'v.hughes@defense.mil',
    joinedDate: '2017-09-01'
  }
];

const initialLeaves: LeaveRequest[] = [
  {
    id: 'LV-1001',
    personnelId: 'PERS-004',
    personnelName: 'Darius Miller',
    personnelRank: 'Sergeant',
    unit: '1st Infantry Platoon',
    leaveType: 'Annual Leave',
    startDate: '2026-08-01',
    endDate: '2026-08-10',
    reason: 'Family emergency and annual leave entitlement.',
    status: 'Approved',
    requestedAt: '2026-07-25T10:00:00Z',
    reviewedAt: '2026-07-26T14:30:00Z',
    reviewerNotes: 'Approved by Col. Sterling. Coverage ensured.'
  },
  {
    id: 'LV-1002',
    personnelId: 'PERS-005',
    personnelName: 'Sarah Connor',
    personnelRank: 'Corporal',
    unit: '1st Infantry Platoon',
    leaveType: 'Emergency Leave',
    startDate: '2026-08-05',
    endDate: '2026-08-12',
    reason: 'Urgent medical requirement for family member.',
    status: 'Pending',
    requestedAt: '2026-08-01T16:20:00Z',
    triggersShortage: true
  },
  {
    id: 'LV-1003',
    personnelId: 'PERS-007',
    personnelName: 'Aisha Patel',
    personnelRank: 'Captain',
    unit: 'Medical Readiness Corp',
    leaveType: 'Convalescent Leave',
    startDate: '2026-08-15',
    endDate: '2026-08-20',
    reason: 'Post-duty medical recovery.',
    status: 'Pending',
    requestedAt: '2026-08-02T08:00:00Z'
  },
  {
    id: 'LV-1004',
    personnelId: 'PERS-011',
    personnelName: 'Carlos Mendez',
    personnelRank: 'Private',
    unit: 'Logistics & Support',
    leaveType: 'Annual Leave',
    startDate: '2026-07-10',
    endDate: '2026-07-15',
    reason: 'Personal leave request.',
    status: 'Rejected',
    requestedAt: '2026-07-01T09:00:00Z',
    reviewedAt: '2026-07-02T11:15:00Z',
    reviewerNotes: 'Rejected due to critical logistics operational deployment window.'
  }
];

// File Reading & Writing Utilities
function readJSON<T>(filePath: string, fallback: T): T {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2), 'utf-8');
      return fallback;
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data) as T;
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return fallback;
  }
}

function writeJSON<T>(filePath: string, data: T): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
  }
}

// Seed initialization if files don't exist
function initStorage() {
  if (!fs.existsSync(SETTINGS_FILE)) writeJSON(SETTINGS_FILE, initialSettings);
  if (!fs.existsSync(PERSONNEL_FILE)) writeJSON(PERSONNEL_FILE, initialPersonnel);
  if (!fs.existsSync(LEAVES_FILE)) writeJSON(LEAVES_FILE, initialLeaves);
}

initStorage();

// Helper Smart Logic: Calculate Shortage Impact
function calculateShortageImpact(
  targetPersonnelId: string,
  startDate: string,
  endDate: string
): ShortageImpactCheck {
  const personnelList = readJSON<Personnel[]>(PERSONNEL_FILE, initialPersonnel);
  const settings = readJSON<SystemSettings>(SETTINGS_FILE, initialSettings);

  const targetPerson = personnelList.find(p => p.id === targetPersonnelId);
  if (!targetPerson) {
    return {
      willCauseShortage: false,
      currentOnDuty: 0,
      projectedOnDuty: 0,
      requiredMin: settings.minManpowerCount,
      currentPercentage: 0,
      projectedPercentage: 0,
      warningMessage: 'Personnel record not found.'
    };
  }

  const totalCount = personnelList.length;
  // Currently active on duty personnel
  const currentOnDuty = personnelList.filter(p => p.status === 'On Duty').length;

  // If this person is currently "On Duty", approving leave reduces On Duty count by 1
  const isCurrentlyOnDuty = targetPerson.status === 'On Duty';
  const projectedOnDuty = isCurrentlyOnDuty ? currentOnDuty - 1 : currentOnDuty;

  const currentPercentage = totalCount > 0 ? Math.round((currentOnDuty / totalCount) * 100) : 0;
  const projectedPercentage = totalCount > 0 ? Math.round((projectedOnDuty / totalCount) * 100) : 0;

  // Check against overall minimum threshold count & percentage
  const overallShortageCount = projectedOnDuty < settings.minManpowerCount;
  const overallShortagePct = projectedPercentage < settings.minManpowerPercentage;

  // Unit-level shortage check
  const unit = targetPerson.unit;
  const unitThreshold = settings.unitThresholds[unit] || 2;
  const unitPersonnel = personnelList.filter(p => p.unit === unit);
  const currentUnitOnDuty = unitPersonnel.filter(p => p.status === 'On Duty').length;
  const projectedUnitOnDuty = isCurrentlyOnDuty ? currentUnitOnDuty - 1 : currentUnitOnDuty;
  const unitShortage = projectedUnitOnDuty < unitThreshold;

  const willCauseShortage = overallShortageCount || overallShortagePct || unitShortage;

  let warningMessage = '';
  if (willCauseShortage) {
    const reasons: string[] = [];
    if (overallShortageCount) {
      reasons.push(`Total active strength drops to ${projectedOnDuty} (Minimum required: ${settings.minManpowerCount})`);
    }
    if (overallShortagePct) {
      reasons.push(`Readiness drops to ${projectedPercentage}% (Threshold: ${settings.minManpowerPercentage}%)`);
    }
    if (unitShortage) {
      reasons.push(`Unit "${unit}" strength drops to ${projectedUnitOnDuty} active personnel (Unit minimum required: ${unitThreshold})`);
    }
    warningMessage = `CRITICAL MANPOWER SHORTAGE WARNING: Approving leave for ${targetPerson.rank} ${targetPerson.name} will trigger operational deficiencies. ${reasons.join('. ')}.`;
  } else {
    warningMessage = `Manpower capacity cleared. Projected readiness: ${projectedPercentage}% (${projectedOnDuty}/${totalCount} personnel on active duty).`;
  }

  return {
    willCauseShortage,
    currentOnDuty,
    projectedOnDuty,
    requiredMin: settings.minManpowerCount,
    currentPercentage,
    projectedPercentage,
    unitImpact: {
      unit,
      currentUnitOnDuty,
      projectedUnitOnDuty,
      unitRequired: unitThreshold,
      unitShortage
    },
    warningMessage
  };
}

// REST API ROUTES

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 2. Dashboard Statistics & Readiness Summary
app.get('/api/dashboard', (req, res) => {
  const personnel = readJSON<Personnel[]>(PERSONNEL_FILE, initialPersonnel);
  const settings = readJSON<SystemSettings>(SETTINGS_FILE, initialSettings);

  const totalPersonnel = personnel.length;
  const onDuty = personnel.filter(p => p.status === 'On Duty').length;
  const onLeave = personnel.filter(p => p.status === 'On Leave').length;
  const inTraining = personnel.filter(p => p.status === 'Training').length;
  const offDuty = personnel.filter(p => p.status === 'Off Duty').length;

  const readinessPercentage = totalPersonnel > 0 ? Math.round((onDuty / totalPersonnel) * 100) : 0;
  const isShortageAlert = onDuty < settings.minManpowerCount || readinessPercentage < settings.minManpowerPercentage;

  let activeShortageMessage: string | null = null;
  if (isShortageAlert) {
    activeShortageMessage = `DEFCON ALERT: Active manpower (${onDuty}) is currently BELOW required operational threshold (${settings.minManpowerCount} personnel / ${settings.minManpowerPercentage}%).`;
  }

  // Unit Breakdown
  const units = Array.from(new Set(personnel.map(p => p.unit)));
  const unitBreakdown = units.map(unit => {
    const unitP = personnel.filter(p => p.unit === unit);
    const unitTotal = unitP.length;
    const unitDuty = unitP.filter(p => p.status === 'On Duty').length;
    const unitL = unitP.filter(p => p.status === 'On Leave').length;
    const unitT = unitP.filter(p => p.status === 'Training').length;
    const required = settings.unitThresholds[unit] || 2;
    return {
      unit,
      total: unitTotal,
      onDuty: unitDuty,
      onLeave: unitL,
      training: unitT,
      required,
      isShortage: unitDuty < required
    };
  });

  const stats: DashboardStats = {
    totalPersonnel,
    onDuty,
    onLeave,
    inTraining,
    offDuty,
    readinessPercentage,
    isShortageAlert,
    activeShortageMessage,
    unitBreakdown
  };

  res.json(stats);
});

// 3. Personnel REST APIs
app.get('/api/personnel', (req, res) => {
  let list = readJSON<Personnel[]>(PERSONNEL_FILE, initialPersonnel);
  const { search, rank, status, unit } = req.query;

  if (search && typeof search === 'string') {
    const s = search.toLowerCase();
    list = list.filter(p => 
      p.name.toLowerCase().includes(s) || 
      p.serviceId.toLowerCase().includes(s) ||
      p.role.toLowerCase().includes(s)
    );
  }

  if (rank && typeof rank === 'string' && rank !== 'All') {
    list = list.filter(p => p.rank === rank);
  }

  if (status && typeof status === 'string' && status !== 'All') {
    list = list.filter(p => p.status === status);
  }

  if (unit && typeof unit === 'string' && unit !== 'All') {
    list = list.filter(p => p.unit === unit);
  }

  res.json(list);
});

app.post('/api/personnel', (req, res) => {
  const personnel = readJSON<Personnel[]>(PERSONNEL_FILE, initialPersonnel);
  const newP: Personnel = {
    id: `PERS-${String(Date.now()).slice(-4)}`,
    serviceId: req.body.serviceId || `MIL-${Math.floor(10000 + Math.random() * 90000)}`,
    name: req.body.name,
    rank: req.body.rank || 'Private',
    unit: req.body.unit || '1st Infantry Platoon',
    role: req.body.role || 'Rifleman',
    status: req.body.status || 'On Duty',
    contact: req.body.contact || '+1 (555) 000-0000',
    email: req.body.email || `${req.body.name.toLowerCase().replace(/\s+/g, '.')}@defense.mil`,
    joinedDate: req.body.joinedDate || new Date().toISOString().split('T')[0],
    notes: req.body.notes || ''
  };

  personnel.unshift(newP);
  writeJSON(PERSONNEL_FILE, personnel);
  res.status(201).json(newP);
});

app.put('/api/personnel/:id', (req, res) => {
  const personnel = readJSON<Personnel[]>(PERSONNEL_FILE, initialPersonnel);
  const index = personnel.findIndex(p => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Personnel not found' });
  }

  personnel[index] = { ...personnel[index], ...req.body };
  writeJSON(PERSONNEL_FILE, personnel);
  res.json(personnel[index]);
});

app.delete('/api/personnel/:id', (req, res) => {
  let personnel = readJSON<Personnel[]>(PERSONNEL_FILE, initialPersonnel);
  const target = personnel.find(p => p.id === req.params.id);
  if (!target) {
    return res.status(404).json({ error: 'Personnel not found' });
  }

  personnel = personnel.filter(p => p.id !== req.params.id);
  writeJSON(PERSONNEL_FILE, personnel);
  res.json({ message: 'Personnel record removed successfully', id: req.params.id });
});

// 4. Leave Request REST APIs
app.get('/api/leaves', (req, res) => {
  let leaves = readJSON<LeaveRequest[]>(LEAVES_FILE, initialLeaves);
  const { status, personnelId } = req.query;

  if (status && typeof status === 'string' && status !== 'All') {
    leaves = leaves.filter(l => l.status === status);
  }

  if (personnelId && typeof personnelId === 'string') {
    leaves = leaves.filter(l => l.personnelId === personnelId);
  }

  res.json(leaves);
});

// Leave Impact Simulation Engine
function runLeaveSimulation(targetPersonnelIds: string[]): LeaveSimulationResult {
  const personnelList = readJSON<Personnel[]>(PERSONNEL_FILE, initialPersonnel);
  const settings = readJSON<SystemSettings>(SETTINGS_FILE, initialSettings);

  const totalPersonnel = personnelList.length;
  const baselineActiveCount = personnelList.filter(p => p.status === 'On Duty').length;
  const baselineReadinessScore = totalPersonnel > 0 ? Math.round((baselineActiveCount / totalPersonnel) * 100) : 0;

  const targetIdsSet = new Set(targetPersonnelIds);
  const simulatedLeavePersons = personnelList.filter(p => targetIdsSet.has(p.id));

  // Count how many of these targeted personnel are currently 'On Duty'
  const activeDutyTakingLeave = simulatedLeavePersons.filter(p => p.status === 'On Duty');
  const simulatedActiveCount = Math.max(0, baselineActiveCount - activeDutyTakingLeave.length);
  const overallReadinessScore = totalPersonnel > 0 ? Math.round((simulatedActiveCount / totalPersonnel) * 100) : 0;

  const minimumRequired = settings.minManpowerCount;
  const minPercentage = settings.minManpowerPercentage;

  const warnings: string[] = [];

  if (simulatedActiveCount < minimumRequired) {
    warnings.push(`Overall active strength (${simulatedActiveCount}) drops below battalion minimum requirement (${minimumRequired}).`);
  }
  if (overallReadinessScore < minPercentage) {
    warnings.push(`Overall readiness score (${overallReadinessScore}%) drops below threshold requirement (${minPercentage}%).`);
  }

  // Calculate unit-level simulation
  const units = Array.from(new Set(personnelList.map(p => p.unit)));
  const unitImpacts: UnitSimulationImpact[] = units.map(unitName => {
    const unitMembers = personnelList.filter(p => p.unit === unitName);
    const totalMembers = unitMembers.length;
    const baselineActive = unitMembers.filter(p => p.status === 'On Duty').length;

    // Affected personnel in this unit
    const affected = unitMembers.filter(p => targetIdsSet.has(p.id));
    const activeAffected = affected.filter(p => p.status === 'On Duty');
    const impactDelta = activeAffected.length;
    const simulatedActive = Math.max(0, baselineActive - impactDelta);

    const requiredThreshold = settings.unitThresholds[unitName] || 2;
    const unitReadinessScore = totalMembers > 0 ? Math.round((simulatedActive / totalMembers) * 100) : 0;

    let indicator: 'GREEN' | 'YELLOW' | 'RED' = 'GREEN';
    let statusMessage = '';

    if (simulatedActive < requiredThreshold) {
      indicator = 'RED';
      const deficit = requiredThreshold - simulatedActive;
      statusMessage = `CRITICAL DEFICIT: ${deficit} personnel below unit minimum (${requiredThreshold}).`;
      warnings.push(`Unit "${unitName}" experiences manpower shortage (${simulatedActive}/${requiredThreshold} active).`);
    } else if (simulatedActive === requiredThreshold || unitReadinessScore < 65) {
      indicator = 'YELLOW';
      statusMessage = `CAUTION THRESHOLD: Operating at minimum required capacity (${requiredThreshold}).`;
    } else {
      indicator = 'GREEN';
      const surplus = simulatedActive - requiredThreshold;
      statusMessage = `OPTIMAL STRENGTH: +${surplus} above minimum unit threshold.`;
    }

    return {
      unit: unitName,
      totalMembers,
      baselineActive,
      simulatedActive,
      requiredThreshold,
      unitReadinessScore,
      indicator,
      impactDelta,
      statusMessage,
      affectedPersonnel: affected.map(a => ({ id: a.id, name: a.name, rank: a.rank, role: a.role }))
    };
  });

  const hasRedUnit = unitImpacts.some(u => u.indicator === 'RED');
  const hasYellowUnit = unitImpacts.some(u => u.indicator === 'YELLOW');

  let overallIndicator: 'GREEN' | 'YELLOW' | 'RED' = 'GREEN';
  let overallStatusText = 'OPTIMAL READINESS - FULL MISSION CAPABILITY';

  if (simulatedActiveCount < minimumRequired || overallReadinessScore < minPercentage || hasRedUnit) {
    overallIndicator = 'RED';
    overallStatusText = 'CRITICAL SHORTAGE DETECTED - DEFCON ALERT';
  } else if (simulatedActiveCount === minimumRequired || overallReadinessScore < 75 || hasYellowUnit) {
    overallIndicator = 'YELLOW';
    overallStatusText = 'CAUTION - REDUCED OPERATIONAL BUFFER';
  }

  return {
    overallReadinessScore,
    baselineReadinessScore,
    overallIndicator,
    overallStatusText,
    baselineActiveCount,
    simulatedActiveCount,
    totalPersonnel,
    minimumRequired,
    simulatedLeaveCount: targetPersonnelIds.length,
    unitImpacts,
    warnings
  };
}

// Pre-check impact of leave request
app.post('/api/leaves/check-impact', (req, res) => {
  const { personnelId, startDate, endDate } = req.body;
  if (!personnelId) {
    return res.status(400).json({ error: 'personnelId is required' });
  }

  const impact = calculateShortageImpact(personnelId, startDate, endDate);
  res.json(impact);
});

// Leave Impact Simulator API
app.post('/api/simulate-leave', (req, res) => {
  const { personnelIds, leaveRequestId } = req.body;
  let targetIds: string[] = [];

  if (Array.isArray(personnelIds) && personnelIds.length > 0) {
    targetIds = personnelIds;
  } else if (leaveRequestId) {
    const leaves = readJSON<LeaveRequest[]>(LEAVES_FILE, initialLeaves);
    const leave = leaves.find(l => l.id === leaveRequestId);
    if (leave) {
      targetIds = [leave.personnelId];
    }
  }

  const result = runLeaveSimulation(targetIds);
  res.json(result);
});

// Submit Leave Request
app.post('/api/leaves', (req, res) => {
  const personnelList = readJSON<Personnel[]>(PERSONNEL_FILE, initialPersonnel);
  const leaves = readJSON<LeaveRequest[]>(LEAVES_FILE, initialLeaves);

  const p = personnelList.find(person => person.id === req.body.personnelId);
  if (!p) {
    return res.status(404).json({ error: 'Personnel not found' });
  }

  const impact = calculateShortageImpact(p.id, req.body.startDate, req.body.endDate);

  const newLeave: LeaveRequest = {
    id: `LV-${String(Date.now()).slice(-4)}`,
    personnelId: p.id,
    personnelName: p.name,
    personnelRank: p.rank,
    unit: p.unit,
    leaveType: req.body.leaveType || 'Annual Leave',
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    reason: req.body.reason || 'General Leave Request',
    status: 'Pending',
    requestedAt: new Date().toISOString(),
    triggersShortage: impact.willCauseShortage
  };

  leaves.unshift(newLeave);
  writeJSON(LEAVES_FILE, leaves);
  res.status(201).json({ leave: newLeave, shortageImpact: impact });
});

// Approve or Reject Leave Request
app.put('/api/leaves/:id/status', (req, res) => {
  const leaves = readJSON<LeaveRequest[]>(LEAVES_FILE, initialLeaves);
  const personnelList = readJSON<Personnel[]>(PERSONNEL_FILE, initialPersonnel);
  const settings = readJSON<SystemSettings>(SETTINGS_FILE, initialSettings);

  const leaveIndex = leaves.findIndex(l => l.id === req.params.id);
  if (leaveIndex === -1) {
    return res.status(404).json({ error: 'Leave request not found' });
  }

  const targetLeave = leaves[leaveIndex];
  const newStatus = req.body.status as 'Approved' | 'Rejected' | 'Pending';
  const forceOverride = req.body.forceOverride === true;
  const reviewerNotes = req.body.reviewerNotes || '';

  // Check shortage impact if trying to approve
  if (newStatus === 'Approved') {
    const impact = calculateShortageImpact(targetLeave.personnelId, targetLeave.startDate, targetLeave.endDate);

    if (impact.willCauseShortage && settings.autoBlockShortage && !forceOverride) {
      return res.status(400).json({
        error: 'APPROVAL BLOCKED: Minimum manpower threshold violation.',
        impact
      });
    }

    // Update personnel status to 'On Leave'
    const pIndex = personnelList.findIndex(p => p.id === targetLeave.personnelId);
    if (pIndex !== -1) {
      personnelList[pIndex].status = 'On Leave';
      writeJSON(PERSONNEL_FILE, personnelList);
    }
  } else if (newStatus === 'Rejected' || newStatus === 'Pending') {
    // If leave was previously approved and is now changed back or rejected, update personnel back to On Duty
    if (targetLeave.status === 'Approved') {
      const pIndex = personnelList.findIndex(p => p.id === targetLeave.personnelId);
      if (pIndex !== -1) {
        personnelList[pIndex].status = 'On Duty';
        writeJSON(PERSONNEL_FILE, personnelList);
      }
    }
  }

  leaves[leaveIndex].status = newStatus;
  leaves[leaveIndex].reviewedAt = new Date().toISOString();
  leaves[leaveIndex].reviewerNotes = reviewerNotes;

  writeJSON(LEAVES_FILE, leaves);
  res.json(leaves[leaveIndex]);
});

app.delete('/api/leaves/:id', (req, res) => {
  let leaves = readJSON<LeaveRequest[]>(LEAVES_FILE, initialLeaves);
  const target = leaves.find(l => l.id === req.params.id);
  if (!target) {
    return res.status(404).json({ error: 'Leave request not found' });
  }

  leaves = leaves.filter(l => l.id !== req.params.id);
  writeJSON(LEAVES_FILE, leaves);
  res.json({ message: 'Leave request deleted successfully', id: req.params.id });
});

// 5. System Settings REST APIs
app.get('/api/settings', (req, res) => {
  const settings = readJSON<SystemSettings>(SETTINGS_FILE, initialSettings);
  res.json(settings);
});

app.put('/api/settings', (req, res) => {
  let settings = readJSON<SystemSettings>(SETTINGS_FILE, initialSettings);
  settings = { ...settings, ...req.body };
  writeJSON(SETTINGS_FILE, settings);
  res.json(settings);
});

// 6. Reset Data API
app.post('/api/reset-data', (req, res) => {
  writeJSON(SETTINGS_FILE, initialSettings);
  writeJSON(PERSONNEL_FILE, initialPersonnel);
  writeJSON(LEAVES_FILE, initialLeaves);
  res.json({ message: 'System database successfully reset to default military unit seed data.' });
});

// Vite Middleware for development & static serving for production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Military Smart Leave & Duty Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
