import { useState } from "react";
import { jwtDecode } from "jwt-decode";

interface JWTData {
  sub: string;
  roles: string[];
  fullName: string;
  userId: number;
  exp: number;
  iat: number;
  iss: string;
}

type UserRole = "doctor" | "patient" | null;

const getInitialAuth = () => {
  const storedToken = localStorage.getItem("token");
  if (!storedToken) return { token: null, role: null as UserRole };

  try {
    const decoded: JWTData = jwtDecode(storedToken);
    const role: UserRole = decoded.roles.includes("ROLE_DOCTOR")
      ? "doctor"
      : decoded.roles.includes("ROLE_PATIENT")
      ? "patient"
      : null;
    return { token: storedToken, role };
  } catch {
    return { token: null, role: null as UserRole };
  }
};

export const useAuth = () => {
  const [{ token, role }, setAuth] = useState(getInitialAuth);
  const [loading] = useState(false);

  const login = (jwt: string) => {
    localStorage.setItem("token", jwt);
    try {
      const decoded: JWTData = jwtDecode(jwt);
      const role: UserRole = decoded.roles.includes("ROLE_DOCTOR")
        ? "doctor"
        : decoded.roles.includes("ROLE_PATIENT")
        ? "patient"
        : null;
      setAuth({ token: jwt, role });
    } catch {
      setAuth({ token: null, role: null });
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuth({ token: null, role: null });
  };

  return { token, role, login, logout, loading, isLoggedIn: !!token };
};
