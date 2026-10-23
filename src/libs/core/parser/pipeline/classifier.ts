import { Injectable } from '@nestjs/common';
import { TitleBlock } from './tokenizer';
import { EpisodeRef } from '../../../modal/parser/parsed-title';
import { cnToNumber } from './cn-numeral';

export type BlockRole = 'junk' | 'episode' | 'specs' | 'text' | 'year';

export interface ClassifiedBlock {
  block: TitleBlock;
  role: BlockRole;
  /** role === 'episode' 时携带解析结果 */
  episode?: EpisodeRef;
  /** SxxEyy 形态时携带季度 */
  season?: number;
}

/** 横幅/尾注等垃圾块：不参与 group / title / episode 判定 */
const JUNK_PATTERNS = [
  /^\d{4}(春|夏|秋|冬)/, // 2026秋季日剧 / 2024秋季日剧
  /^(合集|全集|全话|全話|生|生肉|熟肉)$/,
  /^附/, // 附日字 / 附特典映像 / 附官方...
  /^(检索|搜尋|搜索)/,
  /^招募/,
  /^网盘$/,
  /^(搬运|搬運)$/,
  /招人/,
];

/** specs 块：分辨率/编码/音轨/字幕/来源/容器/站点 */
const SPEC_TOKEN =
  /(2160p|1080p|720p|480p|4k|2k|hevc|avc|av1|h\.?26[45]|x26[45]|10bit|8bit|12bit|aac|flac|ac3|eac3|opus|dts|webrip|bdrip|web-dl|dvdrip|hdtvrip|remux|mkv|mp4|m2ts|内嵌|内封|外挂|无字幕|简繁|简体|繁体|chs|cht|big5|baha|bahamut|crunchyroll|netflix|viutv|amzn|at-x)/i;

/** 中文数字 → 阿拉伯数字（通用解析，见 cn-numeral.ts） */

/**
 * 流水线第 3 阶段：Classifier（REFACTOR-PLAN.md §4.3）。
 *
 * 对每个块打一个基础角色标签。group / title 的判定依赖块的位置，
 * 放在 Extractor 里结合顺序处理；这里只做内容级判定。
 */
@Injectable()
export class BlockClassifier {
  /** 对全部块打角色标签（不改动块的顺序）。 */
  classify(blocks: TitleBlock[]): ClassifiedBlock[] {
    return blocks.map((block, index) => this.classifyOne(block, index, blocks));
  }

  /** 单块角色判定，顺序即优先级：junk → year → episode → specs → text */
  private classifyOne(
    block: TitleBlock,
    index: number,
    all: TitleBlock[],
  ): ClassifiedBlock {
    const c = block.content.trim();
    if (c.length === 0) return { block, role: 'junk' };

    // 横幅/尾注等垃圾块（【合集】【生】附日字 等）
    if (this.isJunk(c)) return { block, role: 'junk' };

    // 纯 4 位年份单独成块（如 [2026] / (1997)），不当作集数
    if (/^(?:19|20)\d{2}$/.test(c)) {
      return { block, role: 'year' };
    }

    // 裸分辨率（1080/720 等漏写 p）：相邻块是 specs 时按规格处理，避免误当集数
    if (this.isBareResolution(c, index, all)) {
      return { block, role: 'specs' };
    }

    // 集数块（最高业务优先级）
    const ep = this.matchEpisode(c);
    if (ep) {
      return {
        block,
        role: 'episode',
        episode: ep.episode,
        season: ep.season,
      };
    }

    // 规格块（分辨率/编码/音轨/字幕/来源/容器）
    if (SPEC_TOKEN.test(c)) return { block, role: 'specs' };

    // 其余都是文本，留给 Extractor 判定 group / title
    return { block, role: 'text' };
  }

  private isJunk(c: string): boolean {
    return JUNK_PATTERNS.some((re) => re.test(c));
  }

  /** 年份边界（1900–2100），用于区分集数与年份范围 */
  private isYear(n: number): boolean {
    return n >= 1900 && n <= 2100;
  }

  /**
   * 裸分辨率值（漏写 p，如 `[1080]`）：仅当相邻块是 specs 时认定，
   * 避免把长跑番的 `[1080]` 集数误判为分辨率。
   */
  private isBareResolution(
    c: string,
    index: number,
    all: TitleBlock[],
  ): boolean {
    if (!/^(?:2160|1440|1080|720|480)$/.test(c)) return false;
    const prev = this.nearestContent(all, index, -1);
    const next = this.nearestContent(all, index, 1);
    return SPEC_TOKEN.test(prev) || SPEC_TOKEN.test(next);
  }

