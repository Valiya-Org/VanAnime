import { TitleNormalizer } from './pipeline/normalizer';
import { TitleTokenizer } from './pipeline/tokenizer';
import { BlockClassifier } from './pipeline/classifier';
import { ParsedTitleExtractor } from './pipeline/extractor';
import { FileSignalAnalyzer } from './signals/file-signals';
import { ParserService } from './parser.service';
import { dmhyCorpus } from './fixtures/dmhy-corpus';
import { legacyCorpus } from './fixtures/legacy-corpus';

/**
 * 语料回归：两套语料全量跑新契约，断言 episode 与标注一致。
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

  const cases = [...dmhyCorpus, ...legacyCorpus];

  test.each(cases.map((c) => [c.raw, c.expect.episode] as const))(
    'episode: %s',
    (raw: string, expected: unknown) => {
      const parsed = service.parse(raw);
      expect(parsed.episode).toEqual(expected);
    },
  );
});
