import { createContext, useContext } from 'react';
import type { User } from 'firebase/auth';
import type { Role } from '../domain';

export interface AuthState {
  user: User | null;
  role: Role;
  ready: boolean;
  signInStaff: () => Promise<void>;
  signOutStaff: () => Promise<void>;
  ensureUser: () => Promise<User>;
}

export const AuthContext = createContext<AuthState | null>(null);

export function useAuth(): AuthState {
  const v = useContext(AuthContext);
  if (!v) throw new Error('AuthProvider is missing');
  return v;
}
