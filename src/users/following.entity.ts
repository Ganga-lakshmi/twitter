import {
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './users.entity';

@Entity()
export class Follow {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users, (users) => users.followed_by)
  follower: Users;

  @ManyToOne(() => Users, (users) => users.followees)
  followee: Users;

  // @OneToMany(() => Users, (users) => users.user)
  // follow: Users[];

  @DeleteDateColumn()
  deleted_at: Date;
}
