import jwtConfig from '@src/config/jwt.config';
import { JwtService } from '@src/services/jwt/jwt.service';

export class SellerJwtService extends JwtService {
  constructor() {
    super(
      jwtConfig.JWT_SELLER_SECRET,
      jwtConfig.JWT_SELLER_REFRESH_SECRET,
      jwtConfig.JWT_SELLER_EXPIRES_IN,
      jwtConfig.JWT_SELLER_REFRESH_EXPIRES_IN,
    );
  }
}
