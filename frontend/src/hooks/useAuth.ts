import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import type { JWTData } from "../types/jwt";
import { isTokenExpired } from "../utils/jwt";

type UserRole = "doctor" | "patient" | null;

const extractRole = (roles: string[]): UserRole => {
  if (roles.includes("ROLE_DOCTOR")) return "doctor";
  if (roles.includes("ROLE_PATIENT")) return "patient";
  return null;
};

const getInitialAuth = () => {
  const token = localStorage.getItem("token");

  if (!token || isTokenExpired(token)) {
    localStorage.removeItem("token");
    return { token: null, role: null as UserRole };
  }

  try {
    const decoded: JWTData = jwtDecode(token);
    return { token, role: extractRole(decoded.roles) };
  } catch {
    localStorage.removeItem("token");
    return { token: null, role: null as UserRole };
  }
};

export const useAuth = () => {
  const [{ token, role }, setAuth] = useState(getInitialAuth);

  const login = (jwt: string) => {
    if (isTokenExpired(jwt)) return;

    localStorage.setItem("token", jwt);
    const decoded: JWTData = jwtDecode(jwt);
    setAuth({ token: jwt, role: extractRole(decoded.roles) });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuth({ token: null, role: null });
  };

  return {
    token,
    role,
    login,
    logout,
    isLoggedIn: !!token,
  };
};

export const getId = () => {
  const token = localStorage.getItem("token");
  if (!token || isTokenExpired(token)) {
    return null;
  }

  try {
    const decoded: JWTData = jwtDecode(token);
    return decoded.userId;
  } catch {
    return null;
  }
}

export const getRole = () => {
  const token = localStorage.getItem("token");
  if (!token || isTokenExpired(token)) {
    return null;
  }

  try {
    const decoded: JWTData = jwtDecode(token);
    return extractRole(decoded.roles);
  } catch {
    return null;
  }
}
