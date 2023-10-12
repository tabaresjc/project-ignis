import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default {
  port: process.env.PORT || 3000,
  database: {
    type: process.env.DATABASE_TYPE || 'mysql',
    host: process.env.DATABASE_HOST || 'localhost',
    port: process.env.DATABASE_PORT || '3306',
    password: process.env.DATABASE_PASSWORD || 'secret',
    username: process.env.DATABASE_USERNAME || 'user',
    database: process.env.DATABASE_NAME || 'test',
    synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
    logging: process.env.DATABASE_LOGGING === 'true',
  } as TypeOrmModuleOptions,
  dataPath: process.env.DATA_PATH || '/tmp/data'
};
