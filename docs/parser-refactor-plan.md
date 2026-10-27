# FileNameParser 重构方案（草案）

> 状态：已完成（§8 各步骤已全部落地；build / lint / 530 个测试全部通过）。
> 配套文件：
> - 语料库 `fixtures/dmhy-corpus.ts`（87 条精选标注，2026-10 采集）
> - 历史用例迁移 `fixtures/legacy-corpus.ts`（旧 spec 61 条，新契约标注）
> - 原始采集语料 `.corpus-raw/`（约 290 条，gitignore，仅作扩库参考）
> - 基线脚本 `.corpus-baseline.ts`（旧实现跑分用，已完成验收并删除）

## 1. 定位：保底正则解码器

FileNameParser 的职责边界：

- **当更可靠的信息源不可用时**（TMDB/Bangumi 匹配失败、离线、网络异常、
  小众番无条目、种子内文件名与站点标题不一致等），用纯代码逻辑 + 正则 +
  词典，从标题字符串中**尽力**提取元数据。
- 它不是权威数据源。因此其输出必须带 **可信度/来源标记**，上层可以据此
  决定是否回退到人工确认或仅使用部分字段。
- 与 metadata 源的关系：metadata 命中时，本解析器的输出仅作交叉校验或丢弃。

## 2. 现状问题（基于实测与代码审查）

| # | 问题 | 证据 |
|---|------|------|
| 1 | **输出契约混乱**：`parseFilename` 同时返回 `number`、`number[]`、`string`、`null`，spec 期望字符串（'01-13'），实现返回数组 `[1,13]` | 现有 61 个测试 53 个失败，大量为 `expected '01-13', received [1,13]` 纯类型分歧 |
| 2 | **单份逻辑复制两份**：`parseFilename` 的正则阶梯是 `aniep` 的魔改拷贝，`findEpisodeIndex` 又调用 `aniep` 本身 | `node_modules/aniep/src/index.js` 与 `filenameparser.service.ts` 对比 |
| 3 | **正则阶梯脆弱**：约 40 个顺序相关、first-match-wins 的正则，清理阶段删错数字后，后续兜底正则会匹配到错误的数（如 `'01-13'` → `[1,12]`） | 现有 spec 15 例返回 `[1,12]` |
| 4 | **块级信息丢失**：清理过程把整个标题打平成字符串，丢失了 `[]`/`【】`/`()` 块边界；`parseTitle/parseFirstBlockToGroup` 又与 `parseFilename` 各做各的切片 | 代码结构 |
| 5 | **无集数/特殊类型混淆**：`全集/Fin/修正合集` 与 `OVA/SP/EX/剧场版` 形态没有统一的类型判定 | 现有 spec 6 例误返回 null |
| 6 | **单集样本缺失**：现有 spec 全部是范围/整季用例 | 用户确认；dmhy 周更主力形态是单集 |
| 7 | 无用代码与死代码：`ExtentionDictionary`（拼写有误）零引用、`garbageCleaner`/`parseTitle` 备用方案被注释 | 代码审查 |

**好消息**（基线实测）：最常见单集形态（`- 03`、`EP03`、`[03]`）现有实现
7/7 正确——主干逻辑可保留，问题集中在契约、范围集数、特殊类型与块结构。

### 2.1 语料实测基线（旧实现 vs dmhy-corpus，87 条精选标注 + 337 条原始语料）

**整体 49/87 通过（56%）**。按集数形态分类（季度/内容类型为正交维度，不参与 category）：

