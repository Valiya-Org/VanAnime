import { Module } from '@nestjs/common';
import { JellyfinNamer } from './jellyfin-naming';

/**
 * 文件结构域（File Structure Parser 的职责）：把解析结果整理成
 * 可落盘的媒体库结构（当前是 Jellyfin 命名/路径）。
 *
 * 消费 parser 的 ParsedTitle，不反向依赖 parser。
 */
@Module({
  providers: [JellyfinNamer],
  exports: [JellyfinNamer],
})
export class StructureModule {}
