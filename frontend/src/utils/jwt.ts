import { jwtDecode } from "jwt-decode";
import type { JWTData } from "../types/jwt";

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded: JWTData = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch {
    return true; // If token is invalid, consider it expired
  }
};
