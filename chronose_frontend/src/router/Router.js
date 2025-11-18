import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import EmployeeTimesheetPage from "../pages/Timesheet/EmployeeTimesheetPage";
import RequireRole from "../components/auth/RequireRole";
import { ROLES } from "../lib/permissions";

/**
 * PUBLIC_INTERFACE
 * AppRouter defines all application routes and composes them with the shared MainLayout.
 * Routes:
 * - / -> redirects to /timesheet
 * - /dashboard -> placeholder
 * - /timesheet -> Employee timesheet view (all roles)
 * - /approvals -> restricted to Manager/Admin
 * - /reports -> placeholder (accessible to all for now)
 */
export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/timesheet" replace />} />
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Placeholder title="Dashboard" />} />
        <Route
          path="/timesheet"
          element={
            <RequireRole roles={[ROLES.EMPLOYEE, ROLES.MANAGER, ROLES.HR, ROLES.ADMIN]}>
              <EmployeeTimesheetPage />
            </RequireRole>
          }
        />
        <Route
          path="/approvals"
          element={
            <RequireRole roles={[ROLES.MANAGER, ROLES.ADMIN]} redirectTo="/timesheet">
              <Placeholder title="Approvals" />
            </RequireRole>
          }
        />
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
