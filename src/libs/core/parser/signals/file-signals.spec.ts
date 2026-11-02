import { FileSignalAnalyzer } from './file-signals';

describe('FileSignalAnalyzer', () => {
  const analyzer = new FileSignalAnalyzer();

  it('识别视频/字幕计数与集数序列', () => {
    const signals = analyzer.analyze([
      { name: 'Title - 01.mkv', length: 1 },
      { name: 'Title - 02.mkv', length: 1 },
      { name: 'Title - 02.ass', length: 1 },
    ]);
    expect(signals.videoCount).toBe(2);
    expect(signals.subtitleCount).toBe(1);
    expect(signals.episodes).toEqual([1, 2]);
    expect(signals.isMixed).toBe(false);
  });

  it('混合内容判定：音频/图片算混合，字幕不算', () => {
    expect(
      analyzer.analyze([
        { name: 'a.mkv', length: 1 },
        { name: 'b.flac', length: 1 },
      ]).isMixed,
    ).toBe(true);
    expect(
      analyzer.analyze([
        { name: 'a.mkv', length: 1 },
        { name: 'b.ass', length: 1 },
      ]).isMixed,
    ).toBe(false);
  });

  it('SxxEyy / [nn] / ^nn 文件命名可提取集数', () => {
    const signals = analyzer.analyze([
      { name: 'Show S01E03.mkv', length: 1 },
      { name: '[04].mkv', length: 1 },
    ]);
    expect(signals.episodes).toEqual([3, 4]);
  });
});
