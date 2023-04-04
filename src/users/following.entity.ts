import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Users } from './users.entity';

@Entity()
export class Follow {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users, (users) => users.follower)
  users: Users;

  @ManyToOne(() => Users, (users) => users.followee)
  user: Users;
}
