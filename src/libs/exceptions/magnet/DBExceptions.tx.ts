import { BaseException } from '../BaseException';
import { HttpStatusCode } from 'axios';

export class DBTorrenNotFoundException extends BaseException {
  constructor(message: string) {
    super(message, HttpStatusCode.InternalServerError, 5000);
  }
}

export class DBCreateNewTaskFailedException extends BaseException {
  constructor(message: string) {
    super(message, HttpStatusCode.InternalServerError, 5000);
  }
}
