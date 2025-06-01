import { MagnetFile } from '../magnet/file';

export interface ParseResult {
  filesList: MagnetFile[];
  torrentName: string;
  infoHash: string;
  torrentSavePath: string;
}
