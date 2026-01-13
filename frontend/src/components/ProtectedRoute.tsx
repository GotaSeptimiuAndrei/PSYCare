import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  isLoggedIn: boolean;
  userRole?: "doctor" | "patient" | null;
  requiredRole?: "doctor" | "patient";
  redirectTo?: string;
  children: ReactNode;
}

export const ProtectedRoute = ({
  isLoggedIn,
  userRole,
  requiredRole,
  redirectTo = "/login",
  children,
}: ProtectedRouteProps) => {
  if (!isLoggedIn) {
    return <Navigate to={redirectTo} replace />;
  }

  // if route has a role requirement, check it
  if (requiredRole && userRole !== requiredRole) {
    // redirect to their own dashboard if role doesn't match
    const dashboard = userRole === "doctor" ? "/doctor-dashboard" : "/patient-dashboard";
    return <Navigate to={dashboard} replace />;
  }

  return <>{children}</>;
};

// PublicRoute stays the same
export const PublicRoute = ({ isLoggedIn, redirectTo = "/", children }: ProtectedRouteProps) => {
  if (isLoggedIn) {
    return <Navigate to={redirectTo} replace />;
  }
  return <>{children}</>;
};
