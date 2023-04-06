import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { Comments } from './entities/comments.entity';
import { Likes } from './entities/likes.entity';
import { Posts } from './entities/posts.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts) private postRepository: Repository<Posts>,
    @InjectRepository(Likes) private likesRepository: Repository<Likes>,
    @InjectRepository(Comments)
    private commentsRepository: Repository<Comments>,
    private usersService: UsersService,
  ) {}

  async create(userId: number, body: any) {
    const user = await this.usersService.findUserById(userId);
    const postsInstance = await this.postRepository.create({
      text: body.text,
      created_by_user: user,
    });
    const post = await this.postRepository.save(postsInstance);
    return post;
  }

  async getPost(postId: number) {
    const post = await this.postRepository.findOneBy({ id: postId });
    if (!post) {
      throw new NotFoundException({
        is_success: false,
        message: 'Post not found',
      });
    }
    return post;
  }

  async deletePost(postId: number, userId: number) {
    const post = await this.postRepository.findOneBy({ id: postId });
    if (!post) {
      throw new NotFoundException({
        is_success: false,
        message: 'Post not found',
      });
    }
    const isAuthor = await this.postRepository.findOne({
      where: {
        created_by_user: {
          id: userId,
        },
      },
    });
    if (!isAuthor) {
      throw new BadRequestException({
        is_success: false,
        message: 'the created author only can delete post',
      });
    }
    return await this.postRepository.softDelete({ id: postId });
  }

  async likePost(userId: number, postId: number) {
    const isLikedPost = await this.likesRepository.findOne({
      where: {
        posts: {
          id: postId,
        },
        created_by_user: {
          id: userId,
        },
      },
    });

    if (isLikedPost) {
      throw new NotFoundException({
        is_success: false,
        message: 'the post is already liked by You',
      });
    }
    const post = await this.postRepository.findOneBy({ id: postId });

    const user = await this.usersService.findUserById(userId);
    if (!post || !user) {
      throw new NotFoundException({
        is_success: false,
        message: 'Post/user not found',
      });
    }

    const likeParams = {
      posts: post,
      created_by_user: user,
    };

    const likesInstance = await this.likesRepository.create(likeParams);
    const likedPost = await this.likesRepository.save(likesInstance);

    return likedPost;
  }

  async unlikePost(userId: number, postId: number) {
    const isLikedPost = await this.likesRepository.findOne({
      where: {
        posts: {
          id: postId,
        },
        created_by_user: {
          id: userId,
        },
      },
    });

    if (!isLikedPost) {
      throw new NotFoundException({
        is_success: false,
        message: 'Not found the likedPost',
      });
    }

    return await this.likesRepository.softDelete({ id: isLikedPost.id });
  }

  async listLikes(userId: number) {
    const [likes, totalCount] = await this.likesRepository.findAndCount({
      where: {
        created_by_user: {
          id: userId,
        },
      },
    });
    return { likes, totalCount };
  }

  async addComment(postid: number, userid: number, body: any) {
    const user = await this.usersService.findUserById(userid);
    const post = await this.postRepository.findOneBy({ id: postid });
    if (!post) {
      throw new NotFoundException({
        is_success: false,
        message: 'Post not found',
      });
    }

    const payload = {
      comment: body.comment,
      created_by_user: user,
      posts: post,
    };

    const commentsInstance = await this.commentsRepository.create(payload);
    const addedComment = await this.commentsRepository.save(commentsInstance);
    return addedComment;
  }

  async deleteComment(postid: number, userid: number) {
    const isCommentExists = await this.commentsRepository.findOne({
      where: {
        created_by_user: {
          id: userid,
        },
        posts: {
          id: postid,
        },
      },
    });
    if (!isCommentExists) {
      throw new NotFoundException({
        is_success: false,
        message: 'Comment not found',
      });
    }
    //if you want specific comment to delete use comment:... in where clause
    return await this.commentsRepository.softDelete({ id: isCommentExists.id });
  }
}
