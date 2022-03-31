import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import crypto = require('crypto');
import { createRandom } from 'src/utils';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userEntity: Repository<User>,
  ) {}

  async register(account: string, password: string, email: string) {
    const exist = await this.userEntity.findOne({ account });
    if (exist) return false;
    const user = new User();
    user.account = account;
    const salt = createRandom();
    user.password = this.getPassword(password, salt);
    user.email = email;
    user.salt = salt;
    return await this.userEntity.save(user);
  }

  async login(account: string, password: string) {
    const info = await this.userEntity.findOne({ account });
    if (info && this.checkPassword(password, info.salt, info.password)) {
      return info;
    }
    return false;
  }

  private checkPassword(psd: string, salt: string, realPsd: string) {
    const ret = crypto.createHash('md5').update(`${psd}${salt}`).digest('hex');
    return ret === realPsd;
  }

  private getPassword(psd: string, salt: string) {
    return crypto.createHash('md5').update(`${psd}${salt}`).digest('hex');
  }

  async getInfo(account: string) {
    const info = await this.userEntity.findOne({ account });
    if (info) {
      const { password, salt, ...others } = info;
      return others;
    }
    return false;
  }
}
