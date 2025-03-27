import { Seller } from '@src/models/seller.model';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SellerSignInRequestDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}

export class SellerSignInResponseDto {
  constructor(
    public accessToken: string,
    public refreshToken: string,
    public user: Pick<Seller, 'id' | 'email' | 'fullName'>,
  ) {}
}
