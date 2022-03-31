import { Repo } from 'src/repo/repo.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', comment: '帐号' })
  account: string;

  @Column({ type: 'varchar', comment: '昵称', default: '' })
  name: string;

  @Column({ type: 'varchar', comment: '头像', default: '' })
  avatar: string;

  @Column({ type: 'char', length: 32, comment: '密码' })
  password: string;

  @Column({ type: 'char', length: 32, comment: '密码随机数' })
  salt: string;

  @Column({ type: 'varchar', comment: '邮箱' })
  email: string;

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

  @OneToMany((type) => Repo, (repo) => repo.user)
  repositories: Repo[];
}
