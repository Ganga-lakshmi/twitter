import { Comments } from 'src/posts/entities/comments.entity';
import { Likes } from 'src/posts/entities/likes.entity';
import { Posts } from 'src/posts/entities/posts.entity';

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Follow } from './following.entity';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP(0)',
  })
  public created_at: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP(0)',
    onUpdate: 'CURRENT_TIMESTAMP(0)',
  })
  @DeleteDateColumn()
  deleted_at: Date;

  @OneToMany(() => Follow, (follower) => follower.follower)
  followed_by: Follow[];

  @OneToMany(() => Follow, (followee) => followee.followee)
  followees: Follow[];

  @OneToMany(() => Posts, (post) => post.created_by_user)
  posts: Posts[];

  @OneToMany(() => Likes, (likes) => likes.created_by_user)
  likes: Likes[];

  @OneToMany(() => Comments, (comment) => comment.created_by_user)
  comments: Comments[];

  // @ManyToOne(() => Follow, (fol) => fol.followee)
  // user: Follow;
}