| 分类 | 通过率 | 主要失败原因 |
|---|---|---|
| single（38） | 30/38 (79%) | 集数本身全对；失败全在组名提取（横幅【2026秋季日剧】、【搬运】前缀、繁简异体「雪飄/雪飘」、词典缺中文别名） |
| season（30） | 7/30 (23%) | **重灾区**：`[01-12 合集]` 清理掉「合集」后落进宽泛兜底正则 `\[(\d{1,4})[ _-].+?]`，退化为单集 1；`S05 \| 01-13` 管道、`总第67~85`、`01~12(完)` ★、点分格式均失败 |
| collection（12） | 7/12 (58%) | `合集9` 藏品号误报 9；`53yrs ago - [1973-2009]` 误报 53；TV全集+OAD/SP 混装旧实现按范围返回 |
| movie（4） | 3/4 | 点分格式电影 null |
| noEpisode（3） | 2/3 | — |

**单集形态全部正确**（`- 03`、`EP03`、`[03]`、`[49]`、`[1357]`、`EP03.5` 小数集、
`S02E03`）——集数主干可保留。

**组名提取失败根因（10 条语料佐证）**：
1. 首块 `【2026秋季日剧】`/`【合集】`/`【2026春季日剧SP】`/`[搬运]` 横幅被当成发布组；
2. GroupDictionary 正则无词边界，`Prejudice-Studio` 被 `/CE/` 误配成「CE家族社」；
3. 繁简异体（雪飄 vs 雪飘）、装饰符号（`❀拨雪寻春❀` 缺中文别名）导致词典漏配。

**旧 spec 61 用例的重新解读**（迁移到新契约后重跑）：
- 旧契约下 53/61 失败；**新契约（结构化数字）下 44/61 通过**——
  即约 36 条失败是纯 string/number[] 类型分歧，**契约修正本身就是最大单项收益**。
- 剩余 17 条是真实解析错误（`[01-12 合集]` 退化单集 1 等），与 dmhy 语料失败模式重合。
- 历史用例已全部迁入 `fixtures/legacy-corpus.ts`（season 41/58、single 3/3）。

**两套语料合计 148 条：旧实现 93/148（63%），新解析器 148/148（100%）** —— 起点与当前进展。

> 分类口径（v3，已修正）：`category` 只描述集数形态（single/season/collection/movie/
> noEpisode），互斥；季度放 `expect.season`、内容类型放 `expect.episodeType`。
> v3 变更：`range` 改名 `season`（整季/连续集数范围，全话/全集/Fin 无数字也归 season）；
> `noEpisode` 收窄为「单部 OVA/OAD/SP 特番（无法归类到具体集数）+ 无法分类负样本」；
> 「TV全集+OAD/SP/OVA/剧场版」混装从 season 归入 collection。


## 3. 目标契约（新 API）

```ts
type EpisodeRef =
  | { kind: 'single'; no: number }
  | { kind: 'range'; from: number; to: number }
  | { kind: 'dual'; nos: number[] }   // 同一集的双编号
  | null;

interface ParsedTitle {
  raw: string;
  /** 发布组/字幕组 */
  group: { raw: string; name: string }[];
  /** 标题：按语言拆分；zh 优先 */
  title: { zh?: string; romaji?: string; jp?: string; others: string[] };
  season: number | null;
  year: number | null;
  episode: EpisodeRef;
  episodeType: 'TV' | 'OVA' | 'OAD' | 'SP' | 'EX' | 'Movie' | 'Special' | null;
  /** 媒体规格：从 specs 块尽力提取，全部可空；多版本去重 + 画质/字幕选择用 */
  release: {
    source: 'WebRip' | 'BDRip' | 'WEB-DL' | 'DVDRip' | 'HDTVRip' | 'Remux' | 'TV' | null;
    resolution: '2160p' | '1080p' | '720p' | '480p' | '4K' | '2K' | null;
    videoCodec: 'HEVC' | 'AVC' | 'AV1' | 'H264' | 'H265' | 'X264' | 'X265' | null;
    audioCodec: 'AAC' | 'FLAC' | 'AC3' | 'EAC3' | 'OPUS' | 'DTS' | null;
    bitDepth: 8 | 10 | 12 | null;
    container: 'MKV' | 'MP4' | 'TS' | 'M2TS' | null;
    subtitle: { style: '内嵌' | '内封' | '外挂' | '无字幕' | null; langs: string[] };
    version: string | null;   // v2 / v3 / Rev / Reseed / 修正合集
    station: string | null;   // Baha / AT-X / ViuTV / Crunchyroll / Netflix ...
  };
  source: 'regex' | 'regex+files'; // 是否结合了文件结构信号
  confidence: number;              // 0-1，供上层决策
}
```

