/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { WithTime, Callback, AsyncFunction } from '../task-2-with-time';

jest.mock('axios');

const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts/1';

const readFile = (url: string, cb: (error: Error | null, data?: any) => void) => {
  axios.get(url)
    .then((response) => {
      cb(null, response.data);
    })
    .catch((error) => {
      cb(error);
    });
};

describe('[Task 2] WithTime', () => {
  let withTime: WithTime;
  const mockData = { data: 'test' };

  beforeEach(() => {
    withTime = new WithTime();
    (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValueOnce({ data: mockData });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should emit the "begin" event before execution', async () => {
    const mockBeginFn = jest.fn();

    withTime.on('begin', mockBeginFn);
    await withTime.execute(readFile, POSTS_URL);

    expect(mockBeginFn).toHaveBeenCalledTimes(1);
  });

  it('should emit the "end" event after execution', async () => {
    const mockEndFn = jest.fn();

    withTime.on('end', mockEndFn);
    await withTime.execute(readFile, POSTS_URL);

    expect(mockEndFn).toHaveBeenCalledTimes(1);
  });

  it('should emit the "data" event with the correct data', async () => {
    const mockDataFn = jest.fn();

    withTime.on('data', mockDataFn);
    await withTime.execute(readFile, POSTS_URL);

    expect(mockDataFn).toHaveBeenCalledTimes(1);
    expect(mockDataFn).toHaveBeenCalledWith(mockData);
  });

  it('should execute the async function correctly', async () => {
    const mockFn = jest.fn();

    const testReadFile = (url: string, cb: (error: Error | null, data?: any) => void) => {
      mockFn(url);
      readFile(url, cb);
    };

    await withTime.execute(testReadFile, POSTS_URL);
    expect(mockFn).toHaveBeenCalledWith(POSTS_URL);
  });

  it('should emit the "error" event when the async function fails', async () => {
    const mockError = new Error('Test error');

    const errorFunc: AsyncFunction = (url: string, cb: Callback) => {
      cb(mockError);
    };

    const mockErrorFn = jest.fn();
    withTime.on('error', mockErrorFn);

    await withTime.execute(errorFunc, POSTS_URL);

    expect(mockErrorFn).toHaveBeenCalledTimes(1);
    expect(mockErrorFn).toHaveBeenCalledWith(mockError);
  });

  it('should start and end timer through console.time(), console.timeEnd()', async () => {
    const consoleTimeSpy = jest.spyOn(console, 'time').mockImplementation();
    const consoleTimeEndSpy = jest.spyOn(console, 'timeEnd').mockImplementation();

    await withTime.execute(readFile, POSTS_URL);

    expect(consoleTimeSpy).toHaveBeenCalled();
    expect(consoleTimeEndSpy).toHaveBeenCalled();

    consoleTimeSpy.mockRestore();
    consoleTimeEndSpy.mockRestore();
  });
});
