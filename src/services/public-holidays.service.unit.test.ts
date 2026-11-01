import axios from 'axios';
import {
  getListOfPublicHolidays,
  checkIfTodayIsPublicHoliday,
  getNextPublicHolidays,
} from './public-holidays.service';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Public Holidays Service Unit Tests', () => {
  const currentYear = new Date().getFullYear();

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getListOfPublicHolidays', () => {
    it('should return shortened list of public holidays on success', async () => {
      const mockData = [
        {
          date: '2026-01-01',
          localName: 'New Year',
          name: 'New Year\'s Day',
          countryCode: 'GB',
          fixed: true,
          global: true,
          counties: null,
          launchYear: null,
          types: ['Public'],
        },
      ];

      mockedAxios.get.mockResolvedValueOnce({ data: mockData });

      const result = await getListOfPublicHolidays(currentYear, 'GB');

      expect(result).toEqual([
        {
          date: '2026-01-01',
          localName: 'New Year',
          name: 'New Year\'s Day',
        },
      ]);
    });

    it('should return empty array when axios throws an error', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

      const result = await getListOfPublicHolidays(currentYear, 'GB');

      expect(result).toEqual([]);
    });
  });

  describe('checkIfTodayIsPublicHoliday', () => {
    it('should return true if status is 200', async () => {
      mockedAxios.get.mockResolvedValueOnce({ status: 200 });

      const result = await checkIfTodayIsPublicHoliday('GB');

      expect(result).toBe(true);
    });

    it('should return false if status is not 200 or error occurs', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Not found'));

      const result = await checkIfTodayIsPublicHoliday('GB');

      expect(result).toBe(false);
    });
  });

  describe('getNextPublicHolidays', () => {
    it('should return next public holidays on success', async () => {
      const mockData = [
        {
          date: '2026-12-25',
          localName: 'Christmas',
          name: 'Christmas Day',
          countryCode: 'GB',
          fixed: true,
          global: true,
          counties: null,
          launchYear: null,
          types: ['Public'],
        },
      ];

      mockedAxios.get.mockResolvedValueOnce({ data: mockData });

      const result = await getNextPublicHolidays('GB');

      expect(result).toEqual([
        {
          date: '2026-12-25',
          localName: 'Christmas',
          name: 'Christmas Day',
        },
      ]);
    });

    it('should return empty array on error', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

      const result = await getNextPublicHolidays('GB');

      expect(result).toEqual([]);
    });
  });
});
