import fs from 'fs';
import readline from 'readline';
import { Transform } from 'stream';

/**
 * Exports a CSV file to a TXT file.
 * CSV format:
 *  Book;Author;Amount;Price
 *  The Compound Effect;Darren Hardy;5;9,48
 * TXT format: {"book":"The Compound Effect","author":"Darren Hardy","price":9.48}
 * @param {string} csvPath - The path to the source CSV file.
 * @param {string} txtPath - The path to the destination TXT file.
 * @returns {Promise<boolean>} - A promise that resolves to true when export is done.
 */
/* eslint-disable-next-line arrow-body-style */
export const exportCsvToTxt = (csvPath: string, txtPath: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(csvPath);
    const writeStream = fs.createWriteStream(txtPath);

    readStream.on('error', (err) => reject(err));
    writeStream.on('error', (err) => reject(err));
    writeStream.on('error', (err) => reject(err));

    const rl = readline.createInterface({
      input: readStream,
      crlfDelay: Infinity,
    });

    let headers: string[] = [];

    const transformStream = new Transform({
      objectMode: true,
      transform(line: string, encoding, callback) {
        try {
          if (!line.trim()) {
            callback();
            return;
          }

          const parts = line.split(';');

          if (headers.length === 0) {
            // Сохраняем заголовки в нижнем регистре
            headers = parts.map((h) => h.trim().toLowerCase());
            callback();
            return;
          }

          const rowObj: Record<string, string> = {};
          headers.forEach((header, index) => {
            rowObj[header] = parts[index] ? parts[index].trim() : '';
          });

          const book = rowObj.book || '';
          const author = rowObj.author || '';
          const rawPrice = rowObj.price || '0';
          const price = parseFloat(rawPrice.replace(',', '.'));

          const outputObj = {
            book,
            author,
            price,
          };

          callback(null, `${JSON.stringify(outputObj)}\n`);
        } catch (err) {
          callback(err as Error);
        }
      },
    });

    rl.on('line', (line) => {
      transformStream.write(line);
    });

    rl.on('close', () => {
      transformStream.end();
    });

    transformStream
      .pipe(writeStream)
      .on('finish', () => {
        resolve(true);
      })
      .on('error', (err) => {
        reject(err);
      });
  });
};
