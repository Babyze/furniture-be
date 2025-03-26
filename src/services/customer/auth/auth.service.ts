import { CustomerSignInRequestDto, CustomerSignInResponseDto } from '@src/dto/customer/signin.dto';
import { CustomerSignUpRequestDto, CustomerSignUpResponseDto } from '@src/dto/customer/signup.dto';
import { ConflictError, UnauthorizedError } from '@src/errors/http.error';
import { User } from '@src/models/user.model';
import { UserRepository } from '@src/repositories/user.repository';
import { generateTokenPair } from '@src/utils/jwt.util';
import { comparePassword, hashPassword } from '@src/utils/password.util';
import { generateUUID } from '@src/utils/uuid.util';
export class CustomerAuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async signUp(signUpDto: CustomerSignUpRequestDto): Promise<CustomerSignUpResponseDto> {
    const users = await this.userRepository.query(
      'SELECT * FROM user WHERE email = ? OR username = ?',
      [signUpDto.email, signUpDto.username],
    );

    if (users.length > 0) {
      throw new ConflictError('Email or username already exists');
    }

    const hashedPassword = await hashPassword(signUpDto.password);

    const newUser: User = {
      id: generateUUID(),
      email: signUpDto.email,
      password: hashedPassword,
      fullName: signUpDto.fullName,
      isAgreeAllPolicy: true,
      createdDate: new Date(),
      updatedDate: new Date(),
    };

    const createdUser = await this.userRepository.insert(newUser);

    const { accessToken, refreshToken } = generateTokenPair({
      id: createdUser.id,
      email: createdUser.email,
    });

    return new CustomerSignUpResponseDto(
      createdUser.id,
      createdUser.fullName,
      accessToken,
      refreshToken,
    );
  }

  async signIn(signInDto: CustomerSignInRequestDto): Promise<CustomerSignInResponseDto> {
    const users = await this.userRepository.query('SELECT * FROM user WHERE email = ?', [
      signInDto.email,
    ]);

    if (users.length === 0) {
      throw new UnauthorizedError('Invalid login information');
    }

    const user = users[0];
    const isPasswordValid = await comparePassword(signInDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid login information');
    }

    const { accessToken, refreshToken } = generateTokenPair({
      id: user.id,
      email: user.email,
    });

    return new CustomerSignInResponseDto(accessToken, refreshToken);
  }
}
