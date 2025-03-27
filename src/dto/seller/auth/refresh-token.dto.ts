import { IsNotEmpty, IsString } from 'class-validator';

export class SellerRefreshTokenRequestDto {
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}

export class SellerRefreshTokenResponseDto {
  accessToken: string;
  refreshToken: string;

  constructor(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}
