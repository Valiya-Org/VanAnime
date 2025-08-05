export interface VanAnimeMetaData {
  name: string | null;
  originalName: string;
  isTV: boolean;
  seasonNumber?: number | null;
  tmdbId?: number | null;
  bangumiId?: number | null;
  group: { rawName: string; parsedName: string }[];
  groupIndex?: { index: number; length: number; content: string } | null;
  year?: number | null;
  episode?: number | null;
  episodeIndex?: {
    index: number;
    length: number;
    content: string;
  } | null;
}
