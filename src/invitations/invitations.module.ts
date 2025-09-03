import { Module } from '@nestjs/common';
import { InvitationsController } from './invitations.controller';
import { InvitationsService } from './invitations.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invitation } from './entities/invitation.entity';
import { Membership } from 'src/memberships/entities/membership.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Invitation, Membership])],
  controllers: [InvitationsController],
  providers: [InvitationsService],
})
export class InvitationsModule {}
