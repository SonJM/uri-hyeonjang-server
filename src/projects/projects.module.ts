import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Membership } from 'src/memberships/entities/membership.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Membership])], // Project와 Membership Repository를 주입할 수 있도록 등록
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
