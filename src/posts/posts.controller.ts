import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { Features } from 'src/auth/decorator/role.decorator';
import { RequiredPermission } from 'src/utils/constants';
import { createCommentDto, createPostDto } from './dto/posts.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  // @Get('/')
  // async getAllPosts(
  //   @Query() query: PostDetailsQueryParams,
  // ){
  //   return await this.postsService.getAllPosts(query.authorId);
  // }
  @Features(RequiredPermission.Posts)
  @Get('/likedPosts')
  async getLikes(@Request() req) {
    const likedPosts = await this.postsService.listLikes(req.user.id);
    return likedPosts;
  }

  @Features(RequiredPermission.Posts)
  @Get('/:postId')
  async getPostDetails(@Param('postId') postId: number) {
    return await this.postsService.getPost(postId);
  }

  @Features(RequiredPermission.Posts)
  @Post('/')
  async createPost(@Request() req, @Body() body: createPostDto) {
    const posts = await this.postsService.create(req.user.id, body);
    return {
      is_success: true,
      message: 'Successfully created the post',
      posts,
    };
  }

  @Features(RequiredPermission.Posts)
  @Delete('/:postId')
  async deletePost(@Param('postId') postId: number, @Request() req) {
    const deletedPost = await this.postsService.deletePost(postId, req.user.id);
    return {
      is_success: true,
      message: 'successfully deleted post',
    };
  }

  @Features(RequiredPermission.Posts)
  @Put('/:postid/like')
  async likePost(@Param('postid') postid: number, @Request() req) {
    const likedPost = await this.postsService.likePost(req.user.id, postid);
    return {
      is_success: true,
      message: 'Successfully liked the post',
      likedPost,
    };
  }

  @Features(RequiredPermission.Posts)
  @Delete('/:postid/unlike')
  async unlikePost(@Param('postId') postId: number, @Request() req) {
    const unlikedPost = await this.postsService.unlikePost(req.user.id, postId);
    return {
      is_success: true,
      message: 'Successfully unliked the post',
    };
  }
  @Features(RequiredPermission.Posts)
  @Put('/postid/comment')
  async addComment(
    @Param('postid') postid: number,
    @Request() req,
    @Body() body: createCommentDto,
  ) {
    const comment = await this.postsService.addComment(
      postid,
      req.user.id,
      body,
    );
    return {
      is_success: true,
      message: 'Successfully added the comment',
      comment,
    };
  }

  @Features(RequiredPermission.Posts)
  @Delete('/postid/delete-comment')
  async deleteComment(@Param('postid') postid: number, @Request() req) {
    const comment = await this.postsService.deleteComment(postid, req.user.id);
    return {
      is_success: true,
      message: 'successfully deleted the comment',
    };
  }
}
