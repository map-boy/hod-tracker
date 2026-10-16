import Panel from '../../../shared/ui/Panel';

export default function HodPage() {
  return (
    <Panel title="Issues by root cause">
      <table>
        <thead><tr><th>Group</th><th>Affected</th><th>Age (days)</th><th>Status</th></tr></thead>
        <tbody><tr><td>Year 1 - Basic English - zero marks</td><td>0</td><td>0</td><td><span className="tag red">open</span></td></tr></tbody>
      </table>
    </Panel>
  );
}
