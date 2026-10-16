import Panel from '../../../shared/ui/Panel';
import RequireStaff from '../../../shared/ui/RequireStaff';
import StaffManager from '../../../shared/staff/StaffManager';

export default function HodPage() {
  return (
    <RequireStaff roles={['hod']} title="Head of Department">
      <Panel title="Issues by root cause">
        <table>
          <thead><tr><th>Group</th><th>Affected</th><th>Age (days)</th><th>Status</th></tr></thead>
          <tbody><tr><td>Year 1 - Basic English - zero marks</td><td>0</td><td>0</td><td><span className="tag red">open</span></td></tr></tbody>
        </table>
      </Panel>
      <Panel title="Class representatives allowed to sign in">
        <StaffManager manageRoles={['rep']} />
      </Panel>
    </RequireStaff>
  );
}
