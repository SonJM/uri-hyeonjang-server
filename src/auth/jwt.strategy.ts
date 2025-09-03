import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');

    if (!secret) {
      throw new Error('JWT_SECRET 환경 변수가 설정되지 않았습니다.');
    }

    super({
      // 토큰을 어디서 추출할지 설정 (Authorization 헤더의 Bearer 토큰)
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 만료된 토큰을 거부할지 설정
      ignoreExpiration: false,
      // 토큰 검증에 사용할 비밀 키
      secretOrKey: secret,
    });
  }

  /**
   * 토큰 검증이 성공적으로 끝나면 실행되는 메서드
   * Passport가 payload를 분석하여 이 메서드의 인자로 전달해 줍니다.
   */
  async validate(payload: any) {
    // payload에는 login 시점에 우리가 넣었던 { email, sub: id }가 들어있습니다.
    return { userId: payload.sub, email: payload.email };
  }
}
