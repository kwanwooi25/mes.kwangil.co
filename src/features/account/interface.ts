import { DeliveryMethod } from 'const';
import { BaseQuery } from 'types/api';

export interface AccountFilter {
  accountName?: string;
}

export type GetAccountsQuery = BaseQuery & AccountFilter;

export interface AccountDto {
  id: number;
  name: string;
  crn?: string;
  deliveryMethod?: DeliveryMethod;
  memo?: string;
  contacts?: ContactDto[];
}

export interface CreateAccountDto extends Omit<AccountDto, 'id' | 'contacts'> {
  contacts?: CreateContactDto[];
}

export interface UpdateAccountDto extends AccountDto {
  contactsToCreate?: CreateContactDto;
  contactIdsToDelete?: number[];
}

export interface ContactDto {
  id: number;
  title: string;
  isBase?: boolean;
  phone?: string;
  fax?: string;
  email?: string;
  address?: string;
  memo?: string;
}

export interface CreateContactDto extends Omit<ContactDto, 'id'> {
  id?: number;
}

export interface AccountOption {
  id: number;
  name: string;
}
