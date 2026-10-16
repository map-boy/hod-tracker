import { Link } from 'react-router-dom';
import Panel from '../../../shared/ui/Panel';

export default function HomePage() {
  return (
    <Panel title="Marks issues portal">
      <p>Students: scan your class QR code to report a marks issue.</p>
      <table>
        <thead><tr><th>Area</th><th>Who</th><th>Link</th></tr></thead>
        <tbody>
          <tr><td>Class representative</td><td>Rep</td><td><Link to="/rep">/rep</Link></td></tr>
          <tr><td>Head of Department</td><td>HOD</td><td><Link to="/hod">/hod</Link></td></tr>
        </tbody>
      </table>
    </Panel>
  );
}
