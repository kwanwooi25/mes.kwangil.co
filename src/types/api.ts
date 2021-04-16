export interface GetListResponse<T> {
  rows: T[];
  count: number;
  hasMore: boolean;
}
