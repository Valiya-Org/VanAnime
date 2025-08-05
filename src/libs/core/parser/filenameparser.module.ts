import { FileNameParserController } from './filenameparser.controller';
import { FileNameParserService } from './filenameparser.service';

import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [FileNameParserController],
  providers: [FileNameParserService],
})
export class FileNameParserModule {}
