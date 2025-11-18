import React from "react";
import { useTimesheet } from "../state/useTimesheetState";

/**
 * PUBLIC_INTERFACE
 * WeekGrid renders a 7-column grid for the current week.
 * - Highlights today
 * - Click to select day
 */
export default function WeekGrid() {
  const { weekDays, selectedDay, setSelectedDay, entriesByDay } = useTimesheet();

  return (
    <div
      className="ts-week-grid"
      role="grid"
      aria-label="Weekly calendar grid"
    >
      {weekDays.map((d) => {
        const isSelected = selectedDay.toDateString() === d.date.toDateString();
        return (
          <div
            key={d.key}
            role="gridcell"
            aria-selected={isSelected}
            tabIndex={0}
            className={
              "ts-day " +
              (d.isToday ? " ts-day--today" : "") +
              (isSelected ? " ts-day--selected" : "")
            }
            onClick={() => setSelectedDay(d.date)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setSelectedDay(d.date);
            }}
          >
            <div className="ts-day__header">
              <span className="ts-day__dow">{d.dow}</span>
              <span className="ts-day__date">{d.date.getDate()}</span>
            </div>
            <div className="ts-day__entries">
              {(entriesByDay[d.key] || []).map((en, idx) => (
                <div key={idx} className="ts-chip" title={`${en.project} • ${en.hours}h`}>
                  {en.task} · {en.hours}h
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
