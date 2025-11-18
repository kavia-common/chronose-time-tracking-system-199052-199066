import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";

const TimesheetContext = createContext(null);

// Helpers
const startOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay(); // 0 Sun ... 6 Sat
  const diff = (day + 6) % 7; // make Monday the start
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
};
const endOfWeek = (date) => {
  const s = startOfWeek(date);
  const e = new Date(s);
  e.setDate(s.getDate() + 6);
  e.setHours(23, 59, 59, 999);
  return e;
};
const formatRange = (start, end) => {
  const fmt = (d) =>
    `${d.toLocaleString(undefined, { month: "short" })} ${d.getDate()}, ${d.getFullYear()}`;
  return `${fmt(start)} - ${fmt(end)}`;
};
const dayKey = (d) => d.toISOString().slice(0, 10);

// Initial State
const initial = () => {
  const today = new Date();
  const s = startOfWeek(today);
  const storedDrafts = JSON.parse(localStorage.getItem("chronose:ts:drafts") || "[]");
  return {
    view: "week",
    anchorDate: today,
    selectedDay: today,
    status: "Draft", // Draft | Submitted | Approved | Rejected
    isClockedIn: false,
    selectedTeam: "my-team",
    form: {
      project: "",
      task: "",
      type: "",
      hours: "",
      notes: "",
    },
    entries: [], // persisted local entries (non-draft)
    drafts: storedDrafts,
    weekStart: s,
  };
};

// Reducer
function reducer(state, action) {
  switch (action.type) {
    case "SET_VIEW":
      return { ...state, view: action.view };
    case "SET_ANCHOR":
      return { ...state, anchorDate: action.date, weekStart: startOfWeek(action.date) };
    case "SET_SELECTED_DAY":
      return { ...state, selectedDay: action.date };
    case "TOGGLE_CLOCK":
      return { ...state, isClockedIn: !state.isClockedIn };
    case "UPDATE_FORM":
      return { ...state, form: { ...state.form, ...action.patch } };
    case "CLEAR_FORM":
      return { ...state, form: initial().form };
    case "SAVE_DRAFT": {
      const draft = { ...state.form, date: state.selectedDay.toISOString(), id: Date.now() };
      const drafts = [...state.drafts, draft];
      localStorage.setItem("chronose:ts:drafts", JSON.stringify(drafts));
      return { ...state, drafts };
    }
    case "SAVE_ENTRY": {
      const entry = {
        ...state.form,
        hours: parseFloat(state.form.hours || "0"),
        date: state.selectedDay.toISOString(),
        id: Date.now(),
      };
      return { ...state, entries: [...state.entries, entry] };
    }
    case "SUBMIT_WEEK":
      return { ...state, status: "Submitted" };
    case "SET_TEAM":
      return { ...state, selectedTeam: action.team };
    default:
      return state;
  }
}

