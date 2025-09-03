import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { Role } from '../../memberships/entities/membership.entity';

@Entity('invitations')
export class Invitation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string; // 고유한 초대 코드

  @Column({
    type: 'enum',
    enum: Role,
  })
  role: Role; // 이 초대로 들어올 사용자의 역할

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  expiresAt: Date; // 초대 만료 시간

  @Column()
  projectId: number;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projectId' })
  project: Project;
}
