import { Injectable } from '@nestjs/common';
import { MagnetFile } from '../../../modal/magnet/file';
import {
  ExtensionType,
  extensionDictionary,
} from '../../../modal/parser/Dictionary/ExtensionDictionary';
import { episodeOfFileName } from './file-episode';

export interface FileSignals {
  total: number;
  videoCount: number;
  audioCount: number;
  imageCount: number;
  archiveCount: number;
  documentCount: number;
  subtitleCount: number;
  /** 从视频文件名提取的集数（升序、去重） */
  episodes: number[];
  /** 是否混合内容：视频 + 音频/图片/压缩包/文档（字幕是正常附件，不算混合） */
  isMixed: boolean;
}

/**
 * 文件结构信号（REFACTOR-PLAN.md §4.6）。
 *
 * 输入是 `TorrentTransformerService.parseMagnet` 已产出的 filesList；
 * 复用 ExtensionDictionary 判定扩展名类别，从视频文件名提取集数。
 */
@Injectable()
export class FileSignalAnalyzer {
  analyze(files: MagnetFile[]): FileSignals {
    const counts: Record<ExtensionType, number> = {
      [ExtensionType.Video]: 0,
      [ExtensionType.Audio]: 0,
      [ExtensionType.Subtitle]: 0,
      [ExtensionType.Image]: 0,
      [ExtensionType.Archive]: 0,
      [ExtensionType.Document]: 0,
      [ExtensionType.Seed]: 0,
    };
    const episodes = new Set<number>();

    // 逐文件：按扩展名归类计数；视频文件再尝试提取集号
    for (const file of files) {
      const ext = this.extensionOf(file.name);
      const entry = ext ? extensionDictionary[ext] : undefined;
      if (!entry) continue;
      const type = entry.content[1];
      counts[type]++;
      if (type === ExtensionType.Video) {
        const ep = episodeOfFileName(file.name);
        if (ep != null) episodes.add(ep);
      }
    }

    return {
      total: files.length,
      videoCount: counts[ExtensionType.Video],
      audioCount: counts[ExtensionType.Audio],
      imageCount: counts[ExtensionType.Image],
      archiveCount: counts[ExtensionType.Archive],
      documentCount: counts[ExtensionType.Document],
      subtitleCount: counts[ExtensionType.Subtitle],
      episodes: [...episodes].sort((a, b) => a - b),
      // 有视频、且混入音频/图片/压缩包/文档 → 视为合集（字幕不算）
      isMixed:
        counts[ExtensionType.Video] > 0 &&
        (counts[ExtensionType.Audio] > 0 ||
          counts[ExtensionType.Image] > 0 ||
          counts[ExtensionType.Archive] > 0 ||
          counts[ExtensionType.Document] > 0),
    };
  }

  private extensionOf(name: string): string | null {
    const m = name.match(/\.([a-z0-9]+)$/i);
    return m ? m[1].toLowerCase() : null;
  }
}
