import { Customer } from '@src/models/customer.model';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CustomerSignInRequestDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}

export interface CustomerSignInResponseDto {
  accessToken: string;
  refreshToken: string;
  user: Pick<Customer, 'id' | 'email' | 'fullName'>;
}
