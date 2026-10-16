import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { useAuth } from '../../core/auth/context';
import type { StaffMember, StaffRole } from '../../core/domain';
import { isEmail, listStaff, normalizeEmail, removeStaff, saveStaff } from './api';

const LABEL: Record<StaffRole, string> = { hod: 'HOD', rep: 'Class representative' };

export default function StaffManager({ manageRoles }: { manageRoles: StaffRole[] }) {
  const { user } = useAuth();
  const me = user?.email?.toLowerCase() ?? '';
  const [rows, setRows] = useState<StaffMember[]>([]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<StaffRole>(manageRoles[0] ?? 'rep');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try { setRows(await listStaff()); }
    catch { setError('Could not load the list.'); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function onAdd(e: FormEvent) {
    e.preventDefault();
    const v = normalizeEmail(email);
    if (!isEmail(v)) { setError('Enter a valid email address.'); return; }
    try {
      await saveStaff(v, role, me);
      setEmail(''); setError('');
      await load();
    } catch { setError('Could not save. You may not have permission for this role.'); }
  }

  async function onRemove(m: StaffMember) {
    if (!window.confirm(`Remove ${m.email}?`)) return;
    try { await removeStaff(m.email); setError(''); await load(); }
    catch { setError('Could not remove.'); }
  }

  return (
    <>
      <form onSubmit={(e) => void onAdd(e)}>
        <label>Google email allowed to sign in</label>
        <input value={email} inputMode="email" placeholder="name@gmail.com" onChange={(e) => setEmail(e.target.value)} />
        {manageRoles.length > 1 && (
          <>
            <label>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value as StaffRole)}>
              {manageRoles.map((r) => <option key={r} value={r}>{LABEL[r]}</option>)}
            </select>
          </>
        )}
        {error && <p className="err">{error}</p>}
        <br />
        <button type="submit">Add / update</button>
      </form>
      <br />
      <table>
        <thead><tr><th>Email</th><th>Role</th><th>Added by</th><th></th></tr></thead>
        <tbody>
          {rows.map((m) => (
            <tr key={m.email}>
              <td>{m.email}</td>
              <td>{LABEL[m.role]}</td>
              <td>{m.addedBy}</td>
              <td>{manageRoles.includes(m.role) && <button type="button" className="danger" onClick={() => void onRemove(m)}>Remove</button>}</td>
            </tr>
          ))}
          {rows.length === 0 && <tr><td colSpan={4}>No emails yet.</td></tr>}
        </tbody>
      </table>
    </>
  );
}
