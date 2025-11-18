import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import EmployeeTimesheetPage from "../pages/Timesheet/EmployeeTimesheetPage";

/**
 * PUBLIC_INTERFACE
 * AppRouter defines all application routes and composes them with the shared MainLayout.
 * Routes:
 * - / -> redirects to /timesheet
 * - /dashboard -> placeholder
 * - /timesheet -> Employee timesheet view
 * - /approvals -> placeholder
 * - /reports -> placeholder
 */
export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/timesheet" replace />} />
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Placeholder title="Dashboard" />} />
        <Route path="/timesheet" element={<EmployeeTimesheetPage />} />
        <Route path="/approvals" element={<Placeholder title="Approvals" />} />
        <Route path="/reports" element={<Placeholder title="Reports" />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function Placeholder({ title }) {
  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ margin: 0, color: "var(--text-strong)" }}>{title}</h2>
      <p style={{ color: "var(--text-muted)" }}>This section will be implemented later.</p>
    </div>
  );
}

function NotFound() {
  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ margin: 0, color: "var(--error)" }}>404</h2>
      <p style={{ color: "var(--text-muted)" }}>The page you requested was not found.</p>
    </div>
  );
}
