import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { Membership, Role } from '../memberships/entities/membership.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @InjectRepository(Membership)
    private membershipsRepository: Repository<Membership>,
  ) {}

  /**
   * 새로운 작업방을 생성하고, 생성자를 관리자로 자동 등록합니다.
   * @param createProjectDto 작업방 생성 정보
   * @param userId 생성자(로그인한 사용자)의 ID
   */
  async create(
    createProjectDto: CreateProjectDto,
    userId: number,
  ): Promise<Project> {
    // 작업방 생성
    const newProject = this.projectsRepository.create({
      name: createProjectDto.name,
    });
    const savedProject = await this.projectsRepository.save(newProject);

    // 생성자를 관리자(ADMIN) 역할로 멤버십에 추가
    const membership = this.membershipsRepository.create({
      userId,
      projectId: savedProject.id,
      role: Role.ADMIN,
    });
    await this.membershipsRepository.save(membership);

    return savedProject;
  }

  /**
   * 특정 사용자가 참여하고 있는 모든 작업방 목록을 조회합니다.
   * @param userId 로그인한 사용자의 ID
   */
  async findAllForUser(userId: number): Promise<Project[]> {
    const memberships = await this.membershipsRepository.find({
      where: { userId },
      relations: ['project'], // 'project' 관계를 함께 로드
    });

    // Membership 배열에서 Project 정보만 추출하여 반환
    return memberships.map((membership) => membership.project);
  }
}
