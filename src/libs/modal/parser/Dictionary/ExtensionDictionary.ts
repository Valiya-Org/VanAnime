export enum ExtensionType {
  Video = 'Video',
  Audio = 'Audio',
  Subtitle = 'Subtitle',
  Image = 'Image',
  Archive = 'Archive',
  Document = 'Document',
  Seed = 'Seed',
}

export const extensionDictionary: {
  [key: string]: { regex: RegExp; content: [string, ExtensionType] };
} = {
  // Video extensions
  mp4: { regex: /mp4/gi, content: ['MP4', ExtensionType.Video] },
  mkv: { regex: /mkv/gi, content: ['MKV', ExtensionType.Video] },
  mov: { regex: /mov/gi, content: ['MOV', ExtensionType.Video] },
  avi: { regex: /avi/gi, content: ['AVI', ExtensionType.Video] },
  wmv: { regex: /wmv/gi, content: ['WMV', ExtensionType.Video] },
  flv: { regex: /flv/gi, content: ['FLV', ExtensionType.Video] },
  mpg: { regex: /mpg/gi, content: ['MPG', ExtensionType.Video] },
  mpeg: { regex: /mpeg/gi, content: ['MPEG', ExtensionType.Video] },
  m4v: { regex: /m4v/gi, content: ['M4V', ExtensionType.Video] },
  webm: { regex: /webm/gi, content: ['WebM', ExtensionType.Video] },
  m3u8: { regex: /m3u8/gi, content: ['M3U8', ExtensionType.Video] },
  m2ts: { regex: /m2ts/gi, content: ['M2TS', ExtensionType.Video] },
  mts: { regex: /mts/gi, content: ['MTS', ExtensionType.Video] },
  ts: { regex: /ts/gi, content: ['TS', ExtensionType.Video] },
  vob: { regex: /vob/gi, content: ['VOB', ExtensionType.Video] },
  m2v: { regex: /m2v/gi, content: ['M2V', ExtensionType.Video] },

  // Audio extensions
  mp3: { regex: /mp3/gi, content: ['MP3', ExtensionType.Audio] },
  wav: { regex: /wav/gi, content: ['WAV', ExtensionType.Audio] },
  flac: { regex: /flac/gi, content: ['FLAC', ExtensionType.Audio] },
  aac: { regex: /aac/gi, content: ['AAC', ExtensionType.Audio] },
  m4a: { regex: /m4a/gi, content: ['M4A', ExtensionType.Audio] },
  ogg: { regex: /ogg/gi, content: ['OGG', ExtensionType.Audio] },

  // Subtitle extensions
  ass: { regex: /ass|ssa/gi, content: ['ASS / SSA', ExtensionType.Subtitle] },
  srt: { regex: /srt/gi, content: ['SRT', ExtensionType.Subtitle] },
  vtt: { regex: /vtt/gi, content: ['VTT', ExtensionType.Subtitle] },

  // Image extensions
  jpg: { regex: /jpg|jpeg/gi, content: ['JPG', ExtensionType.Image] },
  png: { regex: /png/gi, content: ['PNG', ExtensionType.Image] },
  gif: { regex: /gif/gi, content: ['GIF', ExtensionType.Image] },
  bmp: { regex: /bmp/gi, content: ['BMP', ExtensionType.Image] },
  tif: { regex: /tif/gi, content: ['TIF', ExtensionType.Image] },
  tiff: { regex: /tiff/gi, content: ['TIFF', ExtensionType.Image] },
  webp: { regex: /webp/gi, content: ['WEBP', ExtensionType.Image] },
  ico: { regex: /ico/gi, content: ['ICO', ExtensionType.Image] },
  svg: { regex: /svg/gi, content: ['SVG', ExtensionType.Image] },
  avif: { regex: /avif/gi, content: ['AVIF', ExtensionType.Image] },

  // Archive extensions
  zip: { regex: /zip/gi, content: ['ZIP', ExtensionType.Archive] },
  rar: { regex: /rar/gi, content: ['RAR', ExtensionType.Archive] },
  '7z': { regex: /7z/gi, content: ['7Z', ExtensionType.Archive] },
  tar: { regex: /tar/gi, content: ['TAR', ExtensionType.Archive] },
  gz: { regex: /gz/gi, content: ['GZ', ExtensionType.Archive] },
  bz2: { regex: /bz2/gi, content: ['BZ2', ExtensionType.Archive] },
  xz: { regex: /xz/gi, content: ['XZ', ExtensionType.Archive] },
  zst: { regex: /zst/gi, content: ['ZST', ExtensionType.Archive] },
  lz: { regex: /lz/gi, content: ['LZ', ExtensionType.Archive] },

  // Document extensions
  pdf: { regex: /pdf/gi, content: ['PDF', ExtensionType.Document] },
  doc: { regex: /doc|docx/gi, content: ['Word', ExtensionType.Document] },
  xls: { regex: /xls|xlsx/gi, content: ['Excel', ExtensionType.Document] },
  ppt: { regex: /ppt|pptx/gi, content: ['PowerPoint', ExtensionType.Document] },
  txt: { regex: /txt/gi, content: ['TXT', ExtensionType.Document] },
  md: { regex: /md/gi, content: ['MD', ExtensionType.Document] },
  html: { regex: /html/gi, content: ['Web', ExtensionType.Document] },
  xml: { regex: /xml/gi, content: ['XML', ExtensionType.Document] },
  json: { regex: /json/gi, content: ['JSON', ExtensionType.Document] },
  csv: { regex: /csv/gi, content: ['CSV', ExtensionType.Document] },
  yml: { regex: /yml|yaml/gi, content: ['YAML', ExtensionType.Document] },
  ini: { regex: /ini/gi, content: ['INI', ExtensionType.Document] },
  cfg: { regex: /cfg/gi, content: ['CFG', ExtensionType.Document] },
  log: { regex: /log/gi, content: ['Log', ExtensionType.Document] },

  // Seed extensions
  torrent: { regex: /torrent/gi, content: ['BitTorrent', ExtensionType.Seed] },
};
