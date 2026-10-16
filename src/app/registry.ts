import type { FeatureModule } from '../core/feature';

const mods = import.meta.glob<{ default: FeatureModule }>('../features/*/index.ts', { eager: true });

export const features: FeatureModule[] = Object.values(mods).map((m) => m.default);
