import { Customer } from '@src/models/customer.model';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CustomerSignUpRequestDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}

export interface CustomerSignUpResponseDto {
  accessToken: string;
  refreshToken: string;
  user: Pick<Customer, 'id' | 'email' | 'fullName'>;
}
