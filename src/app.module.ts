import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { HashtagsController } from './hashtags/hashtags.controller';
import { HashtagsService } from './hashtags/hashtags.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UsersModule, PostsModule, AuthModule],
  controllers: [AppController, HashtagsController, AuthController],
  providers: [AppService, HashtagsService, AuthService],
})
export class AppModule {}
