interface FileConfig {
  dataFile: string;
}

import { readFile, writeFile } from 'node:fs/promises';

readFile('config.json', 'utf-8')
  .then(config => readFile((JSON.parse(config) as FileConfig).dataFile, 'utf-8'))
  .then(data => writeFile('output.txt', data))
  .then(() => console.log('Done!'))
  .catch(err => console.error(err));
