import { TitleNormalizer } from './normalizer';
import { TitleTokenizer } from './tokenizer';

describe('TitleTokenizer', () => {
  let normalizer: TitleNormalizer;
  let tokenizer: TitleTokenizer;
  let tok: (s: string) => ReturnType<TitleTokenizer['tokenize']>;

  beforeEach(() => {
    normalizer = new TitleNormalizer();
    tokenizer = new TitleTokenizer();
    tok = (s: string) => tokenizer.tokenize(normalizer.normalize(s));
  });

  it('切分顺序括号块与裸文本', () => {
    const blocks = tok('[A] B [C]');
    expect(blocks.map((b) => [b.kind, b.content])).toEqual([
      ['bracket', 'A'],
      ['bare', ' B '],
      ['bracket', 'C'],
    ]);
  });

  it('裸文本按 ` - ` 软切分', () => {
    const blocks = tok('兽王武神 - 03 [WebRip 1080p]');
    expect(blocks.map((b) => b.content)).toEqual([
      '兽王武神',
      ' - ',
      '03 ',
      'WebRip 1080p',
    ]);
    expect(blocks.map((b) => b.kind)).toEqual([
      'bare',
      'bare',
      'bare',
      'bracket',
    ]);
  });

  it('【】归一后按 [] 处理', () => {
    const blocks = tok('【合集】結城友奈 01-30');
    expect(blocks[0]).toMatchObject({ kind: 'bracket', content: '合集' });
    expect(blocks[1].kind).toBe('bare');
  });

  it('括号块保留 index/length', () => {
    const blocks = tok('[01-12+OVA1-2]');
    expect(blocks).toHaveLength(1);
    expect(blocks[0]).toMatchObject({
      kind: 'bracket',
      content: '01-12+OVA1-2',
      index: 0,
      length: 14,
    });
  });

  it('连续括号块不合并', () => {
    const blocks = tok('[AHU-SUB][生而为狗][01-12+OVA1-2][MKV]');
    expect(blocks.map((b) => b.content)).toEqual([
      'AHU-SUB',
      '生而为狗',
      '01-12+OVA1-2',
      'MKV',
    ]);
  });

  it('圆括号块同样识别', () => {
    const blocks = tok('(检索用:Q娃)');
    expect(blocks).toHaveLength(1);
    expect(blocks[0]).toMatchObject({ kind: 'bracket', content: '检索用:Q娃' });
  });
});
