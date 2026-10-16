import type { ReactNode } from 'react';
import { useAuth } from '../../core/auth/context';
import type { Role } from '../../core/domain';
import Panel from './Panel';

export default function RequireStaff({ roles, title, children }: { roles: Role[]; title: string; children: ReactNode }) {
  const { user, role, ready, signInStaff, signOutStaff } = useAuth();
  if (!ready) return <Panel title={title}>Loading...</Panel>;
  if (!user || user.isAnonymous) {
    return (
      <Panel title={title}>
        <p>Staff sign in required.</p>
        <button type="button" onClick={() => void signInStaff()}>Sign in with Google</button>
      </Panel>
    );
  }
  if (!roles.includes(role)) {
    return (
      <Panel title={title}>
        <p>Signed in as {user.email}. This account has no access yet.</p>
        <p>Send this ID to the administrator: <b>{user.uid}</b></p>
        <button type="button" onClick={() => void signOutStaff()}>Sign out</button>
      </Panel>
    );
  }
  return <>{children}</>;
}
