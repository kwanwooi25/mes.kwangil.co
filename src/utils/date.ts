import { DATE_FORMAT } from 'const';
import { format } from 'date-fns';

/**
 * 날짜를 원하는 형식으로 변환
 *
 * @param date 날짜
 * @param formatString 날짜형식
 *
 * @example 'yyyy-MM-dd' -> 2021-03-11
 */
export function formatDate(date?: Date | string | null, formatString: string = DATE_FORMAT): string {
  if (!date) {
    return '';
  }

  return format(new Date(date), formatString);
}
