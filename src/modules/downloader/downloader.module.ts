import { Module } from '@nestjs/common';
import { MagnetService } from './magnet/magnet.service';
import { MagnetController } from './magnet/magnet.controller';
import { MagnetModule } from '../../libs/utils/magnet/magnet.module';
import { ParserModule } from '../../libs/core/parser/parser.module';
import { StructureModule } from '../../libs/core/structure/structure.module';

@Module({
  imports: [MagnetModule, ParserModule, StructureModule],
  providers: [MagnetService],
  controllers: [MagnetController],
})
export class DownloaderModule {}
