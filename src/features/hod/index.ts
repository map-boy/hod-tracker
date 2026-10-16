import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature';

const feature: FeatureModule = {
  id: 'hod',
  routes: [{ path: '/hod', component: lazy(() => import('./pages/HodPage')) }],
  nav: [{ label: 'HOD', to: '/hod', roles: ['hod'] }],
};
export default feature;
