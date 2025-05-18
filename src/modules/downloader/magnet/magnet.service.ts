import { Injectable } from '@nestjs/common';
import { QbittorrentService } from '../../../libs/utils/qbittorrent/qbittorrent.service';
import { TorrentTransformerService } from '../../../libs/utils/magnet/torrent-transformer/torrent-transformer.service';
import { MagnetFile, MagnetFileDetails } from '../../../libs/modal/magnet/file';
import { MagnetParseResponseDto } from './dto/magnet.response.dto';
import { HttpStatusCode } from 'axios';
import { ResponseBase } from '../../../libs/dto/response-base.dto';
import { MagnetSubmitDto } from './dto/magnet.submit.dto';
import { StoreService } from '../../../libs/core/store/store.service';
import { PrismaService } from '../../../libs/core/db/prisma.service';
import { LogService } from '../../../libs/core/log/log.service';
import { Ctx } from '../../../libs/modal/ctx/Ctx';
import {
  DBCreateNewTaskFailedException,
  DBTorrenNotFoundException,
} from '../../../libs/exceptions/magnet/DBExceptions.tx';

interface ParseResult {
  filesList: MagnetFile[];
  torrentName: string;
  infoHash: string;
  torrentSavePath: string;
}

@Injectable()
export class MagnetService {
  private readonly ctx: Ctx = {
    serviceContext: 'MagnetService',
  };

  constructor(
    private readonly qbService: QbittorrentService,
    private readonly torrentTransformService: TorrentTransformerService,
    private readonly storeService: StoreService,
    private readonly prisma: PrismaService,
    private readonly logService: LogService,
  ) {}

  async parseMagnet(magnet: string) {
    const ctx = { ...this.ctx, functionContext: 'ParseUserSubmitMagnet' };
    const results = (await this.torrentTransformService.parseMagnet(
      magnet,
    )) as ParseResult;

    await this.prisma.torrent.create({
      data: {
        ...results,
        magnet,
      },
    });

    this.logService.log(`种子文件${results.infoHash},已保存完成。`, ctx);

    const response = new MagnetParseResponseDto(HttpStatusCode.Ok, true, {
      filesList: results.filesList,
      torrentName: results.torrentName,
      infoHash: results.infoHash,
    } as MagnetFileDetails);
    return response;
  }

  async submitNewTask(data: MagnetSubmitDto) {
    if (this.storeService.findTask(data.details.infoHash)) {
      const response = new ResponseBase(
        HttpStatusCode.Ok,
        false,
        '本任务已经存在于任务列表中',
      );
      return response;
    }

    const result = await this.qbService.submitNewTask(data.details);

    if (result) {
      await this.createNewTasktoDB(data);
    }

    const response = new ResponseBase(
      result ? HttpStatusCode.Ok : HttpStatusCode.BadRequest,
      result,
    );
    return response;
  }

  private async createNewTasktoDB(data: MagnetSubmitDto) {
    const ctx = { ...this.ctx, functionContext: 'CreateNewTask' };
    const torrent = await this.prisma.torrent.findUnique({
      where: { infoHash: data.details.infoHash },
    });

    if (!torrent) {
      this.logService.error(
        `数据库查找${data.details.infoHash}种子文件失败`,
        ctx,
      );
      throw new DBTorrenNotFoundException(
        `infohash为：${data.details.infoHash}的种子文件在数据库中不存在`,
      );
    }

    try {
      await this.prisma.task.create({
        data: {
          version: 'v1',
          updateAt: new Date(),
          selectedContents: data.details.filesList,
          customEpisodes: data.customEpisodes,
          torrentId: torrent.id,
        },
      });

      this.logService.log(
        `种子文件${data.details.infoHash}的下载任务已经建立。`,
      );
    } catch (error) {
      this.logService.error(
        '数据库记录任务失败',
        ctx,
        (error as Error).message,
      );
      throw new DBCreateNewTaskFailedException(`数据库记录新任务失败`);
    }
  }
}
