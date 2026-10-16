import { useParams } from 'react-router-dom';
import Panel from '../../../shared/ui/Panel';

export default function ReportPage() {
  const { classToken } = useParams<{ classToken: string }>();
  return (
    <Panel title="Submit a marks issue">
      <p>Class token: {classToken}</p>
      <label>Registration number</label><input />
      <label>Phone (WhatsApp)</label><input />
      <label>Course code</label><input />
      <label>Issue</label><textarea rows={5} />
      <br /><br />
      <button type="button">Submit</button>
    </Panel>
  );
}