// PUBLIC_INTERFACE
export function TimesheetProvider({ children }) {
  /**
   * Provides timesheet local state via React Context.
   * Persists draft entries to localStorage.
   */
  const [state, dispatch] = useReducer(reducer, undefined, initial);

  // Derived
  const weekDays = useMemo(() => {
    const s = startOfWeek(state.anchorDate);
    return Array.from({ length: 7 }).map((_, i) => {
      const dt = new Date(s);
      dt.setDate(s.getDate() + i);
      return {
        key: dayKey(dt),
        date: dt,
        dow: dt.toLocaleString(undefined, { weekday: "short" }),
        isToday: dayKey(dt) === dayKey(new Date()),
      };
    });
  }, [state.anchorDate]);

  const entriesByDay = useMemo(() => {
    const map = {};
    const all = [...state.entries, ...state.drafts];
    all.forEach((e) => {
      const k = dayKey(new Date(e.date));
      map[k] = map[k] || [];
      map[k].push(e);
    });
    return map;
  }, [state.entries, state.drafts]);

  const kpis = useMemo(() => {
    const s = startOfWeek(state.anchorDate);
    const e = endOfWeek(state.anchorDate);
    const inWeek = (arr) =>
      arr.filter((x) => {
        const d = new Date(x.date);
        return d >= s && d <= e;
      });
    const val = inWeek(state.entries);
    const total = val.reduce((sum, v) => sum + (parseFloat(v.hours) || 0), 0);
    const days = new Set(val.map((v) => dayKey(new Date(v.date)))).size;
    const avg = days ? total / days : 0;
    const drafts = inWeek(state.drafts).length;
    const leaves = inWeek(state.entries.filter((x) => x.type === "leave")).length;
    return {
      totalHours: total,
      workingDays: days,
      avgPerDay: avg,
      drafts,
      leaves,
    };
  }, [state.anchorDate, state.entries, state.drafts]);

  const weekRangeLabel = useMemo(() => {
    const s = startOfWeek(state.anchorDate);
    const e = endOfWeek(state.anchorDate);
    return formatRange(s, e);
  }, [state.anchorDate]);

  // Actions
  const setView = (view) => dispatch({ type: "SET_VIEW", view });
  const gotoPrev = () =>
    dispatch({
      type: "SET_ANCHOR",
      date:
        state.view === "week"
          ? new Date(state.anchorDate.getFullYear(), state.anchorDate.getMonth(), state.anchorDate.getDate() - 7)
          : new Date(state.anchorDate.getFullYear(), state.anchorDate.getMonth() - 1, state.anchorDate.getDate()),
    });
  const gotoToday = () => dispatch({ type: "SET_ANCHOR", date: new Date() });
  const gotoNext = () =>
    dispatch({
      type: "SET_ANCHOR",
      date:
        state.view === "week"
          ? new Date(state.anchorDate.getFullYear(), state.anchorDate.getMonth(), state.anchorDate.getDate() + 7)
          : new Date(state.anchorDate.getFullYear(), state.anchorDate.getMonth() + 1, state.anchorDate.getDate()),
    });
  const setSelectedDay = (date) => dispatch({ type: "SET_SELECTED_DAY", date });
  const toggleClock = () => dispatch({ type: "TOGGLE_CLOCK" });
  const updateForm = (patch) => dispatch({ type: "UPDATE_FORM", patch });
  const saveDraft = () => dispatch({ type: "SAVE_DRAFT" });
  const saveEntry = () => {
    dispatch({ type: "SAVE_ENTRY" });
    dispatch({ type: "CLEAR_FORM" });
  };
  const submitWeek = () => dispatch({ type: "SUBMIT_WEEK" });
  const setSelectedTeam = (team) => dispatch({ type: "SET_TEAM", team });

  const canSubmit =
    state.form.project.trim() &&
    state.form.task.trim() &&
    state.form.type.trim() &&
    parseFloat(state.form.hours || "0") > 0;

  const value = {
    view: state.view,
    setView,
    anchorDate: state.anchorDate,
    weekDays,
    weekRangeLabel,
    gotoPrev,
    gotoToday,
    gotoNext,
    selectedDay: state.selectedDay,
    setSelectedDay,
    status: state.status,
    isClockedIn: state.isClockedIn,
    toggleClock,
    selectedTeam: state.selectedTeam,
    setSelectedTeam,
    form: state.form,
    updateForm,
    saveDraft,
    saveEntry,
    submitWeek,
    canSubmit,
    entriesByDay,
    kpis,
  };

  return <TimesheetContext.Provider value={value}>{children}</TimesheetContext.Provider>;
}

// PUBLIC_INTERFACE
export function useTimesheet() {
  /**
   * Hook to consume the Timesheet context.
   */
  const ctx = useContext(TimesheetContext);
  if (!ctx) throw new Error("useTimesheet must be used within TimesheetProvider");
  return ctx;
}
