import { Users } from 'src/users/users.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Comments } from './comments.entity';
import { Likes } from './likes.entity';

@Entity()
export class Posts {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column('json', { default: [] })
  images: Array<string>;

  @Column('json', { default: [] })
  hashtags: Array<string>;

  @Column({ default: 0 })
  likeCount: number;

  @ManyToOne(() => Users, (user) => user.posts)
  created_by_user: Users;

  @OneToMany(() => Likes, (like) => like.posts)
  likes: Likes[];

  @OneToMany(() => Comments, (comment) => comment.posts)
  comments: Comments[];

  @DeleteDateColumn()
  deleted_at: Date;
}
