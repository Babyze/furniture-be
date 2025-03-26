import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CustomerSignInRequestDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}

export class CustomerSignInResponseDto {
  constructor(
    public accessToken: string,
    public refreshToken: string,
  ) {}
}
