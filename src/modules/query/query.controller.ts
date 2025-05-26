import { Body, Controller, Post, Res } from '@nestjs/common';
import { QueryService } from './query.service';
import { Response } from 'express';
import { SearchParamDTO } from './dto/query.search.dto';
import { QueryBangumiCheckDto } from './dto/query.bangumi-check.dto';
import { HttpStatusCode } from 'axios';
import { Ctx } from 'src/libs/modal/ctx/Ctx';
import { LogService } from 'src/libs/core/log/log.service';

@Controller('query')
export class QueryController {
  private readonly ctx: Ctx = {
    serviceContext: 'QueryController',
  };
  constructor(
    private readonly queryService: QueryService,
    private readonly logService: LogService,
  ) {}

  @Post()
  async queryFromSource(
    @Body() data: SearchParamDTO,
    @Res() res: Response,
  ): Promise<void> {
    const ctx: Ctx = { ...this.ctx, functionContext: 'queryFromSource' };
    // TODO：非正确返回时候的code管理
    this.logService.logForRequest('/query', data, ctx);
    const { source, searchContent } = data;
    if (!(await this.queryService.bangumiCheck(searchContent))) {
      const results = new QueryBangumiCheckDto(
        HttpStatusCode.Ok,
        false,
        '搜索目标为本季新番，不支持该搜索。',
      );
      res.status(200).json(results);
      this.logService.logForResponse(results, ctx);
      return;
    }
    const results = await this.queryService.search(source, searchContent);
    this.logService.logForResponse(results, ctx);
    res.status(200).json(results);
  }
}
