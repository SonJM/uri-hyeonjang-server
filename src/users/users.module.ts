// src/users/users.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService], // User 엔티티를 이 모듈에서 사용하도록 등록
  exports: [UsersService], // UserService를 다른 모듈에서 사용할 수 있도록 export
})
export class UsersModule {}
