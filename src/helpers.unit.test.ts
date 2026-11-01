import { validateInput, shortenPublicHoliday } from './helpers';
import { PublicHoliday } from './types';

describe('Helpers Unit Tests', () => {
  const currentYear = new Date().getFullYear();

  describe('validateInput', () => {
    it('should return true for valid country and current year', () => {
      expect(validateInput({ year: currentYear, country: 'GB' })).toBe(true);
    });

    it('should throw an error for an unsupported country', () => {
      expect(() => validateInput({ country: 'US' })).toThrow(
        'Country provided is not supported, received: US',
      );
    });

    it('should throw an error for an invalid year', () => {
      expect(() => validateInput({ year: 2000 })).toThrow(
        'Year provided not the current, received: 2000',
      );
    });
  });

  describe('shortenPublicHoliday', () => {
    it('should correctly shorten public holiday object', () => {
      const fullHoliday: PublicHoliday = {
        date: '2026-01-01',
        localName: 'New Year',
        name: 'New Year\'s Day',
        countryCode: 'GB',
        fixed: true,
        global: true,
        counties: null,
        launchYear: null,
        types: ['Public'],
      };

      const result = shortenPublicHoliday(fullHoliday);

      expect(result).toEqual({
        date: '2026-01-01',
        localName: 'New Year',
        name: 'New Year\'s Day',
      });
    });
  });
});
