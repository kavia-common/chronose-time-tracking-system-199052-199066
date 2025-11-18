import React, { useMemo } from "react";
import "./timesheet.css";
import TopBar from "../../components/layout/TopBar";
import TimesheetHeader from "./components/TimesheetHeader";
import TimesheetSummary from "./components/TimesheetSummary";
import TimesheetViewSwitcher from "./components/TimesheetViewSwitcher";
import WeekGrid from "./components/WeekGrid";
import MonthGrid from "./components/MonthGrid";
import NewEntryPanel from "./components/NewEntryPanel";
import { TimesheetProvider, useTimesheet } from "./state/useTimesheetState";

/**
 * PUBLIC_INTERFACE
 * EmployeeTimesheetPage renders the employee timesheet UI including:
 * - Header with status and clock controls
 * - KPI summary cards
 * - View switcher (Week/Month) and date navigation
 * - Week/Month grid
 * - New Entry right panel with segmented control for Work Entry / Leave Request
 */
export default function EmployeeTimesheetPage() {
  return (
    <TimesheetProvider>
      <TimesheetPageInner />
    </TimesheetProvider>
  );
}

function TimesheetPageInner() {
  const { view } = useTimesheet();
  const title = useMemo(() => "Employee Timesheet", []);

  return (
    <div className="timesheet-page">
      <TopBar title={title} />
      <div className="timesheet-grid">
        <section className="ts-left">
          <TimesheetHeader />
          <TimesheetSummary />
          <TimesheetViewSwitcher />
          <div className="ts-calendar">
            {view === "week" ? <WeekGrid /> : <MonthGrid />}
          </div>
        </section>
        <aside className="ts-right" aria-label="New Entry Panel">
          <NewEntryPanel />
        </aside>
      </div>
    </div>
  );
}
