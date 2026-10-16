import { lazy } from 'react';
import type { FeatureModule } from '../../core/feature';

const feature: FeatureModule = {
  id: 'home',
  routes: [{ path: '/', component: lazy(() => import('./pages/HomePage')) }],
  nav: [{ label: 'Home', to: '/' }],
};
export default feature;
