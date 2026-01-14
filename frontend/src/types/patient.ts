export interface Patient {
  id: number;
  fullName: string;
  email: string;
  lastMoodValue: number | null;
  lastSeen: string | null;
}

export interface PatientsResponse {
  content: Patient[];
  totalElements: number;
  totalPages: number;
  number: number;
}

export interface PatientMoodHistory {
  date: string;
  score: number;
  note: string;
}
