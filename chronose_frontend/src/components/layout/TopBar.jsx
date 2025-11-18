import React from "react";

/**
 * PUBLIC_INTERFACE
 * TopBar renders a slim header for the current page with right-aligned actions.
 * Props:
 * - title: string title for current section
 * - children: actions area (buttons, status, etc.)
 */
export default function TopBar({ title, children }) {
  return (
    <header className="topbar" role="banner">
      <h1 className="topbar__title">{title}</h1>
      <div className="topbar__actions">{children}</div>
    </header>
  );
}
