import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

// class-validator 패키지를 이용해 Request Body로 데이터가 넘어올 때 자동으로 검증 절차를 거치게 한다.
export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
