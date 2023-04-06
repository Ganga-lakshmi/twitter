import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { Comments } from './entities/comments.entity';
import { Likes } from './entities/likes.entity';
import { Posts } from './entities/posts.entity';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Posts, Likes, Comments]), UsersModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
