import Panel from '../../../shared/ui/Panel';
import RequireStaff from '../../../shared/ui/RequireStaff';
import ClassManager from '../components/ClassManager';

export default function RepPage() {
  return (
    <RequireStaff roles={['rep', 'hod']} title="Class representative">
      <Panel title="Class representative">
        <ClassManager />
      </Panel>
    </RequireStaff>
  );
}
