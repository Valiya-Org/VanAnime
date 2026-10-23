/** 从视频文件名提取集数：SxxEyy / EPnn / [nn] / - nn / ^nn */
export function episodeOfFileName(name: string): number | null {
  const base = (name.split(/[\\/]/).pop() ?? name).replace(/\.[a-z0-9]+$/i, '');

  // SxxEyy（如 Show.S01E03.mkv）
  let m = base.match(/S\d{1,2}E(\d{1,4})/i);
  if (m) return +m[1];
  // EPnn / Ep.nn（如 Show EP03.mkv）
  m = base.match(/\bEP?\s*\.?\s*(\d{1,4})\b/i);
  if (m) return +m[1];
  // [nn] / - nn / _nn / (nn)：要求数字后不再接数字，避免把 1080p 的 1080 当集数
  m = base.match(/[([\s_-](\d{1,4})(?:[\])}\s_]|$)/);
  if (m) return +m[1];
  // 纯数字开头（如 03.mkv）
  m = base.match(/^(\d{1,4})/);
  if (m) return +m[1];
  return null;
}
