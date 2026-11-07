import { ResponseBase } from '../../../libs/dto/response-base.dto';
import type { HttpStatusCodeValue } from '../../../libs/dto/response-base.dto';
import { ApiProperty } from '@nestjs/swagger';

export class QueryBangumiCheckDto extends ResponseBase {
  constructor(
    statusCode: HttpStatusCodeValue,
    success: boolean,
    message: string,
  ) {
    super(statusCode, success);
    this.message = message;
  }

  @ApiProperty({ description: '警告搜索目标为本季新番' })
  readonly message: string;
}
