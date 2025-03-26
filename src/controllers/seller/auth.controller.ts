import { SellerAuthService } from '@src/services/seller/auth/auth.service';

export class SellerAuthController {
  private authService: SellerAuthService;

  constructor() {
    this.authService = new SellerAuthService();
  }
}
