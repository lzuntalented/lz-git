import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import {
  dbConfig,
  initTmpDir,
  isDev,
  REPO_ROOT_PATH,
} from './common/constants';
import { TransformInterceptor } from './interceptor/transform.interceptor';
import { logger } from './middleware/logger.middleware';
import session = require('express-session');
import { header } from './middleware/header.middleware';
import FileStore = require('session-file-store');
// import mysqlSession = require('express-mysql-session');

// const MySQLStore = mysqlSession(session)

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  isDev &&
    app.enableCors({
      origin: 'http://localhost:3001',
      credentials: true,
    });
  app.useGlobalInterceptors(new TransformInterceptor());
  app.use(logger);
  app.use(header);

  // const sessionStore = new MySQLStore({
  //   ...dbConfig
  // });

  app.use(
    session({
      key: 'keep_alive_secret',
      secret: 'lz_secret_git',
      maxAge: 3600000,
      // store: sessionStore,
      resave: false,
      saveUninitialized: false,
      store: new (FileStore(session))({}),
    }),
  );

  const options = new DocumentBuilder()
    .setTitle('接口文档')
    .setDescription('接口地址描述')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);
  await app.listen(isDev ? 3000 : 10010);
}

initTmpDir();
bootstrap();
