import { Module } from '@nestjs/common';
import { TitleNormalizer } from './pipeline/normalizer';
import { TitleTokenizer } from './pipeline/tokenizer';
import { BlockClassifier } from './pipeline/classifier';
import { ParsedTitleExtractor } from './pipeline/extractor';
import { FileSignalAnalyzer } from './signals/file-signals';
import { ParserService } from './parser.service';

/**
 * 文件名解析域。
 *
 * 只负责「标题 + 文件结构 → ParsedTitle」；媒体库命名/落盘属于 structure 域，
 * 依赖方向固定为 library → parser。
 */
@Module({
  imports: [],
  controllers: [],
  providers: [
    TitleNormalizer,
    TitleTokenizer,
    BlockClassifier,
    ParsedTitleExtractor,
    FileSignalAnalyzer,
    ParserService,
  ],
  exports: [
    TitleNormalizer,
    TitleTokenizer,
    BlockClassifier,
    ParsedTitleExtractor,
    FileSignalAnalyzer,
    ParserService,
  ],
})
export class ParserModule {}
