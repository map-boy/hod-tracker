import { useState, type FormEvent } from 'react';
import { useAuth } from '../../../core/auth/context';
import { ISSUE_LABELS, type ClassRoom, type IssueType } from '../../../core/domain';
import { submitCase } from '../api';
import { isCourse, isRegNo, normalizePhone } from '../lib/validate';

interface Props { cls: ClassRoom; onDone: (caseId: string) => void }

export default function ReportForm({ cls, onDone }: Props) {
  const { ensureUser } = useAuth();
  const [name, setName] = useState('');
  const [regNo, setRegNo] = useState('');
  const [phone, setPhone] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [issueType, setIssueType] = useState<IssueType>('zero_marks');
  const [description, setDescription] = useState('');
  const [blocks, setBlocks] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const normPhone = normalizePhone(phone);
    if (name.trim().length < 3) { setError('Enter your full name.'); return; }
    if (!isRegNo(regNo)) { setError('Registration number must be 6 to 12 digits.'); return; }
    if (!normPhone) { setError('Enter a valid Rwandan phone number, e.g. 0788123456.'); return; }
    if (!isCourse(courseCode)) { setError('Course code looks like CS 101.'); return; }
    if (description.trim().length < 10) { setError('Describe the problem (at least 10 characters).'); return; }
    setBusy(true);
    setError('');
    try {
      const user = await ensureUser();
      const id = await submitCase(
        { classId: cls.id, regNo: regNo.trim(), name: name.trim(), phone: normPhone, courseCode, issueType, description: description.trim(), blocksRegistration: blocks },
        user.uid,
      );
      onDone(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed. Try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={(e) => void onSubmit(e)}>
      <p><b>{cls.code}</b> - {cls.program} - Year {cls.year}</p>
      <label>Full name</label>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <label>Registration number</label>
      <input value={regNo} inputMode="numeric" onChange={(e) => setRegNo(e.target.value)} />
      <label>Phone (WhatsApp)</label>
      <input value={phone} inputMode="tel" placeholder="0788123456" onChange={(e) => setPhone(e.target.value)} />
      <label>Course code</label>
      <input value={courseCode} placeholder="CS 101" onChange={(e) => setCourseCode(e.target.value)} />
      <label>Issue type</label>
      <select value={issueType} onChange={(e) => setIssueType(e.target.value as IssueType)}>
        {(Object.keys(ISSUE_LABELS) as IssueType[]).map((k) => (
          <option key={k} value={k}>{ISSUE_LABELS[k]}</option>
        ))}
      </select>
      <label>Describe the problem (markdown allowed)</label>
      <textarea rows={6} value={description} onChange={(e) => setDescription(e.target.value)} />
      <label><input type="checkbox" checked={blocks} onChange={(e) => setBlocks(e.target.checked)} /> This stops me from registering</label>
      {error && <p className="err">{error}</p>}
      <br />
      <button type="submit" disabled={busy}>{busy ? 'Submitting...' : 'Submit'}</button>
    </form>
  );
}
