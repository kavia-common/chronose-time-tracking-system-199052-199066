import React from "react";
import { NavLink } from "react-router-dom";

/**
 * PUBLIC_INTERFACE
 * Sidebar renders the left navigation with primary sections.
 * Items: Dashboard, Timesheet, Approvals, Reports
 */
export default function Sidebar() {
  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: "🏠" },
    { to: "/timesheet", label: "Timesheet", icon: "⏱️" },
    { to: "/approvals", label: "Approvals", icon: "✅" },
    { to: "/reports", label: "Reports", icon: "📊" },
  ];

  return (
    <aside className="sidebar" aria-label="Primary Navigation">
      <div className="sidebar__brand">Chronose</div>
      <nav className="sidebar__nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              "sidebar__link" + (isActive ? " sidebar__link--active" : "")
            }
            aria-label={item.label}
          >
            <span className="sidebar__icon" aria-hidden="true">{item.icon}</span>
            <span className="sidebar__text">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
