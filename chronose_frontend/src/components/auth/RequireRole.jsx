import React from "react";
import { Navigate } from "react-router-dom";
import { ROLES, hasAnyRole } from "../../lib/permissions";

/**
 * PUBLIC_INTERFACE
 * RequireRole protects a subtree of UI based on the current user's role.
 * It can be used at route level or to conditionally render parts of a page.
 *
 * Props:
 * - role: a single role string to require (optional if roles is provided)
 * - roles: an array of allowed roles (optional if role is provided)
 * - userRole: the current user's role string; if not provided, defaults to "employee"
 * - redirectTo: route to redirect unauthorized users (default: "/")
 * - children: JSX content to render when authorized
 */
export default function RequireRole({
  role,
  roles,
  userRole = ROLES.EMPLOYEE,
  redirectTo = "/",
  children,
}) {
  const allowed = roles && roles.length ? roles : role ? [role] : [];
  const isAllowed = allowed.length ? hasAnyRole(userRole, allowed) : true; // if nothing specified, allow

  if (!isAllowed) {
    return <Navigate to={redirectTo} replace />;
  }
  return <>{children}</>;
}
