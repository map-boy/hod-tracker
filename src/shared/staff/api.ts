import { collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore';
import { db } from '../../core/firebase';
import type { StaffMember, StaffRole } from '../../core/domain';

export const normalizeEmail = (v: string): string => v.trim().toLowerCase();
export const isEmail = (v: string): boolean => /^[^\s@/]+@[^\s@/]+\.[^\s@/]+$/.test(v);

export async function listStaff(): Promise<StaffMember[]> {
  const snap = await getDocs(collection(db, 'staffEmails'));
  return snap.docs
    .map((d) => ({ ...(d.data() as Omit<StaffMember, 'email'>), email: d.id }))
    .sort((a, b) => a.role.localeCompare(b.role) || a.email.localeCompare(b.email));
}

export async function saveStaff(email: string, role: StaffRole, by: string): Promise<void> {
  await setDoc(doc(db, 'staffEmails', email), { role, addedBy: by, addedAt: Date.now() });
}

export async function removeStaff(email: string): Promise<void> {
  await deleteDoc(doc(db, 'staffEmails', email));
}
