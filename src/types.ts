export type Status = 'submitted' | 'verified' | 'forwarded' | 'resolved' | 'confirmed' | 'reopened';
export type IssueType = 'zero_marks' | 'missing_marks' | 'wrong_marks' | 'registration_blocked' | 'other';

export interface ClassRoom { id: string; code: string; program: string; year: number; qrToken: string; }
export interface Group { id: string; classId: string; courseCode: string; issueType: IssueType; title: string; status: Status; createdAt: number; updatedAt: number; }
export interface Case {
  id: string; groupId: string; classId: string;
  regNo: string; name: string; phone: string;
  courseCode: string; issueType: IssueType;
  description: string; // markdown
  proofUrls: string[]; blocksRegistration: boolean;
  status: Status; createdAt: number; updatedAt: number;
}
export interface ThreadEntry { id: string; by: string; role: 'student' | 'rep' | 'hod'; body: string; createdAt: number; }
export interface Appointment { id: string; caseId: string; groupId: string; start: number; end: number; status: 'booked' | 'done' | 'missed'; }
export interface AuditEntry { id: string; caseId: string; by: string; from: Status; to: Status; note: string; at: number; }
