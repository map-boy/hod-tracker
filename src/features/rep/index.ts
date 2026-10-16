import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature';

const feature: FeatureModule = {
  id: 'rep',
  routes: [{ path: '/rep', component: lazy(() => import('./pages/RepPage')) }],
  nav: [{ label: 'Class Rep', to: '/rep', roles: ['rep'] }],
};
export default feature;
