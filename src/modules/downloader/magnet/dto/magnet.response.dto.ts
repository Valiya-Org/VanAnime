import { ResponseBase } from '../../../../libs/dto/response-base.dto';
import { MagnetFileDetails } from '../../../../libs/modal/magnet/file';
import { ParsedTitle } from '../../../../libs/modal/parser/parsed-title';
import { JellyfinTarget } from '../../../../libs/core/structure/jellyfin-naming';
import { ApiProperty } from '@nestjs/swagger';

export type JellyfinTargetEntry = JellyfinTarget & { file: string };

export class MagnetParseResponseDto extends ResponseBase {
  constructor(
    statusCode: number,
    success: boolean,
    fileDetails: MagnetFileDetails,
    parsedTitle: ParsedTitle,
    jellyfinTargets: JellyfinTargetEntry[],
  ) {
    super(statusCode, success);
    this.fileDetails = fileDetails;
    this.parsedTitle = parsedTitle;
    this.jellyfinTargets = jellyfinTargets;
  }

  @ApiProperty({
    description: '解析后的文件结构，包含hash，文件结构，以及文件名称',
  })
  readonly fileDetails: MagnetFileDetails;

  @ApiProperty({ description: '标题解析结果（含文件结构信号）' })
  readonly parsedTitle: ParsedTitle;

  @ApiProperty({ description: 'Jellyfin 建议落盘路径（每个视频文件一条）' })
  readonly jellyfinTargets: JellyfinTargetEntry[];
}
