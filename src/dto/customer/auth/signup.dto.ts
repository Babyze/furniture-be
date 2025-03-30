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
  username!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}

export class CustomerSignUpResponseDto {
  constructor(
    public id: number,
    public fullName: string,
    public accessToken: string,
    public refreshToken: string,
  ) {}
}
