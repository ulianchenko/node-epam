import { readFile } from 'node:fs';

readFile('data.txt', 'utf-8', (err, data) => {
  console.log('file ready:', data);
});

console.log('next line');
console.log('another line');
