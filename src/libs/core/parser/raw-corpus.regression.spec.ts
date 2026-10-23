import { TitleNormalizer } from './pipeline/normalizer';
import { TitleTokenizer } from './pipeline/tokenizer';
import { BlockClassifier } from './pipeline/classifier';
import { ParsedTitleExtractor } from './pipeline/extractor';
import { FileSignalAnalyzer } from './signals/file-signals';
import { ParserService } from './parser.service';
import { RawCorpusCategory, rawCorpus } from './fixtures/raw-corpus';
import { EpisodeRef } from '../../modal/parser/parsed-title';

/**
 * 全量语料回归（337 条，来自 .corpus-raw/ 的人工分类）。
 *
 * 注意：raw 语料只有「集数形态」粒度，没有逐条的精确集数，因此这里做
 * 分类级断言（比精确集数弱，但能防止「该出集数却 null / 合集却出集数」这类回归）。
 * 精确集数断言见 corpus.regression.spec.ts（148 条 curated）。
 */
function passes(category: RawCorpusCategory, episode: EpisodeRef): boolean {
  switch (category) {
    case 'single':
      return episode?.kind === 'single';
    case 'season':
      return episode === null || episode.kind === 'range';
    case 'collection':
      return episode === null;
    case 'movie':
      return episode === null || episode.kind === 'range';
    case 'noEpisode':
      return episode === null;
    default:
      return false;
  }
}

describe('raw corpus coverage', () => {
  const service = new ParserService(
    new TitleNormalizer(),
    new TitleTokenizer(),
    new BlockClassifier(),
    new ParsedTitleExtractor(),
    new FileSignalAnalyzer(),
  );

  test.each(rawCorpus.map((e) => [e.raw, e.category] as const))(
    '%s :: %s',
    (raw: string, category: RawCorpusCategory) => {
      const episode = service.parse(raw).episode;
      if (!passes(category, episode)) {
        throw new Error(
          `[${category}] got ${JSON.stringify(episode)} :: ${raw}`,
        );
      }
    },
  );
});
