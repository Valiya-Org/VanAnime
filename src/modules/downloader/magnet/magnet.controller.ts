import { Body, Controller, Post, Res } from '@nestjs/common';
import { MagnetService } from './magnet.service';
import { AddParamDTO } from './dto/magnet.add.dto';
import { Response } from 'express';
import { MagnetSubmitDto } from './dto/magnet.submit.dto';
import { LogService } from 'src/libs/core/log/log.service';
import { Ctx } from 'src/libs/modal/ctx/Ctx';

@Controller('magnet')
export class MagnetController {
  private readonly ctx: Ctx = {
    serviceContext: 'MagnetController',
  };

  constructor(
    private readonly magnetService: MagnetService,
    private readonly logService: LogService,
  ) {}

  @Post('parse')
  async parseMagnet(
    @Body() data: AddParamDTO,
    @Res() res: Response,
  ): Promise<void> {
    const ctx: Ctx = { ...this.ctx, functionContext: 'parseMagnet' };
    this.logService.logForRequest('/magnet/parse', data, ctx);
    const response = await this.magnetService.parseMagnet(data.magnet);
    res.status(200).json(response);
    this.logService.logForResponse(response, ctx);
  }

  @Post('submit')
  async submitNewTask(
    @Body() data: MagnetSubmitDto,
    @Res() res: Response,
  ): Promise<void> {
    const ctx: Ctx = { ...this.ctx, functionContext: 'submitNewTask' };
    this.logService.logForRequest('/magnet/submit', data, ctx);
    const response = await this.magnetService.submitNewTask(data);
    res.status(response.statusCode).json(response);
    this.logService.logForResponse(response, ctx);
  }
}
