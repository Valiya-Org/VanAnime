import { TitleNormalizer } from './pipeline/normalizer';
import { TitleTokenizer } from './pipeline/tokenizer';
import { BlockClassifier } from './pipeline/classifier';
import { ParsedTitleExtractor } from './pipeline/extractor';
import { FileSignalAnalyzer } from './signals/file-signals';
import { ParserService } from './parser.service';
import { dmhyCorpus, CorpusEntry } from './fixtures/dmhy-corpus';
import { legacyCorpus } from './fixtures/legacy-corpus';

/**
 * 语料回归：两套语料全量跑新契约，断言 episode + group + season + episodeType + year。
 * 这是 REFACTOR-PLAN.md §7 的 corpus spec（旧 spec 在步骤 5 退场）。
 */
describe('FileNameParser corpus regression', () => {
  const service = new ParserService(
    new TitleNormalizer(),
    new TitleTokenizer(),
    new BlockClassifier(),
    new ParsedTitleExtractor(),
    new FileSignalAnalyzer(),
  );

  const cases: CorpusEntry[] = [...dmhyCorpus, ...legacyCorpus];

  test.each(cases.map((c) => [c.raw, c.expect] as const))(
    'corpus: %s',
    (raw: string, expected: CorpusEntry['expect']) => {
      const parsed = service.parse(raw);
      expect(parsed.episode).toEqual(expected.episode);
      if (expected.group !== undefined) {
        expect(parsed.group.map((g) => g.name)).toContain(expected.group);
      }
      if (expected.season !== undefined) {
        expect(parsed.season).toEqual(expected.season);
      }
      if (expected.episodeType !== undefined) {
        expect(parsed.episodeType).toEqual(expected.episodeType);
      }
      if (expected.year !== undefined) {
        expect(parsed.year).toEqual(expected.year);
      }
    },
  );
});
