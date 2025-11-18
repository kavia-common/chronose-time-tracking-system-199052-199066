import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";

/**
 * PUBLIC_INTERFACE
 * MainLayout provides the app shell with Sidebar and a content container.
 * It wraps routed pages and ensures consistent spacing and backgrounds.
 */
export default function MainLayout() {
  const location = useLocation();
  const routeName = routeTitle(location.pathname);

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-content" role="main" aria-live="polite">
        <Outlet context={{ routeName }} />
      </main>
    </div>
  );
}

function routeTitle(path) {
  if (path.startsWith("/timesheet")) return "Timesheet";
  if (path.startsWith("/approvals")) return "Approvals";
  if (path.startsWith("/reports")) return "Reports";
  if (path.startsWith("/dashboard")) return "Dashboard";
  return "Chronose";
}
