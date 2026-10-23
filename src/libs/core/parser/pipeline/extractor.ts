import { Injectable } from '@nestjs/common';
import aniep from 'aniep';
import { ClassifiedBlock } from './classifier';
import {
  EpisodeRef,
  EpisodeType,
  ParsedTitle,
  Resolution,
  SourceKind,
  VideoCodec,
  AudioCodec,
  Container,
  SubtitleStyle,
  createEmptyParsedTitle,
} from '../../../modal/parser/parsed-title';
import { groupDictionary } from '../../../modal/parser/Dictionary/GroupDictionary';
import { cnToNumber } from './cn-numeral';

const ROMAN: Record<string, number> = { Ⅱ: 2, Ⅲ: 3, Ⅳ: 4, Ⅴ: 5, Ⅵ: 6 };

/** 组名特征词：命中即认为是发布组 */
const GROUP_KEYWORD =
  /(字幕组|字幕社|字幕組|汉化组|汉化組|压制组|壓制組|压制|壓制|-?Raws|Sub|Studio|FanSub|Team|Works|搬运|搬運|工作室|字幕|組|组|社|部|屋)/i;

/**
 * 流水线第 4 阶段：Extractor（REFACTOR-PLAN.md §4.3/§4.4）。
 *
 * 把分类后的块组合成 ParsedTitle：
 * - group：首个「像组名」的括号块（词典命中 → 中文名，否则保留原文）
 * - title：episode 之前的文本块（去掉组块与纯分隔符），按 `/` 切分
 * - episode：优先块级命中，其次 aniep 兜底；合集/混合大包返回 null
 * - season/year/type：块级 + 标题级正则
 * - release：specs 块内的分辨率/编码/音轨/字幕/来源/容器
 */
@Injectable()
export class ParsedTitleExtractor {
  extract(raw: string, classified: ClassifiedBlock[]): ParsedTitle {
    const result = createEmptyParsedTitle(raw);

    // 1) 组名 + 标题（依赖块的先后位置）
    this.fillGroupAndTitle(result, classified);

    // 2) 集数：块级命中优先；合集/混合大包直接 null；都没有再走标题级兜底
    const epBlock = classified.find((b) => b.role === 'episode');
    const collection = this.isCollectionLike(raw);

    if (collection) {
      // 混合大包：不臆造集数
      result.episode = null;
    } else if (epBlock) {
      result.episode = epBlock.episode ?? null;
      if (epBlock.season != null) result.season = epBlock.season;
    } else {
      result.episode = this.fallbackEpisode(raw);
    }

    // 3) 季 / 年 / 内容类型
    if (result.season == null) result.season = this.detectSeason(raw);
    result.year = this.detectYear(raw);
    result.episodeType = this.detectType(raw);

    // 4) 媒体规格 + 5) 置信度
    this.fillRelease(result, classified);
    result.confidence = this.confidence(result, classified);

    return result;
  }

  private fillGroupAndTitle(
    result: ParsedTitle,
    classified: ClassifiedBlock[],
  ): void {
    const epIdx = classified.findIndex((b) => b.role === 'episode');
    const limit = epIdx === -1 ? classified.length : epIdx;

    // group：优先识别 ★ 分隔的裸文本前缀组名（如「六四位元字幕組★…」）
    let groupIdx = -1; // -1 = 尚未识别到组名
    const firstText = classified.find((b) => b.role === 'text');
    if (firstText && firstText.block.kind === 'bare') {
      const c = firstText.block.content.trim();
      const m = c.match(/^([^★☆]+?)\s*[★☆]/);
      if (m && this.looksLikeGroup(m[1].trim())) {
        groupIdx = classified.indexOf(firstText);
        result.group.push({ raw: m[1].trim(), name: m[1].trim() });
      }
    }

    // group：首个像组名的括号文本块（联合发布保留原名；词典优先）
    if (result.group.length === 0) {
      for (let i = 0; i < limit; i++) {
        const cb = classified[i];
        if (cb.role !== 'text' || cb.block.kind !== 'bracket') continue;
        const c = cb.block.content.trim();
        if (!c) continue;
        // 联合发布（&）保留完整原名，避免被词典截成单个组
        if (c.includes('&')) {
          groupIdx = i;
          result.group.push({ raw: c, name: c });
          break;
        }
        const dict = this.matchGroupDictionary(c);
        if (dict) {
          groupIdx = i;
          result.group.push({ raw: c, name: dict });
          break;
        }
        // 短首块 + 长次块 → 组名（如 [晚街与灯][Re:Zero …]）
        if (c.length <= 6 && this.hasNextLongTextBlock(classified, i, limit)) {
          groupIdx = i;
          result.group.push({ raw: c, name: c });
          break;
        }
        if (this.looksLikeGroup(c)) {
          groupIdx = i;
          result.group.push({ raw: c, name: c });
          break;
        }
      }
    }

    // title：episode 之前的文本块（跳过组块与纯分隔符）
    const parts: string[] = [];
    for (let i = 0; i < limit; i++) {
      if (i === groupIdx) continue;
      const cb = classified[i];
      if (cb.role !== 'text') continue;
      const c = cb.block.content.trim();
      if (c.length === 0 || c === '-') continue;
      parts.push(c);
    }

    result.title = this.splitTitle(parts);
  }

