import { readFile, writeFile } from 'node:fs/promises';

interface FileConfig {
  dataFile: string;
}

async function processFile(): Promise<void> {
  try {
    const config = await readFile('config.json', 'utf-8');
    const data = await readFile((JSON.parse(config) as FileConfig).dataFile, 'utf-8');
    await writeFile('output.txt', data);
    console.log('Done!');
  } catch (err) {
    console.error(err);
  }
}

processFile();
