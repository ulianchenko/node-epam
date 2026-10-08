import { readFile } from 'node:fs';

readFile('hello.js', 'utf-8', (err, data) => {
  if (err) {
    console.error('Failed to read file:', err.message);
    return;
  }
  console.log(data);
});

console.log('This runs BEFORE the file is read!');
