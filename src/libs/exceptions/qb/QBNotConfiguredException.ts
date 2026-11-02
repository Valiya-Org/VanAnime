import { BaseException } from '../BaseException';
import { HttpStatusCode } from 'axios';

export class QBNotConfiguredException extends BaseException {
  constructor(message: string) {
    super(message, HttpStatusCode.ServiceUnavailable, 5001);
  }
}
