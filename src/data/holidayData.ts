// src/data/holidayData.ts

import { HolidayType } from '../config/constants';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Holiday Interface
 */
export interface Holiday {
  id: string;
  shamsiYear: number;
  shamsiMonth: number;
  shamsiDay: number;
  names: {
    dari: string;
    pashto: string;
    english: string;
  };
  descriptions: {
    dari: string;
    pashto: string;
    english: string;
  };
  type: HolidayType;
  isNationalHoliday: boolean;
  isPublicHoliday: boolean;
}

/**
 * In-memory holiday storage
 */
class HolidayStore {
  private holidays: Map<number, Holiday[]> = new Map();

  constructor() {
    this.loadHolidays();
  }

  /**
   * Load holidays from JSON file
   */
  private loadHolidays(): void {
    try {
      const holidaysPath = path.join(__dirname, '../../data/holidays.json');
      const data = fs.readFileSync(holidaysPath, 'utf8');
      const holidaysByYear: { [year: string]: Holiday[] } = JSON.parse(data);

      // Load into Map
      Object.entries(holidaysByYear).forEach(([year, holidays]) => {
        this.holidays.set(parseInt(year), holidays);
      });

      console.log(`✅ Loaded holidays for ${this.holidays.size} years`);
    } catch (error) {
      console.warn('⚠️  Could not load holidays file, starting with empty data');
      this.holidays = new Map();
    }
  }

  /**
   * Get all holidays for a year
   */
  getByYear(year: number): Holiday[] {
    return this.holidays.get(year) || [];
  }

  /**
   * Get holidays for a specific month
   */
  getByYearAndMonth(year: number, month: number): Holiday[] {
    const yearHolidays = this.getByYear(year);
    return yearHolidays.filter(h => h.shamsiMonth === month);
  }

  /**
   * Get holidays for a specific date
   */
  getByDate(year: number, month: number, day: number): Holiday[] {
    const yearHolidays = this.getByYear(year);
    return yearHolidays.filter(
      h => h.shamsiMonth === month && h.shamsiDay === day
    );
  }

  /**
   * Get holiday by ID
   */
  getById(id: string): Holiday | undefined {
    for (const yearHolidays of this.holidays.values()) {
      const holiday = yearHolidays.find(h => h.id === id);
      if (holiday) return holiday;
    }
    return undefined;
  }

  /**
   * Get all holidays
   */
  getAll(): Holiday[] {
    const allHolidays: Holiday[] = [];
    this.holidays.forEach(yearHolidays => {
      allHolidays.push(...yearHolidays);
    });
    return allHolidays.sort((a, b) => {
      if (a.shamsiYear !== b.shamsiYear) return a.shamsiYear - b.shamsiYear;
      if (a.shamsiMonth !== b.shamsiMonth) return a.shamsiMonth - b.shamsiMonth;
      return a.shamsiDay - b.shamsiDay;
    });
  }

  /**
   * Get national holidays
   */
  getNationalHolidays(year?: number): Holiday[] {
    if (year) {
      return this.getByYear(year).filter(h => h.isNationalHoliday);
    }
    return this.getAll().filter(h => h.isNationalHoliday);
  }

  /**
   * Get public holidays
   */
  getPublicHolidays(year?: number): Holiday[] {
    if (year) {
      return this.getByYear(year).filter(h => h.isPublicHoliday);
    }
    return this.getAll().filter(h => h.isPublicHoliday);
  }

  /**
   * Get holidays by type
   */
  getByType(type: HolidayType, year?: number): Holiday[] {
    if (year) {
      return this.getByYear(year).filter(h => h.type === type);
    }
    return this.getAll().filter(h => h.type === type);
  }

  /**
   * Search holidays by name
   */
  search(searchTerm: string, language: 'dari' | 'pashto' | 'english' = 'english'): Holiday[] {
    const allHolidays = this.getAll();
    const lowerSearch = searchTerm.toLowerCase();

    return allHolidays.filter(h => {
      const name = h.names[language].toLowerCase();
      const description = h.descriptions[language].toLowerCase();
      return name.includes(lowerSearch) || description.includes(lowerSearch);
    });
  }

  /**
   * Get statistics
   */
  getStatistics(year?: number): {
    total: number;
    byType: { [key: string]: number };
    national: number;
    public: number;
  } {
    const holidays = year ? this.getByYear(year) : this.getAll();

    const statistics = {
      total: holidays.length,
      byType: {} as { [key: string]: number },
      national: 0,
      public: 0,
    };

    holidays.forEach(holiday => {
      // Count by type
      if (!statistics.byType[holiday.type]) {
        statistics.byType[holiday.type] = 0;
      }
      statistics.byType[holiday.type]++;

      // Count national
      if (holiday.isNationalHoliday) {
        statistics.national++;
      }

      // Count public
      if (holiday.isPublicHoliday) {
        statistics.public++;
      }
    });

    return statistics;
  }

  /**
   * Check if a date is a holiday
   */
  isHoliday(year: number, month: number, day: number): boolean {
    return this.getByDate(year, month, day).length > 0;
  }

  /**
   * Get upcoming holidays
   */
  getUpcoming(fromYear: number, fromMonth: number, fromDay: number, limit: number = 10): Holiday[] {
    const allHolidays = this.getAll();

    const upcoming = allHolidays.filter(h => {
      if (h.shamsiYear > fromYear) return true;
      if (h.shamsiYear === fromYear && h.shamsiMonth > fromMonth) return true;
      if (h.shamsiYear === fromYear && h.shamsiMonth === fromMonth && h.shamsiDay >= fromDay) return true;
      return false;
    });

    return upcoming.slice(0, limit);
  }

  /**
   * Count holidays
   */
  count(year?: number): number {
    if (year) {
      return this.getByYear(year).length;
    }
    return this.getAll().length;
  }
}

// Export singleton instance
export const holidayStore = new HolidayStore();

export default holidayStore;