  /** 向指定方向找最近的、非空白的块内容（tokenizer 会在括号间插入纯空格块） */
  private nearestContent(
    all: TitleBlock[],
    index: number,
    step: 1 | -1,
  ): string {
    for (let i = index + step; i >= 0 && i < all.length; i += step) {
      const t = all[i].content.trim();
      if (t) return t;
    }
    return '';
  }

  /**
   * 集数高置信模式（§4.4 优先级）。返回 null 表示该块不是集数块。
   * 说明：tokenizer 已把 ` - 03` 拆成独立 bare 块，所以这里能直接匹配纯数字。
   */
  matchEpisode(raw: string): { episode: EpisodeRef; season?: number } | null {
    const c = raw.trim();
    if (!c) return null;

    // 0. 双编号范围 01-24(73-96) / 01-02(13-14)
    let m = c.match(/^(\d{1,4})-(\d{1,4})[（(](\d{1,4})-(\d{1,4})[）)]/);
    if (m) {
      return { episode: { kind: 'range', from: +m[1], to: +m[2] } };
    }

    // 1. 纯数字（含小数集）：`- 03` / `[03]` / `EP 03.5`
    m = c.match(/^(\d{1,4})(?:\.(\d+))?$/);
    if (m) {
      const value = m[2] ? parseFloat(`${m[1]}.${m[2]}`) : parseInt(m[1], 10);
      return { episode: { kind: 'single', no: value } };
    }

    // 2. EPnn / Episode nn / EP.nn
    m = c.match(/^(?:EP|Episode)\s*\.?\s*(\d{1,4}(?:\.\d+)?)$/i);
    if (m) return { episode: { kind: 'single', no: parseFloat(m[1]) } };

    // 3. SxxEyy（含 S02E01~10）
    m = c.match(/^S(\d{1,2})\s*E(\d{1,4})(?:~(\d{1,4}))?$/i);
    if (m) {
      if (m[3]) {
        return {
          season: +m[1],
          episode: { kind: 'range', from: +m[2], to: +m[3] },
        };
      }
      return { season: +m[1], episode: { kind: 'single', no: +m[2] } };
    }

    // 4. 第NN话/集/話/回/夜/弾（阿拉伯数字）
    m = c.match(/^第\s*(\d{1,4})\s*(?:集|話|话|回|夜|弾)$/);
    if (m) return { episode: { kind: 'single', no: parseInt(m[1], 10) } };

    // 4b. 第X話（中文数字，支持任意位：第三話 / 第二十一話 / 第一百零五話）
    m = c.match(
      /^第\s*([零〇一二三四五六七八九十百千万亿两兩廿卅]+)\s*(?:集|話|话|回|夜|弾)$/,
    );
    if (m) {
      const no = cnToNumber(m[1]);
      if (no != null) return { episode: { kind: 'single', no } };
    }

    // 5a. 两个独立范围用 & 连接（多部番混装）：不归为单一集数
    const rangeGroups = c.match(/\d{1,4}\s*[-~]\s*\d{1,4}/g) ?? [];
    if (/^\d/.test(c) && rangeGroups.length >= 2 && c.includes('&')) {
      return null;
    }

    // 5b. 范围 NN-NN / NN~NN：忽略其后缀（Fin/(全集)/_合集/&EX 等），排除年份范围
    m = c.match(/^(\d{1,4})\s*[-~]\s*(\d{1,4})(?!\d)/);
    if (m) {
      const from = +m[1];
      const to = +m[2];
      if (!(this.isYear(from) && this.isYear(to))) {
        return { episode: { kind: 'range', from, to } };
      }
    }

    // 6. 全NN集 / 全NN話
    m = c.match(/^全\s*(\d{1,4})\s*(?:集|話|话)$/);
    if (m) return { episode: { kind: 'single', no: parseInt(m[1], 10) } };

    // 7. 管道/区间附加：01-12+SPx1 / 01-12+EX / 01-13END
    m = c.match(/^(\d{1,4})\s*[-~]\s*(\d{1,4})\s*\+/);
    if (m) return { episode: { kind: 'range', from: +m[1], to: +m[2] } };

    // 8. 第NN回 之类带前后缀的宽松形态
    m = c.match(/^第\s*(\d{1,4})\s*[-~]\s*(\d{1,4})\s*(?:话|話|集|回)/);
    if (m) return { episode: { kind: 'range', from: +m[1], to: +m[2] } };

    return null;
  }
}
