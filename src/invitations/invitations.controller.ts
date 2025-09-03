import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { JoinProjectDto } from './dto/join-project.dto';

@Controller()
@UseGuards(AuthGuard('jwt'))
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  // 작업방 초대 코드 생성 API
  @Post('projects/:projectId/invitations')
  create(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() createInvitationDto: CreateInvitationDto,
    @Request() req,
  ) {
    const requesterId = req.user.userId;
    return this.invitationsService.create(
      projectId,
      createInvitationDto.role,
      requesterId,
    );
  }

  // 초대 코드로 작업방 참여 API
  @Post('invitations/join')
  joinProject(@Body() joinProjectDto: JoinProjectDto, @Request() req) {
    const joiningUserId = req.user.userId;
    return this.invitationsService.joinProject(
      joinProjectDto.code,
      joiningUserId,
    );
  }
}
