import { PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, Entity } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Phrase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', name: 'user_id' })
  userID: number;

  @Column({ type: 'varchar', name: 'format', length: 15, nullable: true })
  format: string;

  @Column({ type: 'varchar', name: 'file_path', length: 1024, nullable: true })
  filePath: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
