import { Injectable } from '@nestjs/common';
import { QbittorrentService } from '../../../libs/utils/qbittorrent/qbittorrent.service';
import { TorrentTransformerService } from '../../../libs/utils/magnet/torrent-transformer/torrent-transformer.service';
import { MagnetFile, MagnetFileDetails } from '../../../libs/modal/magnet/file';
import { MagnetParseResponseDto } from './dto/magnet.response.dto';
import { HttpStatusCode } from 'axios';
import { ResponseBase } from '../../../libs/dto/response-base.dto';
import { MagnetSubmitDto } from './dto/magnet.submit.dto';
import { StoreService } from '../../../libs/core/store/store.service';
import { LogService } from 'src/libs/core/log/log.service';
import { Ctx } from 'src/libs/modal/ctx/Ctx';
import { PrismaService } from '../../../libs/core/db/prisma.service';
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
    private readonly logService: LogService,
    private readonly prisma: PrismaService,
  ) {}

  async parseMagnet(magnet: string) {
    const ctx = { ...this.ctx, functionContext: 'parseMagnet' };
    const results = (await this.torrentTransformService.parseMagnet(
      magnet,
    )) as ParseResult;

    this.logService.logWithData(
      `磁力链接/Magnet解析完成，结果为:`,
      results,
      ctx,
    );

    await this.createNewTorrenttoDB(results, magnet);

    const response = new MagnetParseResponseDto(HttpStatusCode.Ok, true, {
      filesList: results.filesList,
      torrentName: results.torrentName,
      infoHash: results.infoHash,
    } as MagnetFileDetails);
    return response;
  }

  async submitNewTask(data: MagnetSubmitDto) {
    const ctx: Ctx = { ...this.ctx, functionContext: 'submitNewTask' };
    if (this.storeService.findTask(data.details.infoHash)) {
      this.logService.warn(
        `在数据库中发现相同的infoHash：${data.details.infoHash}`,
        ctx,
      );
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

  private async createNewTorrenttoDB(results: ParseResult, magnet: string) {
    const ctx = { ...this.ctx, functionContext: 'DBCreateNewTorrent' };
    this.logService.logWithData(
      `等待数据库建立新Torrent对象，infoHash：`,
      results.infoHash,
      ctx,
    );
    // Todo, 需要处理数据库键已存在，返回报错的情况
    await this.prisma.torrent.create({
      data: {
        ...results,
        magnet,
      },
    });
    this.logService.log(`种子文件： ${results.infoHash} 已保存到数据库。`, ctx);
  }

  private async createNewTasktoDB(data: MagnetSubmitDto) {
    const ctx = { ...this.ctx, functionContext: 'DBCreateNewTask' };
    const torrent = await this.prisma.torrent.findUnique({
      where: { infoHash: data.details.infoHash },
    });

    if (!torrent) {
      this.logService.error(
        `数据库查找：${data.details.infoHash} 种子文件失败`,
        ctx,
      );
      throw new DBTorrenNotFoundException(
        `infohash为：${data.details.infoHash}的种子文件在数据库中不存在`,
      );
    }

    try {
      this.logService.logWithData(
        `等待数据库建立新Task对象，infoHash：`,
        data.details.infoHash,
        ctx,
      );
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
        `种子文件： ${data.details.infoHash} 的下载任务已保存到数据库`,
        ctx,
      );
    } catch (error) {
      this.logService.error(
        `数据库记录任务失败, infoHash：${data.details.infoHash}`,
        ctx,
        (error as Error).message,
      );
      throw new DBCreateNewTaskFailedException(`数据库记录新任务失败`);
    }
  }
}
