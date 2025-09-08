import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { Membership } from './memberships/entities/membership.entity';
import { Project } from './projects/entities/project.entity';
import { Post } from './posts/entities/post.entity';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { InvitationsModule } from './invitations/invitations.module';
import { Invitation } from './invitations/entities/invitation.entity';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 전역 모듈로 설정
    }),
    TypeOrmModule.forRoot({
      type: 'postgres', // 데이터베이스 종류
      host: 'localhost', // 데이터베이스 서버 주소
      port: 5432, // PostgreSQL 기본 포트
      username: 'postgres', // PostgreSQL 사용자 이름
      password: '1234', // PostgreSQL 사용자 비밀번호
      database: 'hyeonjang_dev', // 사용할 데이터베이스 이름
      entities: [User, Membership, Project, Post, Invitation], // 앞으로 만들 엔티티(테이블) 목록
      synchronize: true, // true로 설정하면 코드를 기반으로 DB 스키마를 자동 동기화 (개발용)
    }),
    UsersModule,
    AuthModule,
    ProjectsModule,
    InvitationsModule,
    PostsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
