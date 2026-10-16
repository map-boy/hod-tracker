import { useCallback, useEffect, useState } from 'react';
import { collection, deleteDoc, doc, getDocs, limit, query, setDoc } from 'firebase/firestore';
import { db } from '../../../core/firebase';

const SUGGEST = ['staffEmails', 'classes', 'groups', 'cases', 'appointments', 'auditLog'];
interface Row { id: string; data: Record<string, unknown> }

export default function DataEditor() {
  const [path, setPath] = useState('classes');
  const [rows, setRows] = useState<Row[]>([]);
  const [id, setId] = useState('');
  const [text, setText] = useState('{}');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setError('');
    try {
      const snap = await getDocs(query(collection(db, path.trim()), limit(100)));
      setRows(snap.docs.map((d) => ({ id: d.id, data: d.data() })));
    } catch (e) {
      setRows([]);
      setError(e instanceof Error ? e.message : 'Load failed');
    }
  }, [path]);

  useEffect(() => { void load(); }, [load]);

  function pick(r: Row) {
    setId(r.id);
    setText(JSON.stringify(r.data, null, 2));
    setMsg(''); setError('');
  }

  async function save() {
    setMsg(''); setError('');
    try {
      const parsed: unknown = JSON.parse(text);
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) { setError('JSON must be an object.'); return; }
      if (!id.trim()) { setError('Document ID is required.'); return; }
      await setDoc(doc(db, path.trim(), id.trim()), parsed as Record<string, unknown>);
      setMsg('Saved.');
      await load();
    } catch (e) { setError(e instanceof Error ? e.message : 'Save failed'); }
  }

  async function remove() {
    if (!id.trim() || !window.confirm(`Delete ${path}/${id}?`)) return;
    setMsg(''); setError('');
    try {
      await deleteDoc(doc(db, path.trim(), id.trim()));
      setId(''); setText('{}'); setMsg('Deleted.');
      await load();
    } catch (e) { setError(e instanceof Error ? e.message : 'Delete failed'); }
  }

  return (
    <>
      <label>Collection path</label>
      <input list="dev-collections" value={path} onChange={(e) => setPath(e.target.value)} />
      <datalist id="dev-collections">{SUGGEST.map((s) => <option key={s} value={s} />)}</datalist>
      <br /><br />
      <button type="button" onClick={() => void load()}>Reload</button>{' '}
      <button type="button" className="alt" onClick={() => { setId(''); setText('{}'); setMsg(''); setError(''); }}>New document</button>
      <br /><br />
      <table>
        <thead><tr><th>ID</th><th>Data</th></tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="click" onClick={() => pick(r)}>
              <td>{r.id}</td>
              <td className="mono">{JSON.stringify(r.data).slice(0, 90)}</td>
            </tr>
          ))}
          {rows.length === 0 && <tr><td colSpan={2}>No documents (max 100 shown).</td></tr>}
        </tbody>
      </table>
      <label>Document ID</label>
      <input value={id} onChange={(e) => setId(e.target.value)} />
      <label>JSON</label>
      <textarea className="mono" rows={12} value={text} onChange={(e) => setText(e.target.value)} />
      {error && <p className="err">{error}</p>}
      {msg && <p className="ok">{msg}</p>}
      <br />
      <button type="button" onClick={() => void save()}>Save</button>{' '}
      <button type="button" className="danger" onClick={() => void remove()}>Delete</button>
    </>
  );
}
