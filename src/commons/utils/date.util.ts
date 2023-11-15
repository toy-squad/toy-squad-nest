/**
 * 날짜 형식 및 범위 유효성, 윤년 여부를 검사
 *
 * @param dateString (YYYY-MM-DD)
 * @returns boolean
 *
 * @example
 * isValidDate('2021-01-01') // true
 * isValidDate('2021-01-32') // false
 * isValidDate('2021-02-29') // false
 *
 */
export const isValidDate = (dateString: string): boolean => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;

  if (!regex.test(dateString)) {
    return false;
  }

  const [year, month, day] = dateString.split('-').map(Number);

  if (month < 1 || month > 12) {
    return false;
  }

  let daysInMonth = 31;
  if (month === 2) {
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    daysInMonth = isLeapYear ? 29 : 28;
  } else if ([4, 6, 9, 11].includes(month)) {
    daysInMonth = 30;
  }

  return day > 0 && day <= daysInMonth;
};
