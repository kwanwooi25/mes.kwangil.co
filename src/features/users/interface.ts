import { UserDto } from 'features/auth/interface';
import { BaseQuery } from 'types/api';

export type GetUsersQuery = BaseQuery;

export interface UpdateUserDto extends UserDto {}