  /** 多语言标题按 `/` 切分：第一段作中文名，其余放 others */
  private splitTitle(parts: string[]): ParsedTitle['title'] {
    const joined = parts.join(' ').trim();
    if (!joined) return { others: [] };
    const segs = joined
      .split(/\s*\/\s*/)
      .map((s) => s.trim())
      .filter(Boolean);
    return { zh: segs[0], others: segs.slice(1) };
  }

  private looksLikeGroup(content: string): boolean {
    if (!content) return false;
    if (GROUP_KEYWORD.test(content)) return true;
    // 纯拉丁/数字/符号、无中日文、无空格：LoliHouse / ANi / DBD-Raws / 7³ACG
    // （假名也算正文，避免 [ゆるキャン] 这类纯假名标题被误判成组名）
    if (!/[\u4e00-\u9fff\u3040-\u30ff]/.test(content) && !/\s/.test(content)) {
      return true;
    }
    return false;
  }

  /** 判断后面是否还有较长的括号文本块（短首块 → 组名 的启发式用） */
  private hasNextLongTextBlock(
    classified: ClassifiedBlock[],
    from: number,
    limit: number,
  ): boolean {
    for (let j = from + 1; j < limit; j++) {
      const b = classified[j];
      if (
        b.role === 'text' &&
        b.block.kind === 'bracket' &&
        b.block.content.trim().length > 10
      ) {
        return true;
      }
    }
    return false;
  }

  private matchGroupDictionary(content: string): string | null {
    const isLatin = (s: string) => /[A-Za-z]/.test(s);
    for (const value of Object.values(groupDictionary)) {
      // 克隆正则，避免 g 标志的 lastIndex 状态污染
      const re = new RegExp(
        value.regex.source,
        value.regex.flags.replace('g', ''),
      );
      const m = re.exec(content);
      if (!m) continue;
      const before = content[m.index - 1] ?? '';
      const after = content[m.index + m[0].length] ?? '';
      // 跳过嵌在更长拉丁单词里的误配（如 Prejudice 中的 CE）
      if (isLatin(before) && isLatin(m[0][0])) continue;
      if (isLatin(after) && isLatin(m[0][m[0].length - 1])) continue;
      return value.content;
    }
    return null;
  }

