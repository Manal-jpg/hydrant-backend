import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class HelpRequest {
  @PrimaryGeneratedColumn()
  request_id: number;

  @ManyToOne(() => User, (user) => user.user_id, { onDelete: 'CASCADE' })
  user: User;

  @Column('decimal', { precision: 10, scale: 7 })
  latitude: number;

  @Column('decimal', { precision: 10, scale: 7 })
  longitude: number;

  @CreateDateColumn()
  created_at: Date;

  @Column()
  video_url: string;

  @Column({ type: 'int', nullable: false })
  rank: number;

  @Column()
  name: string;

  @Column()
  description: string;
}
