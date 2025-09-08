import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { Membership, Role } from '../memberships/entities/membership.entity';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(Membership)
    private membershipsRepository: Repository<Membership>,
  ) {}

  /**
   * 게시물 생성
   * @param createPostDto 게시물 생성 정보
   * @param projectId 게시물을 올릴 작업방 ID
   * @param authorId 작성자 ID
   */
  async create(
    createPostDto: CreatePostDto,
    projectId: number,
    authorId: number,
  ): Promise<Post> {
    // 1. 글을 작성하려는 사용자가 해당 작업방의 '관리자'인지 확인
    const membership = await this.membershipsRepository.findOne({
      where: { projectId, userId: authorId },
    });

    if (!membership || membership.role !== Role.ADMIN) {
      throw new ForbiddenException('게시물을 작성할 권한이 없습니다.');
    }

    // 2. 권한이 있다면 게시물 생성
    const newPost = this.postsRepository.create({
      ...createPostDto,
      projectId,
      authorId,
    });

    return this.postsRepository.save(newPost);
  }

  /**
   * 특정 작업방의 모든 게시물 목록 조회
   * @param projectId 작업방 ID
   * @param userId 요청한 사용자 ID
   */
  async findAllForProject(projectId: number, userId: number): Promise<Post[]> {
    // 1. 목록을 보려는 사용자가 해당 작업방의 '멤버'인지 확인
    const membership = await this.membershipsRepository.findOne({
      where: { projectId, userId },
    });

    if (!membership) {
      throw new ForbiddenException('게시물을 조회할 권한이 없습니다.');
    }

    // 2. 멤버가 맞다면, 최신순으로 게시물 목록 반환
    return this.postsRepository.find({
      where: { projectId },
      order: { createdAt: 'DESC' },
      relations: ['author'], // 작성자 정보를 함께 가져오기
    });
  }
}
