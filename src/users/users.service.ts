import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    // User 데이터베이스 주입
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async create(
    createUserDto: CreateUserDto,
  ): Promise<Omit<User, 'passwordHash'>> {
    // Promise<Omit<User, 'passwordHash'>> 는 User 객체에서 passwordHash 프로퍼티를 제외하겠다는 타입 수준을 명시한다. (API 응답에 비밀번호 해시 값은 제외된다.)
    const { email, password } = createUserDto;

    // 1. 이메일 중복 확인
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      // 이메일 중복 시 409 에러 발생
      throw new ConflictException('이미 사용 중인 이메일입니다.');
    }

    // 2. 비밀번호 해싱
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    // 3. 사용자 생성 및 저장
    const user = this.usersRepository.create({ email, passwordHash });
    const savedUser = await this.usersRepository.save(user);

    // 4. 비밀번호를 제외한 사용자 정보 반환
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, ...userWithoutPassword } = savedUser;

    return userWithoutPassword;
  }
}
