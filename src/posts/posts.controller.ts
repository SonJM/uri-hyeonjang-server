import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('projects/:projectId/posts') // URL 경로 설정
@UseGuards(AuthGuard('jwt'))
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() createPostDto: CreatePostDto,
    @Request() req,
  ) {
    const authorId = req.user.userId;
    return this.postsService.create(createPostDto, projectId, authorId);
  }

  @Get()
  findAll(@Param('projectId', ParseIntPipe) projectId: number, @Request() req) {
    const userId = req.user.userId;
    return this.postsService.findAllForProject(projectId, userId);
  }
}
