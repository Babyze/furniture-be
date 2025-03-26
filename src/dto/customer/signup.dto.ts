import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CustomerSignUpRequestDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password!: string;
}

export class CustomerSignUpResponseDto {
  constructor(
    public id: string,
    public fullName: string,
    public accessToken: string,
    public refreshToken: string,
  ) {}
}
