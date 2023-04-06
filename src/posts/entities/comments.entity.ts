import { Users } from 'src/users/users.entity';
import {
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Posts } from './posts.entity';

@Entity()
export class Comments {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Posts, (post) => post.comments)
  posts: Posts;

  @ManyToOne(() => Users, (user) => user.comments)
  created_by_user: Users;

  @DeleteDateColumn()
  deleted_at: Date;
}
