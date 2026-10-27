import { Injectable } from '@nestjs/common';
import { NormalizedTitle } from './normalizer';

export interface TitleBlock {
  /** bracket = 括号块（[] 或 ()）；bare = 括号外的裸文本 */
  kind: 'bracket' | 'bare';
  /** 内容：括号块不含两侧括号；裸块原样 */
  content: string;
  /** 原始片段：括号块含括号；裸块原样 */
  raw: string;
  /** 在 normalized 字符串中的起始索引 */
  index: number;
  /** 片段长度 */
  length: number;
}

/**
 * 流水线第 2 阶段：Tokenizer（REFACTOR-PLAN.md §4.2）。
 *
 * 把归一化后的标题切成有序块：
 * - `[...]` / `(...)` → bracket 块（保留 index/length，供后续精确定位）
 * - 括号外的裸文本 → bare 块；裸文本内再按 ` - ` 软切分，
 *   让 `标题 - 03` 这类最常见的单集形态在分类阶段更容易命中。
 *
 * 本阶段只切分，不判断块的语义（那是 Classifier 的职责）。
 */
@Injectable()
export class TitleTokenizer {
  tokenize(normalized: NormalizedTitle): TitleBlock[] {
    const s = normalized.normalized;
    const blocks: TitleBlock[] = [];
    let cursor = 0;
    let i = 0;

    while (i < s.length) {
      const ch = s[i];
      // 找最近的括号对：[] 或 ()
      let close = -1;
      if (ch === '[') {
        close = s.indexOf(']', i + 1);
      } else if (ch === '(') {
        close = s.indexOf(')', i + 1);
      }
      if (close === -1) {
        // 未闭合的括号按普通裸文本处理
        i++;
        continue;
      }

      // 先把括号前的裸文本切出来，再记录括号块
      this.flushBare(blocks, s.slice(cursor, i), cursor);
      blocks.push({
        kind: 'bracket',
        content: s.slice(i + 1, close),
        raw: s.slice(i, close + 1),
        index: i,
        length: close - i + 1,
      });
      i = close + 1;
      cursor = i;
    }

    // 收尾：最后一对括号之后的裸文本
    this.flushBare(blocks, s.slice(cursor), cursor);
    return blocks;
  }

  private flushBare(
    blocks: TitleBlock[],
    text: string,
    baseIndex: number,
  ): void {
    if (text.length === 0) return;
    // 裸文本按 ` - ` 软切分，分隔符本身也保留为独立的 bare 块
    const re = / - /g;
    let last = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      if (m.index > last) {
        blocks.push(this.bare(text.slice(last, m.index), baseIndex + last));
      }
      blocks.push(this.bare(m[0], baseIndex + m.index));
      last = m.index + m[0].length;
    }
    if (last < text.length) {
      blocks.push(this.bare(text.slice(last), baseIndex + last));
    }
  }

  private bare(content: string, index: number): TitleBlock {
    return {
      kind: 'bare',
      content,
      raw: content,
      index,
      length: content.length,
    };
  }
}
