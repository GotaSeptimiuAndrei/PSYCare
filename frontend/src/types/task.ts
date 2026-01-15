export interface Task {
  id?: number;
  patientId?: number;
  exerciseId?: number;
  exerciseTitle?: string;
  exerciseDescription?: string;
  contentUrl?: string;
  assignedDate: string;
  status?: 'PENDING' | 'COMPLETED';
}
