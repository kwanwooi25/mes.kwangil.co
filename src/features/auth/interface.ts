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
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
