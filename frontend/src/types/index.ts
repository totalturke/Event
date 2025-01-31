export interface Conference {
  id: number;
  title: string;
  datetime: string;
  capacity: number;
  currentAttendance: number;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'attendee' | 'admin';
}

export interface Attendance {
  id: number;
  userId: number;
  conferenceId: number;
  qrCode: string;
  attended: boolean;
}

export interface Survey {
  id: number;
  attendanceId: number;
  rating: number;
  feedback: string;
  submittedAt: string;
}

export interface ConferenceStats {
  id: number;
  title: string;
  capacity: number;
  currentAttendance: number;
  averageRating: number;
}
