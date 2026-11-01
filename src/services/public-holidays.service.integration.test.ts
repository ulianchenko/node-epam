import {
  getListOfPublicHolidays,
  checkIfTodayIsPublicHoliday,
  getNextPublicHolidays,
} from './public-holidays.service';

describe('Public Holidays Service Integration Tests', () => {
  const currentYear = new Date().getFullYear();

  it('should fetch real list of public holidays for GB', async () => {
    const holidays = await getListOfPublicHolidays(currentYear, 'GB');
    expect(Array.isArray(holidays)).toBe(true);
    if (holidays.length > 0) {
      expect(holidays[0]).toHaveProperty('date');
      expect(holidays[0]).toHaveProperty('name');
      expect(holidays[0]).toHaveProperty('localName');
    }
  });

  it('should check if today is public holiday for DE', async () => {
    const isHoliday = await checkIfTodayIsPublicHoliday('DE');
    expect(typeof isHoliday).toBe('boolean');
  });

  it('should fetch next public holidays for FR', async () => {
    const nextHolidays = await getNextPublicHolidays('FR');
    expect(Array.isArray(nextHolidays)).toBe(true);
  });
});