**解析入口（两个输入上下文）**：

```ts
// 阶段一：搜索时只有标题（尚无文件结构）
parse(title: string): ParsedTitle;               // source='regex'，confidence 偏低

// 阶段二：磁力解析后拿到文件列表（WebTorrent filesList）
parse(title: string, files: MagnetFile[]): ParsedTitle; // source='regex+files'
```

`files` 即 `TorrentTransformerService.parseMagnet` 已返回的 `filesList`
（`{ name, length }[]`）——**现有下载链路已经在产生这份数据，只是没喂给解析器**。
标题无法判定的条目（语料中「尖帽子的魔法工房」这类无任何集数/全话/合集标记的），
正是靠文件结构消歧的典型场景。

关键决策：**集数永远输出数字**。`'01-13'` 这类字符串由格式化函数
（Jellyfin 命名层）生成，解析器不再输出字符串。

**为什么要 `release`（媒体规格）**：标题的 specs 块信息量很大（见语料，如
`[WebRip 1080p HEVC-10bit AAC][简繁内封字幕]`、`[Baha][WEB-DL][AAC AVC][CHT][MP4]`），
且高度结构化。Jellyfin 整理的两类决策都依赖它：
1. **多版本去重**：同一集多个组发布时，选一个保留（1080p HEVC 内封 > 720p x264 内嵌）；
2. **入库归类**：按来源/分辨率/字幕风格过滤（只收 BDRip、只要外挂字幕等）。

设计原则（与 episode/season 的"必须准确"不同）：
- `release` 是 **best-effort**：提取不到就 null，绝不臆造；
- 全部来自 specs 块的词典/正则，信号强、成本低（Classifier 阶段已打 specs 标签）；
- 可与文件结构交叉验证（文件扩展名 ↔ container、文件大小 ↔ 分辨率/码率）。


## 4. 流水线架构（每阶段独立可测）

```
raw title
  → 1) Normalizer     全半角/括号统一、去尾随空白、剥扩展名
  → 2) Tokenizer      切分为 Block[]（[...] / 【...】 / (...) / 裸文本），
                      记录每个 block 的 index/length/content（复用现有 groupIndex 思路）
  → 3) Classifier     对每个 block 打标签：group / title / episode / specs /
                      season / year / type / junk（词典 + 规则）
  → 4) Extractor      按标签组合产出结构化字段：
                        · group：GroupDictionary 命中 → parsedName；未命中保留原文
                        · title：episode block 之前的 title blocks 按 `/`、空格切多语言
                        · episode：高置信模式优先，aniep 兜底，归一化为 EpisodeRef
                        · season/year/type：从带标签 block 提取
  → 5) PostProcessor  纠错（年份 vs 集数冲突、junk 过滤、confidence 计算）
```

### 4.1 Normalizer

- 全角→半角（`（）【】０-９` 等），但保留中日字符。
- 统一括号变体不删除，交给 Tokenizer。
- 剥扩展名：`/(?:\.mp4|\.mkv|\.ass|\.7z)+$/`（不只是视频）。

### 4.2 Tokenizer

- 扫描括号对，产出有序 block 列表；裸文本段按 ` - `、` ` 软切分但保留片段。
- 每个 block：`{ kind: 'bracket'|'bare', content, index, length }`。

### 4.3 Classifier（按优先级）

