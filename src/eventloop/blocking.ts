import { readFileSync, readFile } from 'node:fs';

// BLOCKING — the program freezes until the file is read
const data = readFileSync('big-file.txt', 'utf-8');
console.log('done'); // runs only after the file is fully read

// NON-BLOCKING — the program continues immediately
readFile('big-file.txt', 'utf-8', (err, data) => {
  console.log('file ready'); // runs later, when read completes
});
console.log('done'); // runs right away, before the file is ready
