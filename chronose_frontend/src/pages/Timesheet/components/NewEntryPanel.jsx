import React, { useMemo } from "react";
import { useTimesheet } from "../state/useTimesheetState";
import { canEditEntries, canSubmitOwnTimesheet, currentUserRole } from "../../../lib/permissions";

/**
 * PUBLIC_INTERFACE
 * NewEntryPanel provides form for Work Entry / Leave Request with validation and actions:
 * - Save as Draft: persists to localStorage
 * - Save: stores to local state (unsent)
 * - Submit: sets week status to Submitted and locks
 * RBAC & State:
 * - Disable entry editing if week is Submitted/Approved
 * - All roles can submit their own timesheet
 */
export default function NewEntryPanel() {
  const {
    mode,
    setMode,
    form,
    updateForm,
    canSubmit,
    saveDraft,
    saveEntry,
    submitWeek,
    status,
  } = useTimesheet();

  const role = useMemo(() => currentUserRole(), []);
  const lockedByStatus = status === "Submitted" || status === "Approved";
  const canEdit = canEditEntries(role) && !lockedByStatus;
  const canSubmitSelf = canSubmitOwnTimesheet(role);

  return (
    <div className="ts-panel ts-card">
      <div className="ts-segmented" role="tablist" aria-label="Entry type">
        <button
          role="tab"
          aria-selected={mode === "work"}
          className={`ts-seg ${mode === "work" ? "ts-seg--active" : ""}`}
          onClick={() => setMode("work")}
          disabled={!canEdit}
        >
          Work Entry
        </button>
        <button
          role="tab"
          aria-selected={mode === "leave"}
          className={`ts-seg ${mode === "leave" ? "ts-seg--active" : ""}`}
          onClick={() => setMode("leave")}
          disabled={!canEdit}
        >
          Leave Request
        </button>
      </div>

      <form
        className="ts-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (canSubmit && canEdit) saveEntry();
        }}
        aria-disabled={!canEdit}
      >
        <div className="ts-form__row">
          <label>
            <span>Project</span>
            <input
              type="text"
              value={form.project}
              onChange={(e) => updateForm({ project: e.target.value })}
              placeholder="Enter project"
              disabled={!canEdit}
            />
          </label>
        </div>

        <div className="ts-form__row">
          <label>
            <span>Task</span>
            <input
              type="text"
              value={form.task}
              onChange={(e) => updateForm({ task: e.target.value })}
              placeholder="e.g., Testing"
              disabled={!canEdit}
            />
          </label>
        </div>

        <div className="ts-form__row">
          <label>
            <span>Type</span>
            <select
              value={form.type}
              onChange={(e) => updateForm({ type: e.target.value })}
              disabled={!canEdit}
            >
              <option value="">Select</option>
              <option value="work">Work</option>
              <option value="leave">Leave</option>
              <option value="meeting">Meeting</option>
              <option value="admin">Admin</option>
            </select>
          </label>
          <label>
            <span>Time (hours)</span>
            <input
              type="number"
              min="0"
              step="0.25"
              value={form.hours}
              onChange={(e) => updateForm({ hours: e.target.value })}
              placeholder="0.00"
              disabled={!canEdit}
            />
          </label>
        </div>

        <div className="ts-form__row">
          <label className="ts-form__full">
            <span>Notes</span>
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => updateForm({ notes: e.target.value })}
              placeholder="Optional notes"
              disabled={!canEdit}
            />
          </label>
        </div>

        <div className="ts-form__actions">
          <button
            type="button"
            className="btn btn--ghost"
            onClick={saveDraft}
            aria-label="Save as Draft"
            disabled={!canEdit}
          >
            Save as Draft
          </button>
          <button
            type="submit"
            className="btn btn--secondary"
            aria-label="Save entry"
            disabled={!canSubmit || !canEdit}
          >
            Save
          </button>
          <button
            type="button"
            className="btn btn--primary"
            onClick={submitWeek}
            aria-label="Submit timesheet"
            disabled={!canSubmit || !canSubmitSelf}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
