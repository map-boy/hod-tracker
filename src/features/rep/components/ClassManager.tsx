import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../../../core/auth/context';
import type { ClassRoom } from '../../../core/domain';
import { createClass, listClasses } from '../api';

export default function ClassManager() {
  const { user, role } = useAuth();
  const uid = user?.uid ?? '';
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [code, setCode] = useState('');
  const [program, setProgram] = useState('');
  const [year, setYear] = useState(1);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try { setClasses(await listClasses(uid, role === 'hod')); }
    catch { setError('Could not load classes.'); }
  }, [uid, role]);

  useEffect(() => { void load(); }, [load]);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    if (!code.trim() || !program.trim()) { setError('Class code and program are required.'); return; }
    try {
      await createClass({ code: code.trim(), program: program.trim(), year }, uid);
      setCode(''); setProgram(''); setError('');
      await load();
    } catch { setError('Could not create class.'); }
  }

  return (
    <>
      <form onSubmit={(e) => void onCreate(e)}>
        <label>Class code</label>
        <input value={code} placeholder="CSDS-Day-Y2" onChange={(e) => setCode(e.target.value)} />
        <label>Program</label>
        <input value={program} placeholder="Computer Science" onChange={(e) => setProgram(e.target.value)} />
        <label>Year</label>
        <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
          {[1, 2, 3, 4, 5].map((y) => <option key={y} value={y}>Year {y}</option>)}
        </select>
        {error && <p className="err">{error}</p>}
        <br />
        <button type="submit">Create class and QR</button>
      </form>
      <br />
      <table>
        <thead><tr><th>Class</th><th>Year</th><th>Student link</th><th>QR</th></tr></thead>
        <tbody>
          {classes.map((c) => {
            const url = `${window.location.origin}/s/${c.id}`;
            return (
              <tr key={c.id}>
                <td>{c.code}<br />{c.program}</td>
                <td>{c.year}</td>
                <td><a href={url}>{url}</a></td>
                <td><QRCodeSVG value={url} size={96} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
