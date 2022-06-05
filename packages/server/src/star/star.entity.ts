import { Repo } from 'src/repo/repo.entity';
import { User } from 'src/user/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity('star')
export class Star {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    transformer: {
      from(v) {
        return v;
      },
      to(v) {
        return v || +new Date();
      },
    },
  })
  addTime: string;

  @ManyToOne(() => Repo, (repo) => repo.stars)
  repo: Repo;

  @ManyToOne(() => User, (user) => user.stars)
  user: User;
}
