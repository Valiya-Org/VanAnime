import { Inject, Injectable } from '@nestjs/common';
import { SourcesService } from '../../libs/sources/sources.service';
import { DMHYSearchContent } from '../../libs/modal/query/query.body';
import { QueryResponseDto } from './dto/query.response.dto';
import { HttpStatusCode } from 'axios';
import { fetchCalenderAPI } from '../../libs/utils/bangumi-api/fetchCalender';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import Fuse from 'fuse.js';
import { CalenderGetException } from '../../libs/exceptions/query/CalenderGetException';
import { Ctx } from 'src/libs/modal/ctx/Ctx';
import { LogService } from 'src/libs/core/log/log.service';

@Injectable()
export class QueryService {
  private readonly ctx: Ctx = {
    serviceContext: 'QueryService',
  };

  constructor(
    private readonly sourcesService: SourcesService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly logService: LogService,
  ) {}

  async search(
    source: string,
    searchContent: DMHYSearchContent,
  ): Promise<QueryResponseDto> {
    //TODO: 缺少source不存在的错误管理，但在前端会固定提供source的情况下一般不会出错
    const ctx: Ctx = { ...this.ctx, functionContext: 'search' };

    this.logService.log(`使用了${source}源进行搜索`, ctx);
    const searchService = this.sourcesService.getService(source);

    const res = await searchService?.search(searchContent);
    const response = new QueryResponseDto(HttpStatusCode.Ok, true, res, source);
    return response;
  }

  async bangumiCheck(searchContent: DMHYSearchContent): Promise<boolean> {
    // TODO：重定义bangumiCheck的function命名。以更符合其功能
    const ctx: Ctx = { ...this.ctx, functionContext: 'bangumiCheck' };
    const bangumiListKey = 'bangumiList';
    let cacheList = await this.cacheManager.get(bangumiListKey);

    if (!cacheList) {
      cacheList = await fetchCalenderAPI(); // TODO 这类连接外部API或者资源站点的，最好之后整合为同一个service
      //fetchCalenderAPI() 返回当季所有新番的list，并储存在cache中
      this.logService.log(
        `未发现任何新番列表信息缓存，访问源以获取最新的新番列表`,
        ctx,
      );
      cacheList = await fetchCalenderAPI();
      await this.cacheManager.set(bangumiListKey, cacheList, 600 * 60 * 1000);
    }

    if (
      Array.isArray(cacheList) &&
      cacheList.every((item) => typeof item === 'string')
    ) {
      this.logService.logWithData(`检查该番剧是否为新番`, searchContent, ctx);
      const fuseList = new Fuse(cacheList, { threshold: 0.4 });
      const checkResult = this.isCacheHitWithFuzzySearch(
        fuseList,
        searchContent,
      );

      if (checkResult) {
        this.logService.log(`此番不是新番`, ctx);
      } else {
        this.logService.warn(`Cache hit！此番是新番`, ctx);
      }

      return checkResult;
    } else {
      throw new CalenderGetException();
    }
  }

  private isCacheHitWithFuzzySearch(
    fuseList: Fuse<string>,
    searchContent: DMHYSearchContent,
  ): boolean {
    const { search, include, keywords } = searchContent;
    //这里的逻辑为 false意为发现cache存在
    if (Array.isArray(search) && search.length >= 1) {
      for (const key of search) {
        if (fuseList.search(key).length !== 0) return false;
      }
    }

    if (Array.isArray(include) && include.length >= 1) {
      for (const key of include) {
        if (fuseList.search(key).length !== 0) return false;
      }
    } else if (typeof include === 'string') {
      if (fuseList.search(include).length !== 0) return false;
    }

    if (Array.isArray(keywords) && keywords.length >= 1) {
      for (const key of keywords) {
        if (fuseList.search(key).length !== 0) return false;
      }
    }

    return true;
  }
}
