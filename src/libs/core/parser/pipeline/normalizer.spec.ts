import { TitleNormalizer } from './normalizer';

describe('TitleNormalizer', () => {
  let normalizer: TitleNormalizer;

  beforeEach(() => {
    normalizer = new TitleNormalizer();
  });

  it('全角数字与括号归一（【】→[]、（）：→()）', () => {
    const result = normalizer.normalize('【合集】[０３]（检索用：校园）');
    expect(result.normalized).toBe('[合集][03](检索用:校园)');
  });

  it('剥离尾部扩展名', () => {
    const result = normalizer.normalize('[LoliHouse] 某番 - 03.mkv');
    expect(result.normalized).toBe('[LoliHouse] 某番 - 03');
  });

  it('去尾部换行并压缩连续空白', () => {
    const result = normalizer.normalize('  某番  -  03  \n');
    expect(result.normalized).toBe('某番 - 03');
  });

  it('全角符号归一（～／：）', () => {
    const result = normalizer.normalize('０１～１２ ／ １０８０p：测试');
    expect(result.normalized).toBe('01~12 / 1080p:测试');
  });

  it('保留中日文字符', () => {
    const result = normalizer.normalize('四月は君の嘘 / 四月是你的谎言');
    expect(result.normalized).toBe('四月は君の嘘 / 四月是你的谎言');
  });

  it('raw 保留原始标题', () => {
    const raw = '【合集】[０３]（检索用：校园）';
    const result = normalizer.normalize(raw);
    expect(result.raw).toBe(raw);
  });
});
