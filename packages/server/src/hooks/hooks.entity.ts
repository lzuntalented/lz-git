import { Repo } from 'src/repo/repo.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity('hooks')
export class Hooks {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', comment: '推送地址', default: '' })
  url: string;

  @Column({ type: 'varchar', comment: '推送格式', default: '' })
  pattern: string;

  @Column({ type: 'varchar', comment: '密钥文本', default: '' })
  security: string;

  @Column({
    type: 'int',
    comment: '推送事件类型 1：push事件 2：所有时间',
    default: 1,
  })
  type: number;

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

  @ManyToOne(() => Repo, (repo) => repo.hooks)
  repo: Repo;
}
