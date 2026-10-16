import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Panel from '../../../shared/ui/Panel';
import type { ClassRoom } from '../../../core/domain';
import { getClassByToken } from '../api';
import ReportForm from '../components/ReportForm';

type Load = { status: 'loading' } | { status: 'missing' } | { status: 'ready'; cls: ClassRoom };

export default function ReportPage() {
  const { classToken } = useParams<{ classToken: string }>();
  const [load, setLoad] = useState<Load>({ status: 'loading' });
  const [doneId, setDoneId] = useState<string | null>(null);

  useEffect(() => {
    if (!classToken) return;
    let off = false;
    getClassByToken(classToken)
      .then((cls) => { if (!off) setLoad(cls ? { status: 'ready', cls } : { status: 'missing' }); })
      .catch(() => { if (!off) setLoad({ status: 'missing' }); });
    return () => { off = true; };
  }, [classToken]);

  if (doneId) {
    return (
      <Panel title="Issue submitted">
        <p>Your issue is recorded. You will be called when your class is scheduled.</p>
        <p>Reference: <b>{doneId}</b></p>
      </Panel>
    );
  }
  if (load.status === 'loading') return <Panel title="Submit a marks issue">Loading...</Panel>;
  if (load.status === 'missing') return <Panel title="Submit a marks issue">This class link is not valid. Scan the QR code again.</Panel>;
  return (
    <Panel title="Submit a marks issue">
      <ReportForm cls={load.cls} onDone={setDoneId} />
    </Panel>
  );
}
