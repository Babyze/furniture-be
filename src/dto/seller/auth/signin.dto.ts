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
  ) {}
}
