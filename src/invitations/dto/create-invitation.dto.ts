import { IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from '../../memberships/entities/membership.entity';

export class CreateInvitationDto {
  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;
}
