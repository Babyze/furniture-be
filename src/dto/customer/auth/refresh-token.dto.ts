import { IsNotEmpty, IsString } from 'class-validator';

export class CustomerRefreshTokenRequestDto {
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}

export class CustomerRefreshTokenResponseDto {
  accessToken: string;
  refreshToken: string;

  constructor(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}
