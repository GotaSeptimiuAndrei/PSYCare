export interface JWTData {
  sub: string;
  roles: string[];
  fullName: string;
  userId: number;
  exp: number;
  iat: number;
  iss: string;
}
