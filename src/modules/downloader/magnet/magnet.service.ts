import { Injectable } from '@nestjs/common';
import { QbittorrentService } from '../../../libs/utils/qbittorrent/qbittorrent.service';
import { TorrentTransformerService } from '../../../libs/utils/magnet/torrent-transformer/torrent-transformer.service';
import { MagnetFileDetails } from '../../../libs/modal/magnet/file';
import { MagnetParseResponseDto } from './dto/magnet.response.dto';
import { HttpStatusCode } from 'axios';
import { ResponseBase } from '../../../libs/dto/response-base.dto';
import { MagnetSubmitDto } from './dto/magnet.submit.dto';
import { StoreService } from '../../../libs/core/store/store.service';
import { LogService } from 'src/libs/core/log/log.service';
import { Ctx } from 'src/libs/modal/ctx/Ctx';

@Injectable()
export class MagnetService {
  private readonly ctx: Ctx = {
    serviceContext: 'MagnetService',
  };

  constructor(
    private readonly qbService: QbittorrentService,
    private readonly torrentTransformService: TorrentTransformerService,
    private readonly storeService: StoreService,
    private readonly logService: LogService,
  ) {}

  async parseMagnet(magnet: string) {
    const ctx: Ctx = { ...this.ctx, functionContext: 'parseMagnet' };
    const results = await this.torrentTransformService.parseMagnet(magnet);
    this.logService.logWithJSONData(`解析完成，结果为:`, results, ctx);
    const response = new MagnetParseResponseDto(
      HttpStatusCode.Ok,
      true,
      results as MagnetFileDetails,
    );
    return response;
  }

  async submitNewTask(data: MagnetSubmitDto) {
    const ctx: Ctx = { ...this.ctx, functionContext: 'submitNewTask' };
    const infoHash = data.details.infoHash;
    if (this.storeService.findTask(infoHash)) {
      this.logService.warn(`在数据库中发现相同的infoHash：${infoHash}`, ctx);
      const response = new ResponseBase(
        HttpStatusCode.Ok,
        false,
        '本任务已经存在于任务列表中',
      );
      return response;
    }

    const result = await this.qbService.submitNewTask(data.details);

    if (result) {
      this.logService.logWithJSONData(
        `Task提交成功，添加该记录，infoHash为：`,
        infoHash,
        ctx,
      );
      this.storeService.addNewRecord(
        data.details.torrentName,
        data.originMagnet,
        data.details.infoHash,
        data.source,
        data.details.filesList,
      );
    }

    const response = new ResponseBase(
      result ? HttpStatusCode.Ok : HttpStatusCode.BadRequest,
      result,
    );
    return response;
  }
}
