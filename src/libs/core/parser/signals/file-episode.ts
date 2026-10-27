import { TitleNormalizer } from '../pipeline/normalizer';
import { TitleTokenizer } from '../pipeline/tokenizer';
import { BlockClassifier } from '../pipeline/classifier';
import { ParsedTitleExtractor } from '../pipeline/extractor';

const normalizer = new TitleNormalizer();
const tokenizer = new TitleTokenizer();
const classifier = new BlockClassifier();
const extractor = new ParsedTitleExtractor();

/**
 * 从单个视频文件名提取集号。
 *
 * 复用主流水线（Normalizer → Tokenizer → Classifier → Extractor），而不是
 * 单独维护一套简化的正则阶梯——否则年份（2022）、标题里的数字（Mob Psycho 100、
 * Kaguya-sama 2）会被误判成集号。主流水线已有年份块 / specs 块识别。
 */
export function episodeOfFileName(name: string): number | null {
  const base = (name.split(/[\\/]/).pop() ?? name).replace(/\.[a-z0-9]+$/i, '');
  const normalized = normalizer.normalize(base);
  const blocks = tokenizer.tokenize(normalized);
  const classified = classifier.classify(blocks);
  const parsed = extractor.extract(normalized.raw, classified);

  const ep = parsed.episode;
  if (ep?.kind === 'single') return ep.no;
  if (ep?.kind === 'range') return ep.from;
  if (ep?.kind === 'dual') return ep.nos[0] ?? null;
  return null;
}
