import { Holiday } from '../types';

// Simplified static list for demo purposes. 
// In a production app, this might come from an API or a more complex lunar calculation library.
const hkHolidays: Record<string, string> = {
  // 2024
  '2024-01-01': 'New Year\'s Day',
  '2024-02-10': 'Lunar New Year (Day 1)',
  '2024-02-12': 'Lunar New Year (Day 3)',
  '2024-02-13': 'Lunar New Year (Day 4)',
  '2024-03-29': 'Good Friday',
  '2024-03-30': 'Holy Saturday',
  '2024-04-01': 'Easter Monday',
  '2024-04-04': 'Ching Ming Festival',
  '2024-05-01': 'Labour Day',
  '2024-05-15': 'Birthday of the Buddha',
  '2024-06-10': 'Tuen Ng Festival',
  '2024-07-01': 'HKSAR Establishment Day',
  '2024-09-18': 'Day following Mid-Autumn',
  '2024-10-01': 'National Day',
  '2024-10-11': 'Chung Yeung Festival',
  '2024-12-25': 'Christmas Day',
  '2024-12-26': 'Day following Christmas',

  // 2025
  '2025-01-01': 'New Year\'s Day',
  '2025-01-29': 'Lunar New Year (Day 1)',
  '2025-01-30': 'Lunar New Year (Day 2)',
  '2025-01-31': 'Lunar New Year (Day 3)',
  '2025-04-04': 'Ching Ming Festival',
  '2025-04-18': 'Good Friday',
  '2025-04-19': 'Holy Saturday',
  '2025-04-21': 'Easter Monday',
  '2025-05-01': 'Labour Day',
  '2025-05-05': 'Birthday of the Buddha',
  '2025-05-31': 'Tuen Ng Festival',
  '2025-07-01': 'HKSAR Establishment Day',
  '2025-10-01': 'National Day',
  '2025-10-07': 'Day following Mid-Autumn',
  '2025-10-29': 'Chung Yeung Festival',
  '2025-12-25': 'Christmas Day',
  '2025-12-26': 'Day following Christmas',

   // 2026 (Partial/Estimated for major ones)
  '2026-01-01': 'New Year\'s Day',
  '2026-02-17': 'Lunar New Year (Day 1)',
  '2026-02-18': 'Lunar New Year (Day 2)',
  '2026-02-19': 'Lunar New Year (Day 3)',
  '2026-04-03': 'Good Friday',
  '2026-04-04': 'Holy Saturday', // Also Ching Ming
  '2026-04-06': 'Easter Monday',
  '2026-05-01': 'Labour Day',
  '2026-05-24': 'Birthday of the Buddha',
  '2026-06-19': 'Tuen Ng Festival',
  '2026-07-01': 'HKSAR Establishment Day',
  '2026-10-01': 'National Day',
  '2026-09-26': 'Day following Mid-Autumn',
  '2026-10-18': 'Chung Yeung Festival',
  '2026-12-25': 'Christmas Day',
  '2026-12-26': 'Day following Christmas',
};

export const getHoliday = (date: Date): Holiday | undefined => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const key = `${year}-${month}-${day}`;
  
  if (hkHolidays[key]) {
    return {
      date: key,
      name: hkHolidays[key],
      isStatutory: true // Simplified: treating all in list as statutory for display
    };
  }
  return undefined;
};
