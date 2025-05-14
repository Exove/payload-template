import * as migration_20250316_204833_init from './20250316_204833_init';
import * as migration_20250316_214934 from './20250316_214934';
import * as migration_20250319_215622 from './20250319_215622';
import * as migration_20250320_133130 from './20250320_133130';
import * as migration_20250320_133354 from './20250320_133354';
import * as migration_20250320_214515 from './20250320_214515';
import * as migration_20250320_222726 from './20250320_222726';
import * as migration_20250320_223540 from './20250320_223540';
import * as migration_20250321_104003 from './20250321_104003';
import * as migration_20250325_211317 from './20250325_211317';
import * as migration_20250325_214428 from './20250325_214428';
import * as migration_20250514_105439 from './20250514_105439';

export const migrations = [
  {
    up: migration_20250316_204833_init.up,
    down: migration_20250316_204833_init.down,
    name: '20250316_204833_init',
  },
  {
    up: migration_20250316_214934.up,
    down: migration_20250316_214934.down,
    name: '20250316_214934',
  },
  {
    up: migration_20250319_215622.up,
    down: migration_20250319_215622.down,
    name: '20250319_215622',
  },
  {
    up: migration_20250320_133130.up,
    down: migration_20250320_133130.down,
    name: '20250320_133130',
  },
  {
    up: migration_20250320_133354.up,
    down: migration_20250320_133354.down,
    name: '20250320_133354',
  },
  {
    up: migration_20250320_214515.up,
    down: migration_20250320_214515.down,
    name: '20250320_214515',
  },
  {
    up: migration_20250320_222726.up,
    down: migration_20250320_222726.down,
    name: '20250320_222726',
  },
  {
    up: migration_20250320_223540.up,
    down: migration_20250320_223540.down,
    name: '20250320_223540',
  },
  {
    up: migration_20250321_104003.up,
    down: migration_20250321_104003.down,
    name: '20250321_104003',
  },
  {
    up: migration_20250325_211317.up,
    down: migration_20250325_211317.down,
    name: '20250325_211317',
  },
  {
    up: migration_20250325_214428.up,
    down: migration_20250325_214428.down,
    name: '20250325_214428',
  },
  {
    up: migration_20250514_105439.up,
    down: migration_20250514_105439.down,
    name: '20250514_105439'
  },
];
