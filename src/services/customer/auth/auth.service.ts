import { generateTokenPair } from '@src/utils/jwt.util';
import { hashPassword } from '@src/utils/password.util';
import { UserRepository } from '@src/repositories/user.repository';
import { User } from '@src/models/user.model';
import { generateUUID } from '@src/utils/uuid.util';
import { CustomerSignUpRequestDto, CustomerSignUpResponseDto } from '@src/dto/customer/signup.dto';
import { ConflictError } from '@src/errors/http.error';

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
      username: signUpDto.username,
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
}
