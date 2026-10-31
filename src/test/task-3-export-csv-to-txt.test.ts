import fs from 'fs';
import path from 'path';
import { Readable, Writable } from 'stream';
import { exportCsvToTxt } from '../task-3-export-csv-to-txt';

const CSV_PATH = path.resolve('./src/assets/books.csv');
const TXT_PATH = path.resolve('./src/assets/books.txt');

describe('[Task 3] exportCsvToTxt', () => {
  let createReadStreamSpy: jest.SpyInstance;
  let createWriteStreamSpy: jest.SpyInstance;
  let mockWriteData: string;

  beforeEach(() => {
    createReadStreamSpy = jest.spyOn(fs, 'createReadStream');
    createWriteStreamSpy = jest.spyOn(fs, 'createWriteStream');

    mockWriteData = '';
    const mockWriteStream = new Writable({
      write(chunk, encoding, callback) {
        mockWriteData += chunk.toString();
        callback();
      },
    });

    createWriteStreamSpy.mockReturnValue(mockWriteStream);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    mockWriteData = '';
  });

  it('should resolve true if successfully converted csv to txt', async () => {
    const mockCSVData = 'Book;Author;Amount;Price\nThe Compound Effect;Darren Hardy;5;9,48';
    const mockReadStream = Readable.from([mockCSVData]);
    createReadStreamSpy.mockReturnValue(mockReadStream);

    await expect(exportCsvToTxt(CSV_PATH, TXT_PATH)).resolves.toBe(true);
    expect(createReadStreamSpy).toHaveBeenCalled();
    expect(createWriteStreamSpy).toHaveBeenCalled();
  });

  it('should write correct data to txt file', async () => {
    const mockCSVData = 'Book;Author;Amount;Price\nThe Compound Effect;Darren Hardy;5;9,48\nThe 7 Habits of Highly Effective People;Stephen R. Covey;10;23,48\nThe Miracle Morning;Hal Elrod;15;21,34\nInfluence: The Psychology of Persuasion;Robert B. Cialdini;20;12,99\nThe ONE Thing;Gary Keller;25;11,18';
    const mockReadStream = Readable.from([mockCSVData]);
    createReadStreamSpy.mockReturnValue(mockReadStream);

    await exportCsvToTxt(CSV_PATH, TXT_PATH);

    const expectedContent = [
      '{"book":"The Compound Effect","author":"Darren Hardy","price":9.48}',
      '{"book":"The 7 Habits of Highly Effective People","author":"Stephen R. Covey","price":23.48}',
      '{"book":"The Miracle Morning","author":"Hal Elrod","price":21.34}',
      '{"book":"Influence: The Psychology of Persuasion","author":"Robert B. Cialdini","price":12.99}',
      '{"book":"The ONE Thing","author":"Gary Keller","price":11.18}',
    ].join('\n');

    expect(mockWriteData.trim()).toBe(expectedContent);
  });

  it('should throw an error when write file fails', async () => {
    const mockCSVData = 'Book;Author;Amount;Price\nThe Compound Effect;Darren Hardy;5;9,48';
    const mockReadStream = Readable.from([mockCSVData]);
    createReadStreamSpy.mockReturnValue(mockReadStream);

    const mockErrorStream = new Writable({
      write(chunk, encoding, callback) {
        callback(new Error());
      },
    });
    createWriteStreamSpy.mockReturnValue(mockErrorStream);

    await expect(exportCsvToTxt(CSV_PATH, TXT_PATH)).rejects.toThrow();
  });
});
