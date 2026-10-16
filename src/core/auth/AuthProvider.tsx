import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { GoogleAuthProvider, onAuthStateChanged, signInAnonymously, signInWithPopup, signOut, type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import type { Role } from '../domain';
import { AuthContext, type AuthState } from './context';

const signInStaff = async (): Promise<void> => { await signInWithPopup(auth, new GoogleAuthProvider()); };
const signOutStaff = async (): Promise<void> => { await signOut(auth); };
const ensureUser = async (): Promise<User> => auth.currentUser ?? (await signInAnonymously(auth)).user;

async function resolveRole(user: User | null): Promise<Role> {
  if (!user || user.isAnonymous) return 'student';
  try {
    const snap = await getDoc(doc(db, 'staff', user.uid));
    const r = snap.data()?.role;
    return r === 'hod' || r === 'rep' ? r : 'student';
  } catch {
    return 'student';
  }
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ user: User | null; role: Role; ready: boolean }>({ user: null, role: 'student', ready: false });

  useEffect(() => {
    let seq = 0;
    return onAuthStateChanged(auth, (user) => {
      const mine = ++seq;
      void resolveRole(user).then((role) => {
        if (mine === seq) setState({ user, role, ready: true });
      });
    });
  }, []);

  const value = useMemo<AuthState>(() => ({ ...state, signInStaff, signOutStaff, ensureUser }), [state]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
