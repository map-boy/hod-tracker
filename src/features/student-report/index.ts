import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature';

const feature: FeatureModule = {
  id: 'student-report',
  routes: [{ path: '/s/:classToken', component: lazy(() => import('./pages/ReportPage')) }],
};
export default feature;
