import { ParsedTitle } from '../parser/parsed-title';

export type SearchResult = {
  provider: string;
  title: string;
  href: string;
  type: string;
  magnet: string;
  size: number;
  /** 标题解析结果（搜索阶段只有标题，无文件结构） */
  parsedTitle?: ParsedTitle;
};