0. **banner/junk 先行识别**：`【20xx春/夏/秋/冬(新番|日剧)】`、`【合集】`、`【生】`、
   `【附日字】` 等横幅与尾注先标记为 junk，永不参与 group/title 判定
   （基线中组名失败有 7 条是首块横幅被当成发布组，另有 `[搬运]` 前缀）。
1. **group**：紧邻 title 之前的 `[...]` 块命中 GroupDictionary → group；
   词典未命中但像组名（大写拉丁/组名特征、无句读空格）→ group(raw)。
2. **episode**：块内匹配高置信模式表（见 4.4），全标题首个命中者胜出。
3. **specs**：块内匹配 specs 词典（分辨率/编码/字幕/来源/容器），标 specs。
4. **season**：`S2|S02|第2季|第二季|2nd Season|Season 2|シーズン2` 等。
5. **year**：`(19xx|20xx)` 且位于 title 块内；注意 `NNNN-NNNN` 年份范围
   与集数范围的区分（点分格式语料）。
6. **type**：`OVA|OAD|SP|EX|番外|特典|剧场版|Movie|NCOP|NCED|Menu|Preview`。
7. **junk**：`招募|字幕组招人|检索[:：]|网盘|附.{0,4}日字` 等。

### 4.4 Episode 高置信模式表（顺序即优先级）

| 优先级 | 形态 | 示例 |
|---|---|---|
| 1 | ` - NN(.N) - ` / ` - NN(.N) [specs]`（裸文本块尾部） | `- 03 [WebRip...]` |
| 2 | `[NN(.N)]` 独立括号块 | `[03][1080P]` |
| 3 | `EPNN` / `Episode NN` | `EP03` |
| 4 | `第NN话/集/話/回/夜/弾`（含中文数字） | `第三話` |
| 5 | `SxxEyy` | `S02E03` |
| 6 | `NN-NN`（含 Fin/END/完/合集 语境） | `01-13 Fin` |
| 7 | `全NN集/全NN話` | `全08集` |
| 8 | aniep（兜底，数值归一化） | 双编号、小数集等 |

### 4.5 归一化（aniep 输出 → EpisodeRef）

- `number` → `{ kind:'single', no }`
- `[a, b]` → `{ kind:'range', from:min, to:max }`
- `'a|b'` → 拆两数 → `{ kind:'dual', nos:[a,b] }`（若 a 与 b 是同一集双编号）；
  无法判定时降级为 range？不——语义不同，双编号是两个计数体系下同一集，
  Jellyfin 场景取"主编号"（前一个）。语料里用 `dual` 标注，落盘时由上层决定。

### 4.6 文件结构信号（多模态增强，回答"标题看不出分类"）

标题本身无法判定时，用 torrent 内的**文件列表**消歧。信号（按可信度排序）：

1. **文件数量**：1 个视频文件 → single/movie；N 个视频文件（N>1）→ season；
   混合扩展名（视频+音频+图片/压缩包）→ collection/整理搬运。
2. **扩展名分布**：直接复用现成的 `ExtentionDictionary`（改名后）——
   仅视频扩展名 → single/season；出现 Audio/Image/Archive/Document → collection。
3. **文件内命名**：逐文件跑一遍 episode 提取（`EP01`、`S01E01`、`[01]`、
   `01.mkv` 等），得到"文件级集数序列"；这比标题更可靠，可覆盖/纠偏标题结论。
4. **交叉验证**：标题的集数范围 vs 文件数/文件集数序列比对，不一致时降 confidence。

集成方式（非侵入式）：作为 `parse(title, files)` 的**后置增强**，不改动
标题解析流水线本身；`files` 缺失时退化为纯标题解析。这正好复用
`TorrentTransformerService` 已产出的 `filesList`，并首次用上 `ExtentionDictionary`。

典型收益：
- 尖帽子的魔法工房（标题无任何标记）：文件数=1 → single；=12 → season；
  含 jpg/flac 混装 → collection。
- 标题误判兜底：标题说 `01-12 合集` 但文件只有 1 个 → 按文件修正为 single。