  /** 合集/混合大包判定：命中则不输出集数（REFACTOR-PLAN 语料口径） */
  private isCollectionLike(raw: string): boolean {
    // 整理搬运打包（TV+OVA+漫画+CD 等混装）
    if (/整理搬运|整理搬運/.test(raw)) return true;
    // TV全集 + OAD/OVA/SP：整季之外还混了特番
    if (/TV全集[^\]]*?\+(?:OAD|OVA|SP)/i.test(raw)) return true;
    // TV全集 + 剧场版
    if (/TV全集[^\]]*?\+(?:剧场版|劇場版)/.test(raw)) return true;
    // [01-12+OVA1-2] 这类 TV 范围 + OVA 混装
    if (/\+\s*(?:OVA|OAD)\s*\d/i.test(raw)) return true;
    // SP&S01(01-13)
    if (/SP\s*&\s*S\d/i.test(raw)) return true;
    // [S1 + OAD Fin] / [S1 Reseed + OAD Reseed + S2 ...]
    if (/\[S\d+[^\]]*\+/.test(raw)) return true;
    // 全話+OST/EXTRA/特典
    if (/全話[^\]]*\+\s*(?:OST|EXTRA|特典)/i.test(raw)) return true;
    // 粉丝分册合集（美少女战士合集9）
    if (/合集\d+(?:\.|$)/.test(raw)) return true;
    return false;
  }

  private fallbackEpisode(raw: string): EpisodeRef {
    // 多部番用 & 连接两个范围（如 1-13&…1-13）：无法归为单一集数
    const rangeGroups = raw.match(/\d{1,4}\s*[-~]\s*\d{1,4}/g) ?? [];
    if (rangeGroups.length >= 2 && raw.includes('&')) {
      return null;
    }

    // 清理噪音：去掉 "53yrs ago -" 前缀、音频声道 2.0/5.1/7.1，避免 aniep 误读
    let cleaned = raw.replace(/^\d+\s*yrs?\s*ago\s*-\s*/i, '');
    cleaned = cleaned.replace(/\b(?:2\.0|5\.1|7\.1)\b/g, ' ');

    const byPattern = this.matchFallbackByPattern(cleaned);
    if (byPattern) return byPattern;

    const r = aniep(cleaned);
    if (r == null) return null;
    if (typeof r === 'number') {
      return this.isTitleNumber(raw, r) || this.isResolutionNumber(raw, r)
        ? null
        : { kind: 'single', no: r };
    }
    if (Array.isArray(r)) {
      return { kind: 'range', from: Math.min(...r), to: Math.max(...r) };
    }
    if (typeof r === 'string') {
      // aniep 对双编号返回 '10|11' 这种字符串 → dual
      if (r.includes('|')) {
        const nos = r
          .split('|')
          .map((s) => Number(s))
          .filter((n) => !Number.isNaN(n));
        if (nos.length >= 2) return { kind: 'dual', nos };
        if (nos.length === 1) return { kind: 'single', no: nos[0] };
        return null;
      }
      const n = Number(r);
      if (Number.isNaN(n)) return null;
      return this.isTitleNumber(raw, n) || this.isResolutionNumber(raw, n)
        ? null
        : { kind: 'single', no: n };
    }
    return null;
  }

  /** 「剧场版28」「怪獸8號」里的数字是作品序号/标题数字，不是集数 */
  private isTitleNumber(raw: string, n: number): boolean {
    const movieNo = raw.match(/剧场版\s*0*(\d+)/);
    if (movieNo && +movieNo[1] === n) return true;
    const titleNo = raw.match(/(\d+)\s*[號号]/);
    if (titleNo && +titleNo[1] === n) return true;
    return false;
  }

  /** 1080/720 等裸分辨率值：标题里同时出现 specs 关键词时，不是集数 */
  private isResolutionNumber(raw: string, n: number): boolean {
    if (![2160, 1440, 1080, 720, 480, 360, 240].includes(n)) return false;
    return /\b(?:MKV|MP4|AVC|HEVC|BDRip|WebRip|2160p|1080p|720p|480p|10bit|8bit)\b/i.test(
      raw,
    );
  }

  /** 标题级兜底形态：块级切分切不出来的常见结构 */
  private matchFallbackByPattern(raw: string): EpisodeRef {
    // 总第67~85（季度总集数）
    let m = raw.match(/总第\s*(\d{1,4})\s*[~-]\s*(\d{1,4})/);
    if (m) return { kind: 'range', from: +m[1], to: +m[2] };

    // S02E01~10
    m = raw.match(/S\d{1,2}\s*E(\d{1,4})\s*[~-]\s*(\d{1,4})/i);
    if (m) return { kind: 'range', from: +m[1], to: +m[2] };

    // 管道分隔：S05 | 01-13
    m = raw.match(/\|\s*(\d{1,4})\s*-\s*(\d{1,4})/);
    if (m) return { kind: 'range', from: +m[1], to: +m[2] };

    // 正片01-27（区别于番外/SP）
    m = raw.match(/正片\s*(\d{1,4})\s*[-~]\s*(\d{1,4})/);
    if (m) return { kind: 'range', from: +m[1], to: +m[2] };

    // 点分格式的电影序号：电影1-2
    m = raw.match(/电影\s*(\d{1,4})\s*[-~]\s*(\d{1,4})/);
    if (m) return { kind: 'range', from: +m[1], to: +m[2] };

    // EP01-EP07 / EP01-50
    m = raw.match(/EP\s*(\d{1,4})\s*[-~]\s*(?:EP\s*)?(\d{1,4})/i);
    if (m) return { kind: 'range', from: +m[1], to: +m[2] };

    // 范围后跟 specs 关键词（含 (完)/_合集 之类的前缀括号）
    m = raw.match(
      /(\d{1,4})\s*[-~]\s*(\d{1,4})\s*[（(_]?\s*(?:MKV|MP4|AVC|HEVC|BDRip|WebRip|1080|720|简|繁|合集|Fin|END|完)/i,
    );
    if (m && !(this.isYear(+m[1]) && this.isYear(+m[2]))) {
      return { kind: 'range', from: +m[1], to: +m[2] };
    }

    return null;
  }

  private isYear(n: number): boolean {
    return n >= 1900 && n <= 2100;
  }

  /** 从标题文本提取季度：S2 / 第2季 / 2nd Season / Ⅱ 等 */
  private detectSeason(raw: string): number | null {
    let m = raw.match(/(?:S|Season\s*)(\d{1,2})\b/i);
    if (m) return +m[1];
    m = raw.match(/第\s*(\d{1,2})\s*(?:季|期)/);
    if (m) return +m[1];
    m = raw.match(/第\s*([零〇一二三四五六七八九十百千万亿两兩廿卅]+)\s*季/);
    if (m) {
      const season = cnToNumber(m[1]);
      if (season != null) return season;
    }
    m = raw.match(/(\d{1,2})(?:nd|rd|th|st)\s*Season/i);
    if (m) return +m[1];
    m = raw.match(/[ⅡⅢⅣⅤⅥ]/);
    if (m) return ROMAN[m[0]] ?? null;
    return null;
  }

  /** 从标题提取年份（19xx/20xx）；排除 1920x1080 这类分辨率 */
  private detectYear(raw: string): number | null {
    const m = raw.match(/(?:^|[^\d])((?:19|20)\d{2})(?![x×]\s*\d)(?:[^\d]|$)/);
    return m ? +m[1] : null;
  }

  /** 内容类型判定：Movie/OVA/OAD/SP/EX，默认 TV */
  private detectType(raw: string): EpisodeType {
    if (/剧场版|劇場版|\bMovie\b|电影版/i.test(raw)) return 'Movie';
    if (/\bOVA\b/i.test(raw)) return 'OVA';
    if (/\bOAD\b/i.test(raw)) return 'OAD';
    if (/\bSP\b|特别篇|特別篇|番外|スピンオフ/i.test(raw)) return 'SP';
    if (/\bEX\b/i.test(raw)) return 'EX';
    return 'TV';
  }

  private fillRelease(
    result: ParsedTitle,
    classified: ClassifiedBlock[],
  ): void {
    // specs 块内逐项提取（best-effort：匹配不到就保持 null）
    for (const cb of classified) {
      if (cb.role !== 'specs') continue;
      const c = cb.block.content;

      // 视频：分辨率 / 编码 / 位深 / 容器
      const res = c.match(/\b(2160p|1080p|720p|480p)\b/i);
      if (res) {
        result.release.resolution = this.normalizeResolution(res[1]);
      }
      const codec = c.match(/\b(HEVC|AVC|AV1|H\.?264|H\.?265|X264|X265)\b/i);
      if (codec) {
        result.release.videoCodec = this.normalizeCodec(codec[1]);
      }
      // 音频
      const audio = c.match(/\b(AAC|FLAC|AC3|EAC3|OPUS|DTS)\b/i);
      if (audio) {
        result.release.audioCodec = audio[1].toUpperCase() as AudioCodec;
      }
      const bit = c.match(/\b(8|10|12)-?bit\b/i);
      if (bit) {
        result.release.bitDepth = Number(bit[1]) as 8 | 10 | 12;
      }
      const cont = c.match(/\b(MKV|MP4|TS|M2TS)\b/i);
      if (cont) {
        result.release.container = cont[1].toUpperCase() as Container;
      }
      // 来源
      const src = c.match(/\b(WebRip|BDRip|WEB-DL|DVDRip|HDTVRip|Remux)\b/i);
      if (src) {
        result.release.source = this.normalizeSource(src[1]);
      }
      // 字幕风格
      const style = c.match(/(内嵌|内封|外挂|无字幕)/);
      if (style) {
        result.release.subtitle.style = style[1] as SubtitleStyle;
      }
      // 版本
      const ver = c.match(
        /\b(v[2-9]|Rev|Reseed|修正合集|精校合集|精修合集)\b/i,
      );
      if (ver) result.release.version = ver[1];
    }
  }

  private normalizeResolution(v: string): Resolution {
    const s = v.toLowerCase();
    if (s === '2160p' || s === '1080p' || s === '720p' || s === '480p') {
      return s;
    }
    return null;
  }

  private normalizeCodec(v: string): VideoCodec {
    const s = v.toUpperCase().replace('.', '');
    if (s === 'H264' || s === 'X264') return 'AVC';
    if (s === 'H265' || s === 'X265') return 'HEVC';
    if (s === 'HEVC' || s === 'AVC' || s === 'AV1') return s;
    return null;
  }

  private normalizeSource(v: string): SourceKind {
    const s = v.toLowerCase();
    if (s === 'webrip') return 'WebRip';
    if (s === 'bdrip') return 'BDRip';
    if (s === 'web-dl') return 'WEB-DL';
    if (s === 'dvdrip') return 'DVDRip';
    if (s === 'hdtvrip') return 'HDTVRip';
    if (s === 'remux') return 'Remux';
    return null;
  }

  /** 简单可解释的置信度：基础分 + 各字段命中加分（上限 1） */
  private confidence(
    result: ParsedTitle,
    classified: ClassifiedBlock[],
  ): number {
    let score = 0.3;
    if (result.episode) score += 0.35;
    if (result.group.length > 0) score += 0.15;
    if (result.title.zh) score += 0.1;
    if (result.season != null) score += 0.05;
    if (classified.some((b) => b.role === 'specs')) score += 0.05;
    return Math.min(1, score);
  }
}
