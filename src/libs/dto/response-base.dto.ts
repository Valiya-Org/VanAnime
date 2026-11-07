import { ApiProperty } from '@nestjs/swagger';
import { HttpStatusCode } from 'axios';

/**
 * HTTP 状态码取值类型：枚举在 TS6 下已不能直接当类型用，
 * 用 `typeof` 取值的联合（100 | 101 | ... | 511）保留类型约束。
 */
export type HttpStatusCodeValue =
  (typeof HttpStatusCode)[keyof typeof HttpStatusCode];

export class ResponseBase {
  constructor(
    statusCode: HttpStatusCodeValue,
    success: boolean,
    message?: string,
  ) {
    this.statusCode = statusCode;
    this.success = success;
    this.message = message;
  }

  @ApiProperty({ description: 'Response status code' })
  readonly statusCode: HttpStatusCodeValue;

  @ApiProperty({ description: 'Response status' })
  readonly success: boolean;

  @ApiProperty({ description: 'Response message' })
  message: string | undefined;
}
