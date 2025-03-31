import jwtConfig from '@src/config/jwt.config';
import { JwtService } from '@src/services/jwt/jwt.service';

export class CustomerJwtService extends JwtService {
  constructor() {
    super(
      jwtConfig.JWT_CUSTOMER_SECRET,
      jwtConfig.JWT_CUSTOMER_REFRESH_SECRET,
      jwtConfig.JWT_CUSTOMER_EXPIRES_IN,
      jwtConfig.JWT_CUSTOMER_REFRESH_EXPIRES_IN,
    );
  }
}