## 5. aniep 的去留

**保留为兜底（阶段 8），但停止魔改复制**：

- 直接调用 `aniep()`，将输出归一化为 EpisodeRef；其未覆盖/已知误判形态
  由我们自己的 1-7 级规则先行拦截，aniep 只处理剩下的长尾。
- aniep 已知弱点（其 README 自述）：`Vol.06 CM_02`→2、`Ep12_Creditless_ED`→12、
  `25_OVA1`→'1|25'——这些必须由我们的 type 识别（CM/Menu/ED 块判定为 special）
  在 aniep 之前截断。

## 6. 词典策略

- `GroupDictionary` 保留并继续扩充（语料中未收录的组名反哺词典）。
- `ExtentionDictionary` 改名 `ExtensionDictionary`，双用途：① 接入 Classifier 的 specs 识别；
  ② 文件结构信号的扩展名分布判断（§4.6）；另建 specs 词典（分辨率/编码/字幕/来源）。
- 词典查找统一走一个 `DictionaryService`（现 `Object.entries(...).find` 的 O(n) 扫描
  对 100+ 条目每次全扫，无碍但可索引化）。

## 7. 测试与语料策略

- `fixtures/dmhy-corpus.ts`：分类、带标注的真实标题（87 条，2026-10 采集，见文件头契约约定）。
- `fixtures/legacy-corpus.ts`：旧 spec 61 条历史用例，已按新契约迁移标注。
- `fixtures/raw-corpus.ts`：337 条全量语料（由 `.corpus-raw/` 生成），`raw-corpus.regression.spec.ts`
  做「集数形态」级断言（single/season/collection/movie/noEpisode）。
- spec 重写为两套：
  1. **corpus spec**：`test.each([...dmhyCorpus, ...legacyCorpus])` 全量跑新契约；
  2. **unit spec**：每个 stage（Normalizer/Tokenizer/Classifier/Extractor）各自用例。
- CI 已跑 `test-ci`，corpus 增长后需关注耗时（纯正则，可接受）。

## 8. 实施步骤（PR 划分建议）

1. ~~**语料先行**：corpus 文件 + 现有用例迁移 + 旧实现基线量化~~ **✅ 已完成**
   （两套语料 148 条；旧实现 93/148）。
2. ~~**契约与骨架**：定义 `EpisodeRef/ParsedTitle`，替换 `VanAnimeMetaData` 输出层；
   实现 Normalizer + Tokenizer（不改解析行为）~~ **✅ 已完成**
3. ~~**Classifier/Extractor**：按 4.3/4.4 规则实现，aniep 兜底~~ **✅ 已完成**
   （新解析器 corpus 回归 148/148；组名 78/78；`corpus.regression.spec.ts` 已入 CI）。
4. ~~**文件结构增强（§4.6）**：`parse(title, files?)` 双入口；文件数量/扩展名分布/
   文件内命名 → 消歧与 confidence 修正；复用 `TorrentTransformerService.filesList`
   与 `ExtensionDictionary`~~ **✅ 已完成**
   （`file-signals.ts` FileSignalAnalyzer；混合内容→合集、文件级集数补全/校验）。
5. ~~**集成**：接入 magnet/query 工作流与 Jellyfin 命名层；删除旧 `parseFilename`
   与调试 controller~~ **✅ 已完成**
   （MagnetService.parseMagnet 回传 parsedTitle；QueryService 搜索结果附带解析；JellyfinNamer；
   旧 service/spec/controller/VanAnimeMetaData 已删）。

## 9. 未决问题（待讨论）

- `dual` 编号在 Jellyfin 命名时取哪个编号？（建议取语料中标注的"主编号"即第一个）
- `(检索：第二季)` 这类尾部注记是否算 season 证据？（建议算，但 confidence 打折）
- confidence 的计算口径：命中规则层级 + 词典命中 + junk 比例，需要一个简单可解释公式。
