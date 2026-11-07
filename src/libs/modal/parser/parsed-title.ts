/**
 * 文件名解析器的目标契约（REFACTOR-PLAN.md §3）。
 *
 * 与旧的 VanAnimeMetaData 相比：
 * - 集数一律结构化数字（EpisodeRef），不再输出 '01-13' 这类字符串；
 * - 新增 release（媒体规格）字段，服务 Jellyfin 的多版本去重与画质/字幕选择；
 * - source 区分「纯标题解析」与「标题+文件结构解析」，供上层判断可信度。
 */

export type EpisodeRef =
  | { kind: 'single'; no: number }
  | { kind: 'range'; from: number; to: number }
  | { kind: 'dual'; nos: number[] } // 同一集的双编号（不同计数体系）
  | null;

export type EpisodeType =
  'TV' | 'OVA' | 'OAD' | 'SP' | 'EX' | 'Movie' | 'Special' | null;

export type SourceKind =
  'WebRip' | 'BDRip' | 'WEB-DL' | 'DVDRip' | 'HDTVRip' | 'Remux' | 'TV' | null;

export type Resolution =
  '2160p' | '1080p' | '720p' | '480p' | '4K' | '2K' | null;

export type VideoCodec =
  'HEVC' | 'AVC' | 'AV1' | 'H264' | 'H265' | 'X264' | 'X265' | null;

export type AudioCodec =
  'AAC' | 'FLAC' | 'AC3' | 'EAC3' | 'OPUS' | 'DTS' | null;

export type Container = 'MKV' | 'MP4' | 'TS' | 'M2TS' | null;

export type SubtitleStyle = '内嵌' | '内封' | '外挂' | '无字幕' | null;

export interface ReleaseInfo {
  source: SourceKind;
  resolution: Resolution;
  videoCodec: VideoCodec;
  audioCodec: AudioCodec;
  bitDepth: 8 | 10 | 12 | null;
  container: Container;
  subtitle: { style: SubtitleStyle; langs: string[] };
  /** v2 / v3 / Rev / Reseed / 修正合集 等 */
  version: string | null;
  /** Baha / AT-X / ViuTV / Crunchyroll / Netflix 等 */
  station: string | null;
}

export interface ParsedTitle {
  raw: string;
  /** 发布组/字幕组 */
  group: { raw: string; name: string }[];
  /** 标题：按语言拆分；zh 优先 */
  title: { zh?: string; romaji?: string; jp?: string; others: string[] };
  season: number | null;
  year: number | null;
  episode: EpisodeRef;
  episodeType: EpisodeType;
  /** 媒体规格：best-effort，提取不到即 null */
  release: ReleaseInfo;
  source: 'regex' | 'regex+files';
  /** 0-1，供上层决策 */
  confidence: number;
}

function createEmptyRelease(): ReleaseInfo {
  return {
    source: null,
    resolution: null,
    videoCodec: null,
    audioCodec: null,
    bitDepth: null,
    container: null,
    subtitle: { style: null, langs: [] },
    version: null,
    station: null,
  };
}

export function createEmptyParsedTitle(raw: string): ParsedTitle {
  return {
    raw,
    group: [],
    title: { others: [] },
    season: null,
    year: null,
    episode: null,
    episodeType: null,
    release: createEmptyRelease(),
    source: 'regex',
    confidence: 0,
  };
}
