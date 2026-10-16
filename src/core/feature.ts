import type { ComponentType } from 'react';
import type { Role } from './domain';

export interface FeatureRoute { path: string; component: ComponentType }
export interface NavItem { label: string; to: string; roles?: Role[] }
export interface FeatureModule { id: string; routes: FeatureRoute[]; nav?: NavItem[] }
