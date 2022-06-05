import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Repository } from 'typeorm';
import { createRandom } from 'src/utils';
import { User } from 'src/user/user.entity';
import { Star } from './star.entity';
import { Repo } from 'src/repo/repo.entity';
import { relative } from 'path';

export class RepositoriesListItem extends Star {
  starNum: number;
}

@Injectable()
export class StarService {
  constructor(
    @InjectRepository(Star)
    private starEntity: Repository<Star>,
    @InjectRepository(User) private userEntity: Repository<User>,
    @InjectRepository(Repo) private repoEntity: Repository<Repo>,
  ) {}

  async like(userId: number, repo: Repo) {
    const star = new Star();
    star.repo = repo;

    const user = new User();
    user.id = userId;
    star.user = user;

    const starInfo = await this.starEntity.findOne(star);
    if (starInfo) return;

    return await this.starEntity.save(star);
  }

  async unlike(userId: number, repo: Repo) {
    const star = new Star();
    star.repo = repo;

    const user = new User();
    user.id = userId;
    star.user = user;

    const starInfo = await this.starEntity.findOne(star);
    if (starInfo) {
      await this.starEntity.delete(starInfo);
    }
  }

  async getInfo(userId: number, repo: Repo) {
    const star = new Star();
    star.repo = repo;

    const user = new User();
    user.id = userId;
    star.user = user;

    const starInfo = await this.starEntity.findOne(star);
    return starInfo;
  }

  async getCount(repo: Repo) {
    const star = new Star();
    star.repo = repo;

    const starInfo = await this.starEntity.count(star);
    return starInfo;
  }

  async getReposCount(list: Repo[]) {
    if (list.length === 0) return [];
    const starCount = await this.starEntity
      .createQueryBuilder('star')
      .where('star.repo IN (:...repo) ', { repo: list.map((it) => it.id) })
      .groupBy('repoId')
      .select(['count(repoId) num', 'repoId'])
      .getRawMany();
    return starCount as { num: number; repoId: number }[];
  }

  async getListWithUserId(userId: number) {
    const star = new Star();
    const user = new User();
    user.id = userId;
    star.user = user;

    const [list, total] = await this.starEntity.findAndCount({
      relations: ['user', 'repo'],
      where: {
        user,
      },
    });
    const starCount = await this.getReposCount(list.map((it) => it.repo));
    // if (list.length > 0) {
    //   starCount = await this.starEntity
    //     .createQueryBuilder('star')
    //     .where('star.repo IN (:...repo) ', {
    //       repo: list.map((it) => it.repo.id),
    //     })
    //     .groupBy('repoId')
    //     .select(['count(repoId) num', 'repoId'])
    //     .getRawMany();
    // }

    const repoList = await this.repoEntity.find({
      relations: ['user'],
      where: {
        id: In(list.map((it) => it.repo.id)),
      },
    });
    return [
      list.map((it) => {
        const result = { ...it, starNum: 0 };
        const info = repoList.find((r) => r.id === it.repo.id);
        if (info) {
          result.repo = info;
        }
        const countInfo = starCount.find((r) => r.repoId === it.repo.id);
        if (countInfo) {
          result.starNum = countInfo.num;
        }
        return result;
      }),
      total,
    ] as [RepositoriesListItem[], number];
  }
}
