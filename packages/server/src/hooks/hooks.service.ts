import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { createRandom } from 'src/utils';
import { User } from 'src/user/user.entity';
import { Hooks } from './hooks.entity';
import { Repo } from 'src/repo/repo.entity';

@Injectable()
export class HooksService {
  constructor(
    @InjectRepository(Hooks)
    private hooksEntity: Repository<Hooks>,
    @InjectRepository(User) private userEntity: Repository<User>,
    @InjectRepository(Repo) private repoEntity: Repository<Repo>,
  ) {}

  async create(
    repoId: number,
    url: string,
    type: number,
    pattern: string,
    security?: string,
  ) {
    const repo = new Repo();
    repo.id = repoId;

    const hooks = new Hooks();
    hooks.repo = repo;
    hooks.url = url;
    hooks.type = type;
    hooks.pattern = pattern;
    hooks.security = security;
    return await this.hooksEntity.save(hooks);
  }

  async getList(repoId: number) {
    const repo = new Repo();
    repo.id = repoId;
    return await this.hooksEntity.find({
      relations: ['repo'],
      where: {
        repo,
      },
    });
  }
}
