import { PlateDto } from 'features/plate/interface';
import { getProductTitle } from './product';

/**
 * 동판 규격 조합
 *
 * @param plate 동판 정보
 *
 * @example 400 x 450
 */
export function getPlateSize(plate: PlateDto) {
  if (!plate) {
    return '';
  }

  return `${plate.round} x ${plate.length}`;
}

/**
 * 동판 제목 조합
 *
 * @param plate 동판 정보
 *
 * @example 300 x 350 (가나다약국 베다판)
 */
export function getPlateTitle(plate: PlateDto) {
  const plateSize = getPlateSize(plate);
  if (!plate) {
    return '';
  }
  if (!plate.name) {
    return plateSize;
  }

  return `${plateSize} (${plate.name})`;
}

/**
 * 동판 사용 제품 요약 정보
 *
 * @param plate 동판 정보
 * @param displayCount 제품 정보를 표시할 갯수
 *
 * @example ['가나다약국 (0.07 x 20 x 13)', '... + 1']
 */
export function getPlateProductsSummary({ products }: PlateDto, displayCount: number = 1): string[] {
  if (!products || !products.length) {
    return [];
  }

  const iterateTo = Math.min(displayCount, products.length);

  let summaryTextArray = [];

  for (let i = 0; i < iterateTo; i++) {
    summaryTextArray.push(getProductTitle(products[i]));
  }

  const remainder = products.length - displayCount;
  if (remainder > 0) {
    summaryTextArray.push(`... + ${remainder}`);
  }

  return summaryTextArray;
}
