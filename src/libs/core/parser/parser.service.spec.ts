import { TitleNormalizer } from './pipeline/normalizer';
import { TitleTokenizer } from './pipeline/tokenizer';
import { BlockClassifier } from './pipeline/classifier';
import { ParsedTitleExtractor } from './pipeline/extractor';
import { FileSignalAnalyzer } from './signals/file-signals';
import { ParserService } from './parser.service';
import { MagnetFile } from '../../modal/magnet/file';

describe('ParserService', () => {
  let service: ParserService;

  beforeEach(() => {
    service = new ParserService(
      new TitleNormalizer(),
      new TitleTokenizer(),
      new BlockClassifier(),
      new ParsedTitleExtractor(),
      new FileSignalAnalyzer(),
    );
  });

  it('analyze 返回归一化标题与有序块列表', () => {
    const analysis = service.analyze(
      '[LoliHouse] 兽王武神 - 03 [WebRip 1080p]',
    );
    expect(analysis.normalized.normalized).toBe(
      '[LoliHouse] 兽王武神 - 03 [WebRip 1080p]',
    );
    const contents = analysis.blocks.map((b) => b.content);
    expect(contents).toContain('LoliHouse');
    expect(contents).toContain('WebRip 1080p');
    expect(contents.filter((c) => c.trim() === '03')).toHaveLength(1);
  });

  it('全角标题也能正确切块', () => {
    const analysis = service.analyze('【合集】結城友奈は勇者である 01-30');
    expect(analysis.normalized.normalized.startsWith('[合集]')).toBe(true);
    expect(
      analysis.blocks.some((b) => b.kind === 'bracket' && b.content === '合集'),
    ).toBe(true);
  });

  it('parse 解析单集：group 与 episode', () => {
    const parsed = service.parse(
      '[LoliHouse] 兽王武神丹帝拜恩 / Juuou Mujin Dandivine - 03 [WebRip 1080p HEVC-10bit AAC][简繁内封字幕]',
    );
    expect(parsed.group).toHaveLength(1);
    expect(parsed.group[0].name).toBe('LoliHouse');
    expect(parsed.episode).toEqual({ kind: 'single', no: 3 });
    expect(parsed.release.resolution).toBe('1080p');
    expect(parsed.release.videoCodec).toBe('HEVC');
  });

  it('parse 解析范围合集', () => {
    const parsed = service.parse(
      '[LoliHouse] 正后方的神威 / 從後面來的神威先生 / うしろの正面カムイさん / Ushiro no Shoumen Kamui-san [01-12 合集][WebRip 1080p HEVC-10bit AAC][简繁内封字幕][Fin]',
    );
    expect(parsed.group[0].name).toBe('LoliHouse');
    expect(parsed.episode).toEqual({ kind: 'range', from: 1, to: 12 });
  });

  it('中文数字集数支持任意位（第X話）', () => {
    expect(service.parse('某番 [第二十一話] [1080P]').episode).toEqual({
      kind: 'single',
      no: 21,
    });
    expect(service.parse('某番 [第一百零五話] [1080P]').episode).toEqual({
      kind: 'single',
      no: 105,
    });
  });

  it('1920x1080 不会误判成年份', () => {
    const parsed = service.parse('某番 [1920x1080] [BDRip]');
    expect(parsed.year).toBeNull();
  });

  it('纯假名标题不会被误判成组名', () => {
    const parsed = service.parse('某番 [ガンダム] [1080p]');
    expect(parsed.group).toHaveLength(0);
  });

  it('裸分辨率块（相邻 specs）不被当作集数', () => {
    const parsed = service.parse('某番 [1080] [MKV] [BDRip]');
    expect(parsed.episode).toBeNull();
  });

  describe('parse(title, files?)', () => {
    const videoFiles = (n: number, prefix = 'Title - '): MagnetFile[] =>
      Array.from({ length: n }, (_, i) => ({
        name: `${prefix}${String(i + 1).padStart(2, '0')}.mkv`,
        length: 1000,
      }));

    it('标题无集数 + 12 个视频文件 → 从文件名补全集数范围', () => {
      const parsed = service.parse(
        '[H-Enc] 尖帽子的魔法工房 / Tongari Boushi no Atelier (BDRip 1080p HEVC FLAC)',
        videoFiles(12),
      );
      expect(parsed.episode).toEqual({ kind: 'range', from: 1, to: 12 });
      expect(parsed.source).toBe('regex+files');
    });

    it('混合内容（视频+音频+图片）→ 合集，不输出集数', () => {
      const parsed = service.parse('[整理搬运] 某番 [01-03]', [
        ...videoFiles(3),
        { name: 'cover.jpg', length: 1 },
        { name: 'ost.flac', length: 1 },
      ]);
      expect(parsed.episode).toBeNull();
    });

    it('标题范围与文件集数一致时提升置信', () => {
      const parsed = service.parse(
        '[LoliHouse] 正后方的神威 / Ushiro no Shoumen Kamui-san [01-12 合集][WebRip 1080p]',
        videoFiles(12),
      );
      expect(parsed.episode).toEqual({ kind: 'range', from: 1, to: 12 });
      expect(parsed.confidence).toBeGreaterThan(0.5);
    });

    it('无 files 时保持纯标题解析', () => {
      const parsed = service.parse('[LoliHouse] 兽王武神 - 03 [WebRip 1080p]');
      expect(parsed.source).toBe('regex');
    });
  });
});
