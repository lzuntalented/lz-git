import { Hooks } from 'src/hooks/hooks.entity';
import { Star } from 'src/star/star.entity';
import { User } from 'src/user/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity('repo')
export class Repo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', comment: '名称', default: '' })
  name: string;

  @Column({ type: 'varchar', comment: '描述', default: '' })
  describe: string;

  @Column({ type: 'varchar', comment: '主分支', default: 'master' })
  master: string;

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
  updateTime: string;

  @ManyToOne(() => User, (user) => user.repositories)
  user: User;

  @OneToMany(() => Hooks, (hooks) => hooks.repo)
  hooks: Hooks[];

  @OneToMany(() => Star, (s) => s.user)
  stars: Star[];
}
