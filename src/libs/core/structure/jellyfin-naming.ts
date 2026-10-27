import { Injectable } from '@nestjs/common';
import { MagnetFile } from '../../modal/magnet/file';
import { ParsedTitle } from '../../modal/parser/parsed-title';
import { episodeOfFileName } from '../parser/signals/file-episode';

export interface JellyfinTarget {
  /** 相对路径（不含媒体库根目录） */
  relativePath: string;
  /** 解析出的集号，供校验/日志 */
  episode: number | null;
}

/**
 * Jellyfin 命名层（REFACTOR-PLAN.md §8 步骤 5）。
 *
 * 规范：
 * - TV：`<show> (<year>)/Season <NN>/<show> - S<NN>E<NN>.<ext>`
 * - Movie：`<show> (<year>)/<show> (<year>) <ext>`
 *
 * 只负责「把解析结果格式化成 Jellyfin 路径」，不做文件搬运。
 */
@Injectable()
export class JellyfinNamer {
  buildPath(parsed: ParsedTitle, file: MagnetFile): JellyfinTarget {
    // 标题优先中文名，其次罗马音 / 日文 / 其它
    const show = this.sanitize(this.pickTitle(parsed));
    if (!show) return { relativePath: '', episode: null };

    // 年份作为目录后缀：`XX (2026)`
    const year = parsed.year ? ` (${parsed.year})` : '';
    const ext = this.extensionOf(file.name);

    // 电影：主文件 → `XX (2026)/XX (2026).mkv`；特典/菜单等 → `XX (2026)/extras/...`
    if (parsed.episodeType === 'Movie') {
      if (this.isExtra(file.name)) {
        return {
          relativePath: `${show}${year}/extras/${this.sanitize(file.name)}`,
          episode: null,
        };
      }
      return {
        relativePath: `${show}${year}/${show}${year}${ext}`,
        episode: null,
      };
    }

    // TV：`XX (2026)/Season 01/XX - S01E03.mkv`
    const episode = this.episodeForFile(parsed, file);
    if (episode == null) return { relativePath: '', episode: null };

    // 已知限制：字幕组常按「全剧连续编号」给绝对集数（如第3季里标 S3 - 48），
    // 而 Jellyfin 期望季内编号（S03E01 起）。此处不做换算（缺少各季集数信息），
    // 仅按解析出的 season + episode 直接拼接，上层可据此降置信或人工校正。
    const season = parsed.season ?? 1;
    const s = String(season).padStart(2, '0');
    const e = String(episode).padStart(2, '0');
    return {
      relativePath: `${show}${year}/Season ${s}/${show} - S${s}E${e}${ext}`,
      episode,
    };
  }

  pickTitle(parsed: ParsedTitle): string {
    return (
      parsed.title.zh ??
      parsed.title.romaji ??
      parsed.title.jp ??
      parsed.title.others[0] ??
      ''
    ).trim();
  }

  /**
   * 集号优先级：文件名 > 标题单集。
   * 集数为范围（range）且文件名不含集号时，无法确定该文件对应哪一集，
   * 返回 null（由调用方跳过），避免把整季所有文件都映射到同一集。
   */
  private episodeForFile(parsed: ParsedTitle, file: MagnetFile): number | null {
    const fromName = episodeOfFileName(file.name);
    if (fromName != null) return fromName;
    if (parsed.episode?.kind === 'single') return parsed.episode.no;
    return null;
  }

  private extensionOf(name: string): string {
    const m = name.match(/(\.[a-z0-9]+)$/i);
    return m ? m[1].toLowerCase() : '';
  }

  /** 电影类 torrent 里的特典/菜单等非正片视频，应进 extras/ 而非与正片同名。 */
  private isExtra(name: string): boolean {
    return /(?:NCOP|NCED|CM|PV|Menu|Preview|Trailer|特典|メニュー|Making|Interview)/i.test(
      name,
    );
  }

  /** 去除文件名非法字符（Windows 侧最严格） */
  private sanitize(name: string): string {
    return name
      .replace(/[\\/:*?"<>|]/g, '_')
      .replace(/\s+/g, ' ')
      .trim();
  }
}
