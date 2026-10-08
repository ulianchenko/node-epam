import { readFile } from 'node:fs/promises';

async function readAll(): Promise<void> {
  const [file1, file2, file3] = await Promise.all([
    readFile('a.txt', 'utf-8'),
    readFile('b.txt', 'utf-8'),
    readFile('c.txt', 'utf-8'),
  ]);

  console.log(file1, file2, file3);
}

readAll();
