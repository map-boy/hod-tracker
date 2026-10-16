import { useState } from 'react';
import { collection, getCountFromServer } from 'firebase/firestore';
import { db } from '../../../core/firebase';
import { useAuth } from '../../../core/auth/context';

const CHECKS = ['staffEmails', 'classes', 'groups', 'cases', 'appointments', 'auditLog'];
interface Result { name: string; ok: boolean; info: string; ms: number }

export default function Diagnostics() {
  const { user, role } = useAuth();
  const [results, setResults] = useState<Result[]>([]);
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    const out: Result[] = [];
    for (const name of CHECKS) {
      const t = performance.now();
      try {
        const s = await getCountFromServer(collection(db, name));
        out.push({ name, ok: true, info: `${s.data().count} docs`, ms: Math.round(performance.now() - t) });
      } catch (e) {
        out.push({ name, ok: false, info: e instanceof Error ? e.message : 'error', ms: Math.round(performance.now() - t) });
      }
    }
    setResults(out);
    setBusy(false);
  }

  const env: [string, string][] = [
    ['Signed in as', user?.email ?? '-'],
    ['UID', user?.uid ?? '-'],
    ['Role', role],
    ['Firebase project', String(import.meta.env.VITE_FB_PROJECT_ID ?? '-')],
    ['Mode', import.meta.env.MODE],
    ['Origin', window.location.origin],
    ['Online', navigator.onLine ? 'yes' : 'no'],
    ['Browser', navigator.userAgent],
  ];

  return (
    <>
      <table>
        <tbody>{env.map(([k, v]) => <tr key={k}><th>{k}</th><td>{v}</td></tr>)}</tbody>
      </table>
      <br />
      <button type="button" disabled={busy} onClick={() => void run()}>{busy ? 'Running...' : 'Run Firestore checks'}</button>
      <br /><br />
      {results.length > 0 && (
        <table>
          <thead><tr><th>Collection</th><th>Result</th><th>ms</th></tr></thead>
          <tbody>
            {results.map((r) => (
              <tr key={r.name}>
                <td>{r.name}</td>
                <td className={r.ok ? 'ok' : 'err'}>{r.info}</td>
                <td>{r.ms}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
