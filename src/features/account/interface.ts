export interface GetAccountsQuery {
  offset?: number;
  limit?: number;
  searchText?: string;
}

export interface AccountDto {
  id: number;
  name: string;
  crn?: string;
  memo?: string;
  contacts?: ContactDto[];
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