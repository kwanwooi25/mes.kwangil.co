import { Permissions } from 'const';

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResult {
  user: UserDto;
  token: string;
}

export interface SignUpDto {
  email: string;
  password: string;
  name: string;
  mobile?: string;
  department?: string;
  position?: string;
  profileImageUrl?: string;
}

export interface UserDto {
  id: number;
  email: string;
  name: string;
  mobile?: string;
  department?: string;
  position?: string;
  profileImageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  userRole: UserRoleDto;
  isActive: boolean;
}

export interface UserRoleDto {
  id: number;
  name: string;
  permissions: Permissions[];
}
