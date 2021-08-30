import { AccountDto } from 'features/account/interface';
import { BaseQuery } from 'types/api';

export interface QuoteFilter {}

export type GetQuotesQuery = BaseQuery & QuoteFilter;

export interface QuoteDto {
  id: number;
  productName?: string;
  thickness: number;
  length: number;
  width: number;
  printColorCount?: number;
  variableRate: number;
  printCostPerRoll?: number;
  defectiveRate: number;
  plateRound?: number;
  plateLength?: number;
  unitPrice: number;
  minQuantity: number;
  plateCost?: number;
  plateCount?: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  account: AccountDto;
}

export interface CreateQuoteDto extends Omit<QuoteDto, 'id' | 'account' | 'createdAt' | 'updatedAt' | 'deletedAt'> {
  accountId: number;
}
