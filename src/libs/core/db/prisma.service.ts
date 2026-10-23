import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { LogService } from '../log/log.service';
import { Ctx } from '../../modal/ctx/Ctx';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly ctx: Ctx = {
    serviceContext: 'PrismaService',
  };

  constructor(private readonly logService: LogService) {
    const adapter = new PrismaBetterSqlite3({
      url: 'file:./src/files/database/vananimedb.sqlite',
    });
    super({ adapter });
  }

  async onModuleInit() {
    // const ctx = { ...this.ctx, functionContext: 'SQLiteConnection' };
    // try {
    //   this.logService.log('正在建立SQLite数据库连接...', ctx);
    //   await this.$connect();
    //   this.logService.log('已成功连接SQLite数据库', ctx);
    // } catch (error) {
    //   this.logService.error('数据库连接失败', ctx);
    //   throw new Error((error as Error).message);
    // }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
