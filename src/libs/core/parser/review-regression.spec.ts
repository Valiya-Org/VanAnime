import { TitleNormalizer } from './pipeline/normalizer';
import { TitleTokenizer } from './pipeline/tokenizer';
import { BlockClassifier } from './pipeline/classifier';
import { ParsedTitleExtractor } from './pipeline/extractor';
import { FileSignalAnalyzer } from './signals/file-signals';
import { ParserService } from './parser.service';
import { JellyfinNamer } from '../structure/jellyfin-naming';
import { episodeOfFileName } from './signals/file-episode';
import { MagnetFile } from '../../modal/magnet/file';

const service = new ParserService(
  new TitleNormalizer(),
  new TitleTokenizer(),
  new BlockClassifier(),
  new ParsedTitleExtractor(),
  new FileSignalAnalyzer(),
);
const namer = new JellyfinNamer();
const f = (name: string): MagnetFile => ({ name, length: 1 });

describe('review regression (title + files → ParsedTitle + Jellyfin path)', () => {
  it('文件名里的年份/标题数字不会被当成集号', () => {
    expect(
      episodeOfFileName('[ANi] SPY×FAMILY (2022) - 03 [1080P][Baha].mp4'),
    ).toBe(3);
    expect(episodeOfFileName('[Group] Mob Psycho 100 - 03 [1080p].mkv')).toBe(
      3,
    );
    expect(episodeOfFileName('[Group] Kaguya-sama 2 - 03 [1080p].mkv')).toBe(3);
  });

  it('BD 整季包带 Scans/CDs 仍保留标题集数', () => {
    const bd = service.parse(
      '[北宇治字幕组] 孤独摇滚！/ Bocchi the Rock! [01-12Fin][BDRip 1080p]',
      [
        f('[01].mkv'),
        f('[02].mkv'),
        f('[NCOP].mkv'),
        f('Scans/cover.jpg'),
        f('CDs/OST.flac'),
      ],
    );
    expect(bd.episode).toEqual({ kind: 'range', from: 1, to: 12 });
  });

  it('剧场版不输出集数，特典/菜单进 extras/', () => {
    const mv = service.parse('进击的巨人 剧场版', [
      f('SnK Movie [Ma10p_1080p].mkv'),
      f('SnK Movie [NCED][Ma10p_1080p].mkv'),
      f('SnK Movie [Menu][Ma10p_1080p].mkv'),
    ]);
    expect(mv.episodeType).toBe('Movie');
    expect(mv.episode).toBeNull();

    const main = namer.buildPath(
      mv,
      f('SnK Movie [Ma10p_1080p].mkv'),
    ).relativePath;
    const nced = namer.buildPath(
      mv,
      f('SnK Movie [NCED][Ma10p_1080p].mkv'),
    ).relativePath;
    expect(main).not.toBe(nced);
    expect(nced).toContain('extras');
  });

  it('季数从标题剥离，语言按文字类型分配', () => {
    const d = service.parse('间谍过家家 第二季 / Spy x Family Season 2');
    expect(d.season).toBe(2);
    expect(d.title.zh).toBe('间谍过家家');
    expect(d.title.romaji).toBe('Spy x Family');

    const e = service.parse('Sousou no Frieren S2');
    expect(e.season).toBe(2);
    expect(e.title.romaji).toBe('Sousou no Frieren');
    expect(e.title.zh).toBeUndefined();
  });

  it('裸文本横幅 ★10月新番★ 不进标题', () => {
    const p = service.parse(
      '【喵萌奶茶屋】★10月新番★[药屋少女的呢喃 / Kusuriya no Hitorigoto][03][1080p][简日双语]',
    );
    expect(p.title.zh).toBe('药屋少女的呢喃');
  });

  it('绝对集数：季号不残留在标题里', () => {
    const sl = service.parse('关于我转生变成史莱姆这档事 第3季 S3 - 48');
    expect(sl.season).toBe(3);
    expect(sl.episode).toEqual({ kind: 'single', no: 48 });
    expect(sl.title.zh).toBe('关于我转生变成史莱姆这档事');
  });
});
