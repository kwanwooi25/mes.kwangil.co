import { UserRole } from 'const';

export interface LoginDto {
  email: string;
  password: string;
}

export interface UserDto {
  id: number | string;
  email: string;
  name: string;
  mobile?: string;
  department?: string;
  position?: string;
  profileImageUrl?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
