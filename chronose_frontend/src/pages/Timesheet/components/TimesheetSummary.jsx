import React from "react";
import { useTimesheet } from "../state/useTimesheetState";

/**
 * PUBLIC_INTERFACE
 * TimesheetSummary shows KPI cards:
 * - Total Hours This Week
 * - Working Days
 * - Avg/Day
 * - Draft Entries
 * - Leaves Taken
 */
export default function TimesheetSummary() {
  const { kpis } = useTimesheet();

  const items = [
    { key: "totalHours", label: "Total Hours This Week", value: kpis.totalHours.toFixed(1) },
    { key: "workingDays", label: "Working Days", value: kpis.workingDays },
    { key: "avgPerDay", label: "Avg/Day", value: kpis.avgPerDay.toFixed(1) },
    { key: "drafts", label: "Draft Entries", value: kpis.drafts },
    { key: "leaves", label: "Leaves Taken", value: kpis.leaves },
  ];

  return (
    <div className="ts-kpis" role="region" aria-label="Timesheet summary">
      {items.map((i) => (
        <div key={i.key} className="ts-card ts-kpi">
          <div className="ts-kpi__label">{i.label}</div>
          <div className="ts-kpi__value">{i.value}</div>
        </div>
      ))}
    </div>
  );
}
