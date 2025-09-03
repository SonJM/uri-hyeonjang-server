import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Invitation } from './entities/invitation.entity';
import { Repository } from 'typeorm';
import { Membership, Role } from '../memberships/entities/membership.entity';
import { nanoid } from 'nanoid';

@Injectable()
export class InvitationsService {
  constructor(
    @InjectRepository(Invitation)
    private invitationsRepository: Repository<Invitation>,
    @InjectRepository(Membership)
    private membershipsRepository: Repository<Membership>,
  ) {}

  /**
   * 초대 코드 생성
   * @param projectId 코드를 생성할 작업방 ID
   * @param role 부여할 역할
   * @param requesterId 요청한 사용자 ID
   */
  async create(projectId: number, role: Role, requesterId: number) {
    // 1. 요청자가 해당 작업방의 관리자인지 확인 (가장 중요!)
    const requesterMembership = await this.membershipsRepository.findOne({
      where: { projectId, userId: requesterId },
    });

    if (!requesterMembership || requesterMembership.role !== Role.ADMIN) {
      throw new ForbiddenException('초대 코드를 생성할 권한이 없습니다.');
    }

    // 2. 고유 코드 생성 및 만료 시간 설정
    const code = nanoid(10); // 10자리 랜덤 코드 생성
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7일 후 만료

    const invitation = this.invitationsRepository.create({
      projectId,
      role,
      code,
      expiresAt,
    });

    return this.invitationsRepository.save(invitation);
  }

  /**
   * 초대 코드로 작업방 참여
   * @param code 초대 코드
   * @param joiningUserId 참여하려는 사용자 ID
   */
  async joinProject(code: string, joiningUserId: number) {
    // 1. 유효한 초대 코드인지 확인
    const invitation = await this.invitationsRepository.findOne({
      where: { code },
    });

    if (!invitation || invitation.expiresAt < new Date()) {
      throw new NotFoundException('유효하지 않거나 만료된 초대 코드입니다.');
    }

    // 2. 이미 해당 작업방의 멤버인지 확인
    const existingMembership = await this.membershipsRepository.findOne({
      where: {
        projectId: invitation.projectId,
        userId: joiningUserId,
      },
    });

    if (existingMembership) {
      throw new ConflictException('이미 참여하고 있는 작업방입니다.');
    }

    // 3. 멤버십 생성
    const newMembership = this.membershipsRepository.create({
      userId: joiningUserId,
      projectId: invitation.projectId,
      role: invitation.role,
    });

    // 사용된 초대 코드 삭제하여 재사용 방지
    await this.invitationsRepository.remove(invitation);

    return this.membershipsRepository.save(newMembership);
  }
}
