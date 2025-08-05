import { VanAnimeMetaData } from 'src/libs/modal/parser/VanAnimeMetaData';
import { FileNameParserService } from './filenameparser.service';
import { Controller, Get } from '@nestjs/common';

@Controller('filename-parser')
export class FileNameParserController {
  constructor(private readonly FileNameParserService: FileNameParserService) {}

  @Get()
  test(): any {
    return this.FileNameParserService.parseFilename(
      '[DBD-Raws][影宅 第二季/Shadows House S2][01-12TV全集+特典映像][1080P][BDRip][HEVC-10bit][简繁外挂][FLAC][MKV](シャドーハウス S2)',
    );
    // const test = {
    //   name: null,
    //   originalName:
    //     '[KTXP][I Have a Crush at Work][01-12][BIG5][AVC][720P]/[KTXP][I Have a Crush at Work][05][BIG5][AVC][720P].mp4',
    //   isTV: true,
    //   group: [],
    // } as VanAnimeMetaData;

    // test.episodeIndex = this.FileNameParserService.findEpisodeIndex(
    //   '[KTXP][I Have a Crush at Work][01-12][BIG5][AVC][720P]/[KTXP][I Have a Crush at Work][05][BIG5][AVC][720P].mp4',
    // );

    // this.FileNameParserService.parseFirstBlockToGroup(
    //   '[KTXP][I Have a Crush at Work][01-12][BIG5][AVC][720P]/[KTXP][I Have a Crush at Work][05][BIG5][AVC][720P].mp4',
    //   test,
    // );
    // this.FileNameParserService.parseTitle(
    //   '[KTXP][I Have a Crush at Work][01-12][BIG5][AVC][720P]/[KTXP][I Have a Crush at Work][05][BIG5][AVC][720P].mp4',
    //   test,
    // );
    // return test;
  }
}
