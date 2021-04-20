import { CRN_MAX_LENGTH, PHONE_NUMBER_MAX_LENGTH } from 'const';

/**
 * 숫자만 추출
 *
 * @param input
 * @param maxLength 최대 숫자 길이
 *
 * @example 123,456,789 -> 123456789
 */
export function filterDigits(input: string, maxLength: number = Infinity): string {
  return input.replace(/[^\d]/g, '').slice(0, maxLength);
}

/**
 * 천단위 콤마 표시하여 반환
 *
 * @param input
 *
 * @example 123456789 -> 123,456,789
 */
export function formatDigit(input: string | number): string {
  const digits = filterDigits(`${input}`);
  return digits.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
}

/**
 * 전화번호 형식으로 반환
 *
 * @param input
 *
 * @example 01012345678 -> 010-1234-5678
 */
export function formatPhoneNumber(input: string): string {
  return filterDigits(input, PHONE_NUMBER_MAX_LENGTH).replace(
    /(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/,
    '$1-$2-$3'
  );
}

/**
 * 사업자 등록 번호 형식으로 반환
 *
 * @param input
 *
 * @example 1320536907 -> 132-05-35907
 */
export function formatCrn(input: string): string {
  return filterDigits(input, CRN_MAX_LENGTH).replace(/([0-9]{3})([0-9]{2})([0-9]+)/, '$1-$2-$3');
}

/**
 * 검색 문자열을 하이라이팅할 수 있는 HTML 형태로 반환
 *
 * @param input
 * @param keyword 검색 키워드
 *
 * @example 가나다라마 -> 가나<span class="highlight">다라</span>마
 */
export function highlight(input: string, keyword: string = ''): string {
  if (!keyword || input.toLowerCase().indexOf(keyword.toLowerCase()) < 0) {
    return input;
  }

  const index = input.toLowerCase().indexOf(keyword.toLowerCase());
  const matching = input.substring(index, index + keyword.length);
  return input.replace(matching, `<span class="highlight">${matching}</span>`);
}

/**
 * 파일 확장자를 제거
 *
 * @param filename
 *
 * @example abcd.jpg -> abcd
 */
export function removeFileExtension(filename: string): string {
  return filename.replace(/\.[^/.]+$/, '');
}

/**
 * URL에서 파일명만 추출하여 반환
 *
 * @param url
 *
 * @example https://abc.com/efg.jpg -> efg.jpg
 */
export function getFileNameFromUrl(url: string): string {
  return url.split('/').pop() || '';
}
