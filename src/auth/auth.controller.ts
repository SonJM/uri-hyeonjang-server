import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('로그인 정보가 올바르지 않습니다.');
    }

    return this.authService.login(user);
  }

  /**
   * 로그인이 필요한 엔드포인트
   * GET /auth/profile
   */
  @UseGuards(AuthGuard('jwt')) // 이 한 줄이 JWT 가드를 활성화
  @Get('/profile')
  getProfile(@Request() req) {
    // req.user는 JwtStrategy의 validate 메서드가 반환한 값입니다
    return req.user;
  }
}
