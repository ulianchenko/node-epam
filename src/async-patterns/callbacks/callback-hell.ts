interface FileConfig {
  dataFile: string;
}

import { readFile, writeFile } from 'node:fs';

readFile('config.json', 'utf-8', (err, config) => {
  if (err) return console.error(err);
  readFile((JSON.parse(config) as FileConfig).dataFile, 'utf-8', (err, data) => {
    if (err) return console.error(err);
    writeFile('output.txt', data, (err) => {
      if (err) return console.error(err);
      console.log('Done!');
    });
  });
});
