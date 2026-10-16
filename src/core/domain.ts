export type Status = 'submitted' | 'verified' | 'forwarded' | 'resolved' | 'confirmed' | 'reopened';
export type IssueType = 'zero_marks' | 'missing_marks' | 'wrong_marks' | 'registration_blocked' | 'other';
export type Role = 'student' | 'rep' | 'hod' | 'developer';
export type StaffRole = 'hod' | 'rep';

export const ISSUE_LABELS: Record<IssueType, string> = {
  zero_marks: 'Zero marks',
  missing_marks: 'Missing marks',
  wrong_marks: 'Wrong marks',
  registration_blocked: 'Cannot register',
  other: 'Other',
};

export interface StaffMember { email: string; role: StaffRole; addedBy: string; addedAt: number }
export interface ClassRoom { id: string; code: string; program: string; year: number; createdBy: string; createdAt: number }
export interface Group {
  id: string; classId: string; courseCode: string; issueType: IssueType; title: string;
  status: Status; affected: number; blocksRegistration: boolean; createdAt: number; updatedAt: number;
}
export interface Case {
  id: string; groupId: string; classId: string; uid: string;
  regNo: string; name: string; phone: string;
  courseCode: string; issueType: IssueType;
  description: string;
  proofUrls: string[]; blocksRegistration: boolean;
  status: Status; createdAt: number; updatedAt: number;
}
export interface ThreadEntry { id: string; by: string; role: Role; body: string; createdAt: number }
export interface Appointment { id: string; caseId: string; groupId: string; start: number; end: number; status: 'booked' | 'done' | 'missed' }
export interface AuditEntry { id: string; caseId: string; by: string; from: Status; to: Status; note: string; at: number }
