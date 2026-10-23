import { Injectable } from '@nestjs/common';
import { MagnetFile } from '../../modal/magnet/file';
import { EpisodeRef, ParsedTitle } from '../../modal/parser/parsed-title';
import { TitleNormalizer, NormalizedTitle } from './pipeline/normalizer';
import { TitleTokenizer, TitleBlock } from './pipeline/tokenizer';
import { BlockClassifier } from './pipeline/classifier';
import { ParsedTitleExtractor } from './pipeline/extractor';
import { FileSignalAnalyzer, FileSignals } from './signals/file-signals';

export interface TitleAnalysis {
  normalized: NormalizedTitle;
  blocks: TitleBlock[];
}

/**
 * FileNameParser 新流水线的编排入口（docs/parser-refactor-plan.md §3/§4/§4.6）。
 *
 * 流程：Normalizer → Tokenizer → Classifier → Extractor
 *      →（有文件列表时）FileSignalAnalyzer 增强 → ParsedTitle。
 * 依赖方向：structure → parser（parser 不反向依赖 structure）。
 */
@Injectable()
export class ParserService {
  constructor(
    private readonly normalizer: TitleNormalizer,
    private readonly tokenizer: TitleTokenizer,
    private readonly classifier: BlockClassifier,
    private readonly extractor: ParsedTitleExtractor,
    private readonly fileAnalyzer: FileSignalAnalyzer,
  ) {}

  /** 归一化标题并切分为有序块（供调试/后续阶段使用）。 */
  analyze(title: string): TitleAnalysis {
    const normalized = this.normalizer.normalize(title);
    return { normalized, blocks: this.tokenizer.tokenize(normalized) };
  }

  /** 目标契约入口。files 为可选的文件结构（磁力解析后可得）。 */
  parse(title: string, files?: MagnetFile[]): ParsedTitle {
    // 纯标题流水线：归一化 → 切块 → 分类 → 提取
    const { normalized, blocks } = this.analyze(title);
    const classified = this.classifier.classify(blocks);
    const parsed = this.extractor.extract(normalized.raw, classified);

    // 有文件结构时再做一次信号增强（缺 files 时完全跳过，保持纯标题行为）
    if (files && files.length > 0) {
      const signals = this.fileAnalyzer.analyze(files);
      this.applyFileSignals(parsed, signals);
      parsed.source = 'regex+files';
    }
    return parsed;
  }

  private applyFileSignals(parsed: ParsedTitle, signals: FileSignals): void {
    // 1. 混合内容（视频+音频/图片/压缩包/文档）→ 合集，不输出集数
    if (signals.isMixed) {
      parsed.episode = null;
      parsed.confidence = Math.min(parsed.confidence, 0.5);
      return;
    }

    // 2. 没有任何视频文件 → 无集数
    if (signals.videoCount === 0) {
      parsed.episode = null;
      parsed.confidence = Math.min(parsed.confidence, 0.4);
      return;
    }

    // 3. 文件级集数（强信号）：标题无集数时补全，与标题一致时提置信，冲突时降置信
    const fileEp = this.episodeFromFiles(signals);
    if (fileEp) {
      if (parsed.episode === null) {
        parsed.episode = fileEp;
        parsed.confidence = Math.min(1, parsed.confidence + 0.2);
      } else if (this.episodeMatches(parsed.episode, fileEp)) {
        parsed.confidence = Math.min(1, parsed.confidence + 0.1);
      } else {
        parsed.confidence = Math.max(0, parsed.confidence - 0.2);
      }
      return;
    }

    // 4. 无文件级集数但视频数 > 1 → 推断整季范围（低置信）
    if (parsed.episode === null && signals.videoCount > 1) {
      parsed.episode = { kind: 'range', from: 1, to: signals.videoCount };
      parsed.confidence = Math.min(parsed.confidence, 0.6);
    }
  }

  /** 文件级集数 → EpisodeRef（多文件取 min..max 范围） */
  private episodeFromFiles(signals: FileSignals): EpisodeRef {
    if (signals.episodes.length === 0) return null;
    const min = signals.episodes[0];
    const max = signals.episodes[signals.episodes.length - 1];
    if (signals.episodes.length === 1) return { kind: 'single', no: min };
    if (max > min) return { kind: 'range', from: min, to: max };
    return { kind: 'single', no: min };
  }

  /** 结构化比较两个 EpisodeRef 是否一致（用于置信度加减） */
  private episodeMatches(a: EpisodeRef, b: EpisodeRef): boolean {
    if (!a || !b) return false;
    return JSON.stringify(a) === JSON.stringify(b);
  }
}
