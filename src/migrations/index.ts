import * as migration_20251007_164129 from './20251007_164129';
import * as migration_20251007_192019 from './20251007_192019';

export const migrations = [
  {
    up: migration_20251007_164129.up,
    down: migration_20251007_164129.down,
    name: '20251007_164129',
  },
  {
    up: migration_20251007_192019.up,
    down: migration_20251007_192019.down,
    name: '20251007_192019'
  },
];
