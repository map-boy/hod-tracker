import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { db } from '../../core/firebase';
import type { ClassRoom } from '../../core/domain';

export interface NewClass { code: string; program: string; year: number }

export async function listClasses(uid: string, all: boolean): Promise<ClassRoom[]> {
  const ref = collection(db, 'classes');
  const snap = await getDocs(all ? ref : query(ref, where('createdBy', '==', uid)));
  return snap.docs
    .map((d) => ({ ...(d.data() as Omit<ClassRoom, 'id'>), id: d.id }))
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function createClass(input: NewClass, uid: string): Promise<string> {
  const token = crypto.randomUUID().replace(/-/g, '').slice(0, 16);
  await setDoc(doc(db, 'classes', token), { ...input, createdBy: uid, createdAt: Date.now() });
  return token;
}
