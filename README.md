# Smart Leave & Duty Management System

A military-grade tactical personnel, leave management, and operational readiness platform built for defense and high-reliability organizational rosters. Features real-time manpower shortage detection, unit readiness scoring, and prospective leave impact simulation.

---

## 🌟 Key Features

### 🛡️ 1. Command Operations Dashboard
- **Real-Time Readiness Metric**: Tracks active duty count against battalion minimum requirements.
- **Operational Status Indicators**: Displays real-time readiness status (`OPTIMAL`, `CAUTION`, `CRITICAL DEFICIT`).
- **Quick Action Center**: One-click navigation to register personnel, review leave requests, or run leave impact simulations.

### 👥 2. Tactical Personnel Roster
- **Comprehensive Roster**: Filter and search personnel by rank, unit, role, or duty status (`On Duty`, `On Leave`, `TAD/TDY`).
- **Unit Breakdown**: Track distribution across tactical units (Alpha Company, Bravo Company, Charlie Company, HQ Battalion, Support Platoon).
- **Service & Leave Records**: View personnel leave histories, available leave balances, and military ranks.

### 📅 3. Intelligent Leave Management & Pre-Check
- **Automated Shortage Detection**: Pre-calculates unit and battalion manpower impact before leave approval.
- **Critical Threshold Warning Modal**: Triggers interactive warning alerts if approving a request drops duty strength below required unit thresholds.
- **Reviewer Notes & Workflow**: Add notes and instantly approve or reject leave requests with immediate status synchronization.

### ⚡ 4. Prospective Leave Impact Simulator
- **Interactive Multi-Personnel Simulation**: Select one or multiple personnel or click "Simulate All Pending Leaves" to test prospective absences.
- **Unit Readiness Scores (0-100%)**: Dynamically evaluates unit-level readiness and highlights threshold breaches.
- **Color-Coded Status Matrix**:
  - 🟢 **GREEN**: Operational strength above unit threshold.
  - 🟡 **YELLOW**: Operating at minimum required threshold.
  - 🔴 **RED**: Critical manpower shortage / deficit detected.

### ⚙️ 5. Battalion Configuration & Settings
- **Customizable Thresholds**: Set overall minimum manpower counts, percentage baselines, and individual unit-level minimum operational requirements.
- **Persistence & Reset Controls**: Save custom operational rules or restore sample military roster data on demand.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide React Icons
- **Backend**: Node.js, Express, TSX, ESBuild
- **Build & Runtime**: Vite, Custom Express Server with Vite Middleware
- **Data Persistence**: JSON-backed local storage engine (`/data/personnel.json`, `/data/leaves.json`, `/data/settings.json`)

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or later
- **npm**: v9.0.0 or later

### Installation

1. Install project dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:3000`.

### Production Build

1. Build the frontend and bundle the server:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm run start
   ```

---

## 📡 API Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/dashboard/stats` | `GET` | Retrieves overall battalion stats and active status indicators. |
| `/api/personnel` | `GET` / `POST` | Fetches all personnel or creates a new personnel record. |
| `/api/personnel/:id` | `PUT` / `DELETE` | Updates or removes a personnel record. |
| `/api/leaves` | `GET` / `POST` | Fetches leave requests or submits a new leave application. |
| `/api/leaves/:id/approve` | `POST` | Approves a leave request with optional reviewer notes. |
| `/api/leaves/:id/reject` | `POST` | Rejects a leave request. |
| `/api/leaves/check-impact` | `POST` | Pre-calculates manpower impact for a single leave request. |
| `/api/simulate-leave` | `POST` | Executes multi-personnel unit readiness simulation engine. |
| `/api/settings` | `GET` / `POST` | Retrieves or updates battalion operational thresholds. |

---


