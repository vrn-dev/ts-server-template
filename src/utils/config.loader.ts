import { Config } from '../types/config.types';
import { join } from 'path';
import { readFileSync } from 'fs-extra';

export let CONFIG: Config = null;

const home = process.env.HOME;
const dir = 'rtech';
const dir2 = '';
const filename = 'config.json';

export function init(): Config {
  const cfgPath = join(home, dir, filename);
  let file = '';
  try {
    file = readFileSync(cfgPath, 'utf-8');
  } catch (e) {
    throw e;
  }
  let c;
  if (file) {
    try {
      c = JSON.parse(file);
    } catch (e) {
      throw e;
    }
  }
  CONFIG = c;
  return c;
}
