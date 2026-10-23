import { Injectable } from '@nestjs/common';

export interface NormalizedTitle {
  /** 原始标题，一字不差 */
  raw: string;
  /** 归一化后的标题：全角→半角、【】→[]、去尾部换行、剥扩展名、压缩空白 */
  normalized: string;
}

/** 常见媒体/字幕扩展名，用于剥离标题末尾的扩展名 */
const TRAILING_EXTENSION =
  /\.(?:mp4|mkv|ass|ssa|srt|vtt|7z|zip|rar|torrent|avi|wmv|flv|webm|m4v|mov|mpg|mpeg|ts|m2ts)$/i;

/**
 * 流水线第 1 阶段：Normalizer（REFACTOR-PLAN.md §4.1）。
 *
 * 只做确定性的字符与空白归一，不删除括号、不做任何分类判断；
 * 括号变体统一为 [] 与 ()，让 Tokenizer 只需处理一种形态。
 */
@Injectable()
export class TitleNormalizer {
  normalize(title: string): NormalizedTitle {
    const raw = title;
    // 1) 去掉尾部换行/多余空白
    let s = title.replace(/[\r\n]+/g, ' ').trim();
    // 2) 剥掉标题末尾残留的扩展名（如 `某番 - 03.mkv`）
    s = s.replace(TRAILING_EXTENSION, '');
    // 3) 全角 → 半角（含 【】→[]）
    s = this.toHalfWidth(s);
    // 4) 压缩连续空白（含全角空格转换后的空格）
    s = s.replace(/\s{2,}/g, ' ');
    return { raw, normalized: s };
  }

  /**
   * 全角 → 半角：
   * - 全角 ASCII（U+FF01–U+FF5E）→ ASCII（０→0、（）→()、：→:、～→~、／→/ 等）
   * - 全角空格 U+3000 → 半角空格
   * - 【】→[]，便于 Tokenizer 统一处理
   * - 中日文字符保持原样
   */
  private toHalfWidth(input: string): string {
    let out = '';
    for (const ch of input) {
      const code = ch.charCodeAt(0);
      if (code === 0x3000) {
        // 全角空格
        out += ' ';
        continue;
      }
      if (code === 0x3010) {
        // 【 → [
        out += '[';
        continue;
      }
      if (code === 0x3011) {
        // 】 → ]
        out += ']';
        continue;
      }
      if (code >= 0xff01 && code <= 0xff5e) {
        // 全角 ASCII 区：减去 0xFEE0 即对应半角（０→0、（）→()、：→:）
        out += String.fromCharCode(code - 0xfee0);
        continue;
      }
      // 中日文等其它字符原样保留
      out += ch;
    }
    return out;
  }
}
