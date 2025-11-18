import React from "react";
import { useTimesheet } from "../state/useTimesheetState";

/**
 * PUBLIC_INTERFACE
 * TimesheetViewSwitcher renders Week/Month tabs and date navigation.
 * Accessibility: tabs have aria-selected, role="tablist", and buttons labeled.
 */
export default function TimesheetViewSwitcher() {
  const { view, setView, weekRangeLabel, gotoPrev, gotoToday, gotoNext } = useTimesheet();

  return (
    <div className="ts-toolbar">
      <div
        className="ts-tabs"
        role="tablist"
        aria-label="View switcher"
      >
        <button
          role="tab"
          aria-selected={view === "week"}
          className={`ts-tab ${view === "week" ? "ts-tab--active" : ""}`}
          onClick={() => setView("week")}
        >
          Week
        </button>
        <button
          role="tab"
          aria-selected={view === "month"}
          className={`ts-tab ${view === "month" ? "ts-tab--active" : ""}`}
          onClick={() => setView("month")}
        >
          Month
        </button>
      </div>

      <div className="ts-nav">
        <button className="btn btn--ghost" onClick={gotoPrev} aria-label="Previous period">
          ‹
        </button>
        <button className="btn btn--ghost" onClick={gotoToday} aria-label="Go to today">
          Today
        </button>
        <button className="btn btn--ghost" onClick={gotoNext} aria-label="Next period">
          ›
        </button>
        <div className="ts-range" aria-live="polite">
          {weekRangeLabel}
        </div>
      </div>
    </div>
  );
}
