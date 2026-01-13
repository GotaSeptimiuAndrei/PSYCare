export interface Login {
  email: string;
  password: string;
}

export interface Register extends Login {
  fullName: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
  }
}
