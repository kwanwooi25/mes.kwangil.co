export interface BaseQuery {
  offset: number;
  limit: number;
}

export interface GetListResponse<T> {
  rows: T[];
  count: number;
  hasMore: boolean;
}

export interface BulkCreationResponse<T> {
  createdCount: number;
  failedList: (T & { reason: string })[];
}
