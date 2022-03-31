import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RepoController } from './repo/repo.controller';
import { HooksController } from './hooks/hooks.controller';
import { HttpController } from './http/http.controller';
import { InstallController } from './intsall/install.controller';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { dbConfig, isProd } from './common/constants';
import { User } from './user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repo } from './repo/repo.entity';
import { RepoService } from './repo/repo.service';

const entities = [User, Repo];
@Module({
  imports: [
    TypeOrmModule.forFeature(entities),
    TypeOrmModule.forRoot({
      type: 'mysql',
      ...dbConfig,
      entities,
      synchronize: true,
      logging: true,
      // insecureAuth: true
    }),
  ],
  controllers: [
    AppController,
    RepoController,
    HooksController,
    InstallController,
    HttpController,
    UserController,
  ],
  providers: [AppService, UserService, RepoService],
})
export class AppModule {}
