import React from "react";
import { useTimesheet } from "../state/useTimesheetState";

/**
 * PUBLIC_INTERFACE
 * TimesheetHeader displays title, status chip, optional team selector, and Clock In/Out.
 * Behavior:
 * - Status reflects current week's status
 * - Clock button toggles local clock state
 */
export default function TimesheetHeader() {
  const { status, isClockedIn, toggleClock, canSeeTeam, selectedTeam, setSelectedTeam } =
    useTimesheet();

  return (
    <div className="ts-header">
      <div className="ts-header__left">
        <h2 className="ts-title">This Week</h2>
        <span className={`ts-status ts-status--${status.toLowerCase()}`} role="status" aria-live="polite">
          {status}
        </span>
        {canSeeTeam && (
          <label className="ts-team">
            <span className="visually-hidden">Select team</span>
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              aria-label="Team selector"
            >
              <option value="my-team">My Team</option>
              <option value="qa">QA</option>
              <option value="engineering">Engineering</option>
            </select>
          </label>
        )}
      </div>
      <div className="ts-header__right">
        <button
          className={`btn ${isClockedIn ? "btn--secondary" : "btn--primary"}`}
          onClick={toggleClock}
          aria-pressed={isClockedIn}
          aria-label={isClockedIn ? "Clock out" : "Clock in"}
        >
          {isClockedIn ? "Clock Out" : "Clock In"}
        </button>
      </div>
    </div>
  );
}
