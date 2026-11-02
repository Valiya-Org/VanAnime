import { JellyfinNamer } from './jellyfin-naming';
import {
  ParsedTitle,
  createEmptyParsedTitle,
} from '../../modal/parser/parsed-title';

function parsed(overrides: Partial<ParsedTitle>): ParsedTitle {
  return { ...createEmptyParsedTitle('x'), ...overrides };
}

describe('JellyfinNamer', () => {
  const namer = new JellyfinNamer();

  it('TV 单集路径', () => {
    const target = namer.buildPath(
      parsed({
        title: { zh: '兽王武神', others: [] },
        episode: { kind: 'single', no: 3 },
        episodeType: 'TV',
      }),
      { name: 'Title - 03.mkv', length: 1 },
    );
    expect(target.relativePath).toBe(
      '兽王武神/Season 01/兽王武神 - S01E03.mkv',
    );
    expect(target.episode).toBe(3);
  });

  it('带年份与季度的 TV', () => {
    const target = namer.buildPath(
      parsed({
        title: { zh: '魔法骑士', others: [] },
        year: 2026,
        season: 2,
        episode: { kind: 'single', no: 3 },
        episodeType: 'TV',
      }),
      { name: 'Title - 03.mkv', length: 1 },
    );
    expect(target.relativePath).toBe(
      '魔法骑士 (2026)/Season 02/魔法骑士 - S02E03.mkv',
    );
  });

  it('Movie 路径', () => {
    const target = namer.buildPath(
      parsed({
        title: { zh: '仙逆剧场版', others: [] },
        year: 2026,
        episodeType: 'Movie',
      }),
      { name: 'Movie.mkv', length: 1 },
    );
    expect(target.relativePath).toBe('仙逆剧场版 (2026)/仙逆剧场版 (2026).mkv');
    expect(target.episode).toBeNull();
  });

  it('集号优先从文件名取', () => {
    const target = namer.buildPath(
      parsed({
        title: { zh: '某番', others: [] },
        episode: { kind: 'range', from: 1, to: 12 },
        episodeType: 'TV',
      }),
      { name: '某番 - 05.mkv', length: 1 },
    );
    expect(target.episode).toBe(5);
    expect(target.relativePath).toBe('某番/Season 01/某番 - S01E05.mkv');
  });

  it('文件名非法字符被替换', () => {
    const target = namer.buildPath(
      parsed({
        title: { zh: 'A/B:C', others: [] },
        episode: { kind: 'single', no: 1 },
        episodeType: 'TV',
      }),
      { name: 'a.mkv', length: 1 },
    );
    expect(target.relativePath).toContain('A_B_C');
  });
});
