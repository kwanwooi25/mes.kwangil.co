import { CreateQuoteDto, QuoteFormValues } from 'features/quote/interface';

export interface QuoteSource {
  thickness: number;
  length: number;
  width: number;
  variableRate: number;
  printColorCount: number;
  printCostPerRoll: number;
  defectiveRate: number;
}

export interface QuoteResult {
  sheetCost: number;
  printCostPerColor: number;
  unitPrice: number;
  minQuantity: number;
}

export interface PlateSizes {
  plateRound: number;
  plateLength: number;
}

export function getQuote({
  thickness,
  length,
  width,
  variableRate,
  printColorCount,
  printCostPerRoll,
  defectiveRate,
}: QuoteSource): QuoteResult {
  const sheetCost = +thickness * (+length + 5) * +width * 0.184 * (+variableRate / 100);
  const minQuantity = Math.round(100 / (+thickness * (+length + 5) * (+width / 100) * 0.0184));

  if (!printColorCount) {
    return {
      sheetCost: +sheetCost.toFixed(1),
      printCostPerColor: 0,
      unitPrice: +sheetCost.toFixed(1),
      minQuantity,
    };
  }

  // eslint-disable-next-line no-nested-ternary
  const weightPerRoll = +length < 15 ? 13 : +length < 25 ? 15 : +length < 35 ? 18 : 20;
  const lengthPerRoll = Math.round(weightPerRoll / (+thickness * (+length + 5) * 0.0184));
  const printCostPerColor = printCostPerRoll / (lengthPerRoll / (+width / 100));
  const unitPrice = (sheetCost + printCostPerColor * +printColorCount) * (1 + defectiveRate / 100);

  return {
    sheetCost: +sheetCost.toFixed(1),
    printCostPerColor: +printCostPerColor.toFixed(1),
    unitPrice: +unitPrice.toFixed(1),
    minQuantity,
  };
}

export function getPlateCost({ plateRound = 0, plateLength = 0 }: PlateSizes): number {
  const unitPrice = plateRound >= 400 ? 50 : 80;
  return (+plateRound * +plateLength * unitPrice) / 100;
}

export function getQuoteToCreate({
  account,
  productName,
  thickness,
  length,
  width,
  printColorCount,
  variableRate,
  printCostPerRoll,
  defectiveRate,
  plateRound,
  plateLength,
  unitPrice,
  minQuantity,
  plateCost,
  plateCount,
}: QuoteFormValues): CreateQuoteDto {
  let quoteToCreate: CreateQuoteDto = {
    accountId: account?.id as number,
    productName,
    thickness,
    length,
    width,
    printColorCount,
    variableRate,
    defectiveRate,
    unitPrice,
    minQuantity,
  };

  if (printColorCount) {
    quoteToCreate = {
      ...quoteToCreate,
      printCostPerRoll,
      plateRound,
      plateLength,
      plateCost,
      plateCount,
    };
  }

  return quoteToCreate;
}
