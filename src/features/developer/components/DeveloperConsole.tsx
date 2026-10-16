import { useState } from 'react';
import { useAuth } from '../../../core/auth/context';
import Panel from '../../../shared/ui/Panel';
import StaffManager from '../../../shared/staff/StaffManager';
import DataEditor from './DataEditor';
import Diagnostics from './Diagnostics';

type Tab = 'staff' | 'data' | 'debug';
const TABS: { id: Tab; label: string }[] = [
  { id: 'staff', label: 'HOD and class rep emails' },
  { id: 'data', label: 'Data editor' },
  { id: 'debug', label: 'Diagnostics' },
];

export default function DeveloperConsole() {
  const { signOutStaff } = useAuth();
  const [tab, setTab] = useState<Tab>('staff');
  return (
    <Panel title="Developer console">
      <div className="sub">
        {TABS.map((t) => (
          <button key={t.id} type="button" className={tab === t.id ? 'on' : ''} onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </div>
      {tab === 'staff' && <StaffManager manageRoles={['hod', 'rep']} />}
      {tab === 'data' && <DataEditor />}
      {tab === 'debug' && <Diagnostics />}
      <br />
      <button type="button" className="alt" onClick={() => void signOutStaff()}>Sign out</button>
    </Panel>
  );
}
