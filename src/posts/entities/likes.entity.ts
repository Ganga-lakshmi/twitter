import { Users } from 'src/users/users.entity';
import {
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Posts } from './posts.entity';

@Entity()
export class Likes {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Posts, (post) => post.likes)
  posts: Posts;

  @ManyToOne(() => Users, (user) => user.likes)
  created_by_user: Users;

  @DeleteDateColumn()
  deleted_at: Date;
}
