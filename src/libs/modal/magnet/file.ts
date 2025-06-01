export type MagnetFile = {
  name: string;
  length: number;
};

export type MagnetFileDetails = {
  filesList: MagnetFile[];
  torrentName: string;
  infoHash: string;
};

export interface QBTaskContent {
  availability: number;
  index: number;
  is_seed: boolean;
  name: string;
  piece_range: number[];
  priority: number;
  progress: number;
  size: number;
}

export type AnimeEpisode = {
  label: number;
  files: string[];
};
