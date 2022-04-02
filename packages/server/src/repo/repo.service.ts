import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { createRandom } from 'src/utils';
import { Repo } from './repo.entity';
import { User } from 'src/user/user.entity';

@Injectable()
export class RepoService {
  constructor(
    @InjectRepository(Repo)
    private repoEntity: Repository<Repo>,
    @InjectRepository(User) private userEntity: Repository<User>,
  ) {}

  async create(userId: number, name: string, describe = '') {
    const repo = new Repo();
    const user = new User();
    user.id = userId;
    const info = await this.repoEntity.findOne({ name, user });
    if (info) return false;
    repo.user = user;
    repo.name = name;
    repo.describe = describe;
    return await this.repoEntity.save(repo);
  }

  async getUserRepoList(account: string) {
    const user = new User();
    user.account = account;
    return await this.userEntity.findOne({
      relations: ['repositories'],
      where: {
        account,
      },
    });
  }

  async getUserRepoDetail(name: string) {
    return await this.repoEntity.findOne({
      relations: ['user'],
      where: {
        name,
      },
    });
  }

  async search(keyword: string) {
    return await this.repoEntity.find({
      relations: ['user'],
      where: {
        name: Like(`%${keyword}%`),
      },
      order: {
        id: 'DESC',
      },
      take: 5,
    });
  }
}
