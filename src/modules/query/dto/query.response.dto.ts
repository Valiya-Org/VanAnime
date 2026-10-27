import { ResponseBase } from '../../../libs/dto/response-base.dto';
import type { HttpStatusCodeValue } from '../../../libs/dto/response-base.dto';
import { SearchResult } from '../../../libs/modal/query/query.search-result';
import { ApiProperty } from '@nestjs/swagger';

export class QueryResponseDto extends ResponseBase {
  constructor(
    statusCode: HttpStatusCodeValue,
    success: boolean,
    queryResult: SearchResult[],
    source: string,
  ) {
    super(statusCode, success);
    this.source = source;
    this.queryResult = queryResult;
  }

  @ApiProperty({ description: 'source query result' })
  readonly queryResult: SearchResult[];

  @ApiProperty({ description: 'query source' })
  readonly source: string;
}
