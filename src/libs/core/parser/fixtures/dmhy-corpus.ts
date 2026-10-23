/**
 * VanAnime 文件名解析器 — dmhy 真实标题语料库
 *
 * 数据来源：动漫花园 (https://share.dmhy.org) RSS 与列表页，采集于 2026-10。
 * 本语料用于 filenameparser 的 spec 测试与回归基线。
 *
 * 分类（category）只描述「集数形态」，且互斥；季度/内容类型是正交维度，放 expect 里：
 *   - single     单集发布（周更主力形态，本语料重点补齐的部分）
 *   - season     整季/连续集数范围（一部番：01-12、全26话、Fin 等；纯 TV 或多集 OAD 的连续范围）
 *   - collection 合集/整理搬运/混合大包（TV全集+OAD/SP/OVA/剧场版、整理搬运、多季混装，
 *                无法用一个集数表达）→ episode 恒为 null
 *   - movie      剧场版/电影（含多部剧场版合集）
 *   - noEpisode  单部 OVA/OAD/SP 特番（无法归类到具体集数）及无法分类的负样本
 *
 * 季度信息 → expect.season（S2/第二季/II…）；内容类型 → expect.episodeType（OVA/OAD/SP/EX/Movie）
 *
 * 期望值约定（新解析器目标契约）：
 *   episode 一律输出结构化数字：
 *     { kind: 'single', no: 3 }                 单集
 *     { kind: 'range', from: 1, to: 13 }        范围
 *     { kind: 'dual', nos: [9.5, 21.5] }        同一集的双编号（不同计数体系）
 *     null                                      识别不出/确实没有集数
 *   字符串形态（如 '01-13'）只由格式化层生成，解析器不再直接输出字符串，
 *   以根治当前实现与 spec 之间 number[] vs string 的类型分歧。
 */

export type EpisodeExpect =
  | { kind: 'single'; no: number }
  | { kind: 'range'; from: number; to: number }
  | { kind: 'dual'; nos: number[] }
  | null;

export type CorpusCategory =
  'single' | 'season' | 'collection' | 'movie' | 'noEpisode';

export interface CorpusEntry {
  /** 原始标题，一字不差 */
  raw: string;
  /** 集数形态分类 */
  category: CorpusCategory;
  /** 期望解析结果 */
  expect: {
    episode: EpisodeExpect;
    /** 期望的发布组名（与 GroupDictionary 的 content 对应；词典未收录的组填原始名） */
    group?: string;
    /** 期望季度（正交于 category） */
    season?: number | null;
    /** 期望年份 */
    year?: number | null;
    /** 期望的内容类型（OVA/OAD/SP/EX/Movie） */
    episodeType?: 'OVA' | 'OAD' | 'SP' | 'EX' | 'Movie' | null;
  };
  /** 人工标注备注（陷阱点说明等） */
  note?: string;
}

export const dmhyCorpus: CorpusEntry[] = [
  // ============ single：单集（周更主力形态） ============
  {
    raw: '[LoliHouse] 兽王武神丹帝拜恩 / Juuou Mujin Dandivine - 03 [WebRip 1080p HEVC-10bit AAC][简繁内封字幕]',
    category: 'single',
    expect: { episode: { kind: 'single', no: 3 }, group: 'LoliHouse' },
    note: '中/英双标题，`- 03` 单集',
  },
  {
    raw: '[LoliHouse] 魔法骑士雷阿斯 / Magic Knight Rayearth (2026) - 03 [WebRip 1080p HEVC-10bit AAC][简繁内封字幕]',
    category: 'single',
    expect: {
      episode: { kind: 'single', no: 3 },
      group: 'LoliHouse',
      year: 2026,
    },
    note: '陷阱：标题内嵌年份 (2026) 位于集数之前',
  },
  {
    raw: '[LoliHouse] 归还者的魔法要特别 / 重生者的魔法一定要特别 / Kikansha no Mahou wa Tokubetsu desu - 15 [WebRip 1080p HEVC-10bit AAC][简繁内封字幕](检索：第二季)',
    category: 'single',
    expect: {
      episode: { kind: 'single', no: 15 },
      group: 'LoliHouse',
      season: 2,
    },
    note: '陷阱：季度信息藏在尾部 `(检索：第二季)` 注记中；双中文译名 + 罗马音 + 英文四标题',
  },
  {
    raw: '[ANi] FX Senshi KURUMICHAN /  FX 戰士久留美 - 04 [1080P][Baha][WEB-DL][AAC AVC][CHT][MP4]',
    category: 'single',
    expect: { episode: { kind: 'single', no: 4 }, group: 'ANi' },
    note: 'ANi 自动发布格式，标题内有两个连续空格',
  },
  {
    raw: '【2026秋季日剧】[MagicStar] 我与你在一起的理由 第二季 / 私があなたといる理由2 EP03 [WEBDL] [1080p] [AMZN]【生】',
    category: 'single',
    expect: {
      episode: { kind: 'single', no: 3 },
      group: 'MagicStar',
      season: 2,
    },
    note: '陷阱：前缀横幅【2026秋季日剧】；标题本体含 `理由2` 的 2 与 `第二季`；EP03 单集',
  },
  {
    raw: '[三明治摆烂组&LoliHouse] 乱世千金倪亚·利斯顿转生为娇弱千金的弑神武人华丽无双录 / Kyouran Reijou Nia Liston - 03 [WebRip 1080p HEVC-10bit AAC][简繁日内封字幕]',
    category: 'single',
    expect: {
      episode: { kind: 'single', no: 3 },
      group: '三明治摆烂组&LoliHouse',
    },
    note: '超长中文标题；联合发布组',
  },
  {
    raw: '[三明治摆烂组] 亂世千金倪亞·利斯頓轉生為嬌弱千金的弒神武人華麗無雙錄 / Kyouran Reijou Nia Liston / 凶乱令嬢ニア・リストン - 03 - [繁日內嵌][WebRip AVC 8bit 1080P]',
    category: 'single',
    expect: { episode: { kind: 'single', no: 3 }, group: '三明治摆烂组' },
    note: '`- 03 -` 双横杠形态；繁体+日文三标题',
  },
  {
    raw: '[三明治摆烂组] 乱世千金倪亚·利斯顿转生为娇弱千金的弑神武人华丽无双录 / Kyouran Reijou Nia Liston / 凶乱令嬢ニア・リストン - 03 - [简日内嵌][WebRip AVC 8bit 1080P]',
    category: 'single',
    expect: { episode: { kind: 'single', no: 3 }, group: '三明治摆烂组' },
  },
  {
    raw: '【2026秋季日剧】[MagicStar] 溺爱男友养成法 ~从性到成为真爱女孩的故事~ / 溺愛カレシの作り⽅ ~セから本命になる⼥の⼦の話~ EP04 [WEBDL] [1080p] [U-NEXT]【生】【附EP03日字】',
    category: 'single',
    expect: { episode: { kind: 'single', no: 4 }, group: 'MagicStar' },
    note: '陷阱：尾部【附EP03日字】中的 EP03 是附属内容，不是本集数',
  },
  {
    raw: '[绿茶字幕组&LoliHouse] 描绘直至生命尽头 / 画完这个就去死 / 畫完這個再去死 / これ描いて死ね / Kore Kaite Shine - 08 [WebRip 1080p HEVC-10bit AAC][简繁日内封字幕]',
    category: 'single',
    expect: {
      episode: { kind: 'single', no: 8 },
      group: '绿茶字幕组&LoliHouse',
    },
    note: '简繁中日五标题；联合发布组（绿茶字幕组不在现有词典中）',
  },
  {
    raw: '[桜都字幕组] FX战士久留美 / FX Senshi Kurumi-chan [03][1080P][简繁内封]',
    category: 'single',
    expect: { episode: { kind: 'single', no: 3 }, group: '桜都字幕组' },
    note: '`[03]` 括号式单集，无 `-`',
  },
  {
    raw: '【悠哈璃羽字幕社】[死神 千年血战篇 祸进谭]/ [Bleach Thousand Year Blood War][49][x264 1080p][CHS][简体内嵌]',
    category: 'single',
    expect: { episode: { kind: 'single', no: 49 }, group: '悠哈璃羽字幕社' },
    note: '`】[` 紧邻 + `/ ` 分隔的双标题块 + 末尾 `[49]` 单集；组名为词典收录的 UHA-WING',
  },
  {
    raw: '【2026秋季日剧】[MagicStar] 假面教师 ~从妻子离世的那天起 / 仮面教師 ~妻を亡くしたその日から EP03 [WEBDL] [1080p] [HULU]【生】【附日字】',
    category: 'single',
    expect: { episode: { kind: 'single', no: 3 }, group: 'MagicStar' },
  },
  {
    raw: '【2026秋季日剧】[MagicStar] 经验派护士 ~数字化到底是什么啊!?~ / アナログナース ~デジタルってなんなんだよ!?~ EP01 [WEBDL] [1080p] [TELASA]【生】【附日字】',
    category: 'single',
    expect: { episode: { kind: 'single', no: 1 }, group: 'MagicStar' },
    note: '标题本体含 `!?`、`~` 等符号',
  },
  {
    raw: '【2026秋季日剧】[MagicStar] 小麦与黄油与复仇 / 小麦とバターと復讐と EP03 [WEBDL] [1080p] [FOD]【生】【附日字】',
    category: 'single',
    expect: { episode: { kind: 'single', no: 3 }, group: 'MagicStar' },
  },

  // ============ noEpisode：无集数（一部番整季/全话） ============
  {
    raw: '【合集】【2026秋季网络日剧】[MagicStar] 有人刚好提起我吗？ / 俺のこと、なんか言ってた？ [WEBDL] [1080p] [Netflix]【生】【附官方日英简繁中字幕】',
    category: 'season',
    expect: { episode: null, group: 'MagicStar' },
    note: '【合集】前缀但无任何集数数字（单剧整季打包）',
  },
  {
    raw: '【ASMR】毫不留情榨取雜魚的雙子蘿莉魅魔♪[WAV/MP3]',
    category: 'noEpisode',
    expect: { episode: null },
    note: '负样本：非番剧内容（ASMR），解析器应识别为无集数/不可解析，不应臆造集数',
  },
  {
    raw: '[云光字幕组] 二十世纪电气目录 Nijuuseiki Denki Mokuroku [合集][简体双语][1080p]招募翻译',
    category: 'season',
    expect: { episode: null, group: '云光字幕组' },
    note: '陷阱：`[合集]` 无数字；标题含中文数字 `二十世纪`；尾部 `招募翻译` 垃圾词',
  },
  {
    raw: 'イリヤの空、UFOの夏 全話+おまけ(640*480 AVI)',
    category: 'season',
    expect: { episode: null },
    note: '陷阱：`全話` 无数字；`640*480` 分辨率',
  },
  {
    raw: '[H-Enc] 尖帽子的魔法工房 / Tongari Boushi no Atelier (BDRip 1080p HEVC FLAC)',
    category: 'noEpisode',
    expect: { episode: null, group: 'H-Enc' },
    note: '无法从标题确认集数形态，需结合文件结构比对（人工勘误：归 noEpisode 占位）',
  },
  {
    raw: '[冷番补完字幕组][东海道四谷怪谈 此恨岂能消][東海道 四谷怪談 このうらみはらさでおくべきか][2000][OVA][480p][内封简繁中字]',
    category: 'noEpisode',
    expect: {
      episode: null,
      group: '冷番补完字幕组',
      year: 2000,
      episodeType: 'OVA',
    },
    note: '独立年份块 [2000] + OVA 块，单部 OVA 作品但无集数',
  },
  {
    raw: '【2026春季日剧SP】[MagicStar] 告别医院2 / お別れホスピタル2 Part.1 [WEBDL] [1080p] [NHKP]【生】【附日字】',
    category: 'noEpisode',
    expect: { episode: null, group: 'MagicStar', episodeType: 'SP' },
    note: '陷阱：标题 `医院2` 的 2 是剧名；`Part.1` 是 SP 分篇，无集数',
  },

  // ============ movie：剧场版/电影 ============
  {
    raw: '三国志动画电影1-2.Sangokushi 1-2.1985-1986.双日语.简体+繁体+日文+英文字幕.NFLX.WEBrip.1080P.H264.2×Audio.7×Sub-ZF(附第一部V2修正字幕版)',
    category: 'movie',
    expect: {
      episode: { kind: 'range', from: 1, to: 2 },
      year: 1985,
      episodeType: 'Movie',
    },
    note: '陷阱：点分格式；`1-2` 是电影序号、`1985-1986` 是年份范围；2×Audio 含 `×` 与数字',
  },
  {
    raw: '[GM-Team][国漫][仙逆剧场版 弑仙之战][Renegade Immortal Slaying the Blood Progenitor][Movie][2026][HEVC][GB][4K]',
    category: 'movie',
    expect: {
      episode: null,
      group: 'GM-Team',
      year: 2026,
      episodeType: 'Movie',
    },
  },
  {
    raw: '【喵萌奶茶屋】★剧场版★[绽放于巴黎之星 / 绽放的巴黎之星 / パリに咲くエトワール / Paris ni Saku Etoile][1080p][简日双语]',
    category: 'movie',
    expect: { episode: null, group: '喵萌奶茶屋', episodeType: 'Movie' },
  },
  {
    raw: '[漫游字幕组] 福音战士新剧场版合集 EVANGELION 1.11 / 2.22 / 3.333 / 3.0+1.11 UHDrip 2160p 简中内嵌',
    category: 'movie',
    expect: { episode: null, group: '漫游字幕组', episodeType: 'Movie' },
    note: '陷阱：`1.11/2.22/3.333/3.0+1.11` 是版本号不是集数；多部剧场版合集',
  },

  // ============ collection：合集/整理搬运/混合大包 ============
  {
    raw: '[VCB-Studio] 关于我转生变成史莱姆这档事 / Tensei Shitara Slime Datta Ken / 転生したらスライムだった件 10-bit 1080p HEVC BDRip [S1 Reseed + OAD Reseed + S2 Reseed + MOVIE + WEB + S3]',
    category: 'collection',
    expect: { episode: null, group: 'VCB-Studio' },
    note: '混合大包：S1+S2+S3+MOVIE+WEB 混装，无统一集数',
  },
  {
    raw: '[VCB-Studio] 邻座的怪同学 / Tonari no Kaibutsu-kun / となりの怪物くん 10-bit 1080p HEVC BDRip [S1 + OAD Fin]',
    category: 'collection',
    expect: { episode: null, group: 'VCB-Studio' },
    note: 'TV(S1) + OAD 混装，无单一集数',
  },
  {
    raw: '美少女战士合集9.Sailor Moon Collection Part 9 录像视频合集 (附Part 7合集)',
    category: 'collection',
    expect: { episode: null },
    note: '陷阱：`合集9` 的 9 是藏品分册号，不是集数；粉丝整理合集',
  },
  {
    raw: '53yrs ago - [1973-2009] Casshan_再造人卡夏(新造人間キャシャーン)_TV.OVA.実写映画',
    category: 'noEpisode',
    expect: { episode: null },
    note: '陷阱：`1973-2009` 是年份范围不是集数；TV+OVA+实写电影混装（人工勘误：归 noEpisode）',
  },
  {
    raw: '[肥猫压制][FatCatRAW][飞女刑警3少女忍法帖传奇][TV+SP][1080P][HDTVRIP]',
    category: 'collection',
    expect: { episode: null, group: '肥猫压制' },
    note: 'TV+SP 混装合集，无单一集数',
  },
  {
    raw: '[整理搬运] 青出于蓝 / 青蓝姻缘 / 未婚关系 (藍より青し) (Ai Yori Aoshi)：TV动画 (第1~2季)+OVA篇+漫画+CD+其他；日语音轨; 外挂繁中字幕 (整理时间：2024.06.30)',
    category: 'collection',
    expect: { episode: null, group: '整理搬运' },
    note: '整理搬运：TV(第1~2季)+OVA+漫画+CD 多类型混装，无单一集数',
  },
  {
    raw: '[整理搬运] 零之使魔 (ゼロの使い魔) (Zero no Tsukaima / The Familiar of Zero)：TV动画 (第1~4季)+OVA篇+小说+漫画+CD+其他；日语音轨; 外挂简中字幕 (整理时间：2026.07.18)',
    category: 'collection',
    expect: { episode: null, group: '整理搬运' },
    note: '整理搬运：TV(第1~4季)+OVA+小说+漫画+CD 混装',
  },
  {
    raw: '[VCB-Studio] 元气少女缘结神 / Kamisama Hajimemashita / 神様はじめました 10-bit 1080p/720p HEVC BDRip/DVDRip [S1-S2 + OAD Fin]',
    category: 'collection',
    expect: { episode: null, group: 'VCB-Studio' },
    note: 'S1-S2 + OAD 混装',
  },
  {
    raw: '[整理搬运] 头文字D (頭文字D) (Initial D)：TV动画 (第1~2季、第4~6季)+OVA篇+剧场版+漫画+CD+其他；日语音轨; 外挂简中字幕 (整理时间：2026.09.09)',
    category: 'collection',
    expect: { episode: null, group: '整理搬运' },
    note: '整理搬运：TV 多季 + OVA + 剧场版 + 漫画混装',
  },

  // ============ range：连续集数范围（一部番） ============
  {
    raw: '[豌豆字幕组&LoliHouse] 关于我转生变成史莱姆这档事 第四季 / Tensei Shitara Slime Datta Ken 4th Season [01-24(73-96) 合集][WebRip 1080p HEVC-10bit AAC][简繁外挂字幕][Fin]',
    category: 'season',
    expect: {
      episode: { kind: 'range', from: 1, to: 24 },
      group: '豌豆字幕组&LoliHouse',
      season: 4,
    },
    note: '陷阱：`01-24(73-96)` 季度编号+总编号双体系；主编号取 1-24',
  },
  {
    raw: '[晚街与灯][Re：从零开始的异世界生活 第四季合集 全（丧失篇+夺回篇+小剧场） / Re:Zero kara Hajimeru Isekai Seikatsu 4th][总第67~85][WebRip][1080P_AVC_AAC][简日双语内嵌]',
    category: 'season',
    expect: {
      episode: { kind: 'range', from: 67, to: 85 },
      group: '晚街与灯',
      season: 4,
    },
    note: '陷阱：`总第67~85` 波浪号范围；标题本体含 `第四季合集 全` 与 `4th`；全角冒号 `Re：`',
  },
  {
    raw: '[Prejudice-Studio] 与你相恋至生命尽头 Kimi ga Shinu made Koi wo Shitai [01-13 精修合集][WebRip 1080P HEVC 10Bit AAC MKV][简繁日内封][V2]',
    category: 'season',
    expect: {
      episode: { kind: 'range', from: 1, to: 13 },
      group: 'Prejudice-Studio',
    },
    note: '中英标题无 `/` 分隔直接粘连；尾部 `[V2]`',
  },
  {
    raw: '[SweetSub][Alien 9][01-04 合集][BDRip][1080P][AVC 8bit][简日双语]（检索用：校园外星人，异形特攻学园）',
    category: 'season',
    expect: { episode: { kind: 'range', from: 1, to: 4 }, group: 'SweetSub' },
    note: '陷阱：尾部全角括号 `（检索用：…）` 是垃圾注记',
  },
  {
    raw: '[LoliHouse] 正后方的神威 / 從後面來的神威先生 / うしろの正面カムイさん / Ushiro no Shoumen Kamui-san [01-12 合集][WebRip 1080p HEVC-10bit AAC][简繁内封字幕][Fin]',
    category: 'season',
    expect: { episode: { kind: 'range', from: 1, to: 12 }, group: 'LoliHouse' },
  },
  {
    raw: '[LoliHouse] 碧蓝航线 微速前进 二 / Azur Lane - Bisoku Zenshin! S2 [01-12 合集][WebRip 1080p HEVC-10bit AAC][简繁内封字幕][Fin]',
    category: 'season',
    expect: {
      episode: { kind: 'range', from: 1, to: 12 },
      group: 'LoliHouse',
      season: 2,
    },
    note: '季度以中文 `二` 与 `S2` 两种形态出现',
  },
  {
    raw: '[LoliHouse] 『你们先走我断后』，于是10年后我成为了传说 / Koko wa Ore ni Makasete Saki ni Ike to Itte kara 10-nen ga Tattara Densetsu ni Natteita. [01-12 合集][WebRip 1080p HEVC-10bit AAC][简繁内封字幕][Fin]',
    category: 'season',
    expect: { episode: { kind: 'range', from: 1, to: 12 }, group: 'LoliHouse' },
    note: '陷阱：标题本体含 `10年后`、`10-nen`，不能被当成集数',
  },
  {
    raw: '[Clarita] 岩元前辈的推荐 / Iwamoto-senpai no Suisen [01-12 合集][WebRip 1080p HEVC-10bit AAC][繁体内封字幕][Fin]',
    category: 'season',
    expect: { episode: { kind: 'range', from: 1, to: 12 }, group: 'Clarita' },
  },
  {
    raw: '[7³ACG] 黑执事：绿之魔女篇/Kuroshitsuji S05 | 01-13 [简繁字幕] BDrip 1080p x265 OPUS 2.0',
    category: 'season',
    expect: {
      episode: { kind: 'range', from: 1, to: 13 },
      group: '7³ACG压制',
      season: 5,
    },
    note: '`S05 | 01-13` 管道分隔季度与集数',
  },
  {
    raw: '[7³ACG] 藤本树 17-26/Tatsuki Fujimoto 17-26 S01 | 01-08 [简繁字幕] BDrip 1080p x265 OPUS 2.0',
    category: 'season',
    expect: {
      episode: { kind: 'range', from: 1, to: 8 },
      group: '7³ACG压制',
      season: 1,
    },
    note: '陷阱：标题本体含 `17-26`（作者短篇集名），真正的集数是 `01-08`',
  },
  {
    raw: '[7³ACG] 南镰仓高校女子自行车社/Minami Kamakura Koukou Joshi Jitensha-bu S01 | 01-12+SPx1 [简繁字幕] BDrip 1080p x265 OPUS 2.0',
    category: 'season',
    expect: {
      episode: { kind: 'range', from: 1, to: 12 },
      group: '7³ACG压制',
      season: 1,
      episodeType: 'SP',
    },
    note: '`01-12+SPx1` 主集数+SP 附加',
  },
  {
    raw: '電馭叛客：邊緣行者 2「サイバーパンク：エッジランナーズ２」Cyberpunk Edgerunners S02E01~10 1080p 日英雙語-多國字幕',
    category: 'season',
    expect: {
      episode: { kind: 'range', from: 1, to: 10 },
      season: 2,
    },
    note: '陷阱：`S02E01~10` 复合形态；标题含 `2` 与全角括号引号「」',
  },
  {
    raw: '未来少年柯南.未来少年コナン.Future.Boy.Conan.英语+日语+法语.英文+法文.Disc1.EP01-EP07.Remux.GBR.SDR.UHD.Blu-ray.2160P.HEVC.DTS-HD.MA.2.0-ZF(小水管做种)',
    category: 'season',
    expect: { episode: { kind: 'range', from: 1, to: 7 } },
    note: '陷阱：点分格式；Disc1 是碟片号不是集数；EP01-EP07 才是集数',
  },
  {
    raw: '[绿茶字幕组] 金牌得主 第二季 / Medalist S2 [14-22][BDRip][1080p][简繁日内封]',
    category: 'season',
    expect: {
      episode: { kind: 'range', from: 14, to: 22 },
      group: '绿茶字幕组',
      season: 2,
    },
    note: '裸 `[14-22]` 范围，无合集/Fin 标记',
  },
  {
    raw: '[LoliHouse] 铠真传武士骑兵 / Yoroi Shin Den Samurai Troopers [13-24 合集][WebRip 1080p HEVC-10bit AAC][无字幕][Fin]',
    category: 'season',
    expect: {
      episode: { kind: 'range', from: 13, to: 24 },
      group: 'LoliHouse',
    },
  },
  {
    raw: '[LoliHouse] 入间同学入魔了！S4 / Mairimashita! Iruma-kun S4 [01-24 合集][WebRip 1080p HEVC-10bit AAC][简繁内封字幕][Fin]',
    category: 'season',
    expect: {
      episode: { kind: 'range', from: 1, to: 24 },
      group: 'LoliHouse',
      season: 4,
    },
    note: '季度 `S4` 紧贴标题出现',
  },
  {
    raw: '[LoliHouse] 幼女战记II / Youjo Senki II [01-12 合集][WebRip 1080p HEVC-10bit AAC][简繁内封字幕][Fin](检索用：谭雅战记)',
    category: 'season',
    expect: {
      episode: { kind: 'range', from: 1, to: 12 },
      group: 'LoliHouse',
      season: 2,
    },
    note: '罗马数字 `II` 季度；尾部 `(检索用：…)` 垃圾注记',
  },
  {
    raw: '[LoliHouse] 从0位居民开始的边境领主大人 / Ryoumin 0-nin Start no Henkyou Ryoushu-sama [01-12 合集][WebRip 1080p HEVC-10bit AAC][简繁内封字幕][Fin]',
    category: 'season',
    expect: { episode: { kind: 'range', from: 1, to: 12 }, group: 'LoliHouse' },
    note: '陷阱：标题含 `0位`、`0-nin`',
  },
  {
    raw: '[❀拨雪寻春❀] 恶女不才，请多包涵 ~雏宫蝶鼠换身传~ / ふつつかな悪女ではございますが / Futsutsuka na Akujo de wa Gozaimasu ga [01-11 Fin.][WebRip][HEVC-10bit 1080p][简繁日内封]',
    category: 'season',
    expect: {
      episode: { kind: 'range', from: 1, to: 11 },
      group: '拨雪寻春字幕组',
    },
    note: '`Fin.` 带句点；组名带装饰符号 `❀`；词典条目为「拨雪寻春字幕组」',
  },
  {
    raw: '六四位元字幕組★哪裡有溫柔對待阿宅的辣妹！？ Otaku ni Yasashii Gal wa Inai★01~12(完)★1920x1080★AVC AAC MP4★繁體中文(全修正合集+ass字幕)',
    category: 'season',
    expect: {
      episode: { kind: 'range', from: 1, to: 12 },
      group: '六四位元字幕組',
    },
    note: '★ 分隔格式；`01~12(完)` 波浪号+完',
  },
  {
    raw: '[绿茶字幕组] 我推的孩子 第三季 / Oshi no Ko S3 [25-35 修正合集][WebRip][1080p][简繁日内封]',
    category: 'season',
    expect: {
      episode: { kind: 'range', from: 25, to: 35 },
      group: '绿茶字幕组',
      season: 3,
    },
  },
  {
    raw: '[豌豆字幕组&风之圣殿&LoliHouse] 咒术回战 / Jujutsu Kaisen [48-59 修正合集][WebRip 1080p HEVC-10bit AAC][简繁外挂字幕][Fin]',
    category: 'season',
    expect: {
      episode: { kind: 'range', from: 48, to: 59 },
      group: '豌豆字幕组&风之圣殿&LoliHouse',
    },
    note: '三方联合发布组',
  },
  {
    raw: '【极影字幕·毁片党】完全相反的你和我 第01-25集 GB_CN AV1_opus 1080p',
    category: 'season',
    expect: {
      episode: { kind: 'range', from: 1, to: 25 },
      group: '极影字幕·毁片党',
    },
    note: '`第01-25集` 中文量词范围；无括号；毁片党是极影的压制子品牌',
  },
  {
    raw: '【动漫国字幕组】★10月新番[SPY×FAMILY间谍家家酒 / 间谍过家家][01-50(全集)][1080P][简体][MP4]',
    category: 'season',
    expect: {
      episode: { kind: 'range', from: 1, to: 50 },
      group: '动漫国字幕组',
    },
    note: '`01-50(全集)` 集数后带全集标记',
  },
  {
    raw: '[DBD-Raws][阿拉蕾 (1997)/Dr. Slump][01-74TV全集+SP][Remux][简繁外挂][AC3][MKV](ドクタースランプ)',
    category: 'collection',
    expect: { episode: null, group: 'DBD压制', year: 1997 },
    note: 'TV全集+SP 混装；标题块内 `(1997)` 年份',
  },
  {
    raw: '[アニメ][全話]To Heart -Remember my Memories- 1-13&To Heart 1-13',
    category: 'season',
    expect: { episode: null },
    note: '`[全話]` 前缀 + `1-13&…1-13`（人工勘误：归 season 季度全话）',
  },
  {
    raw: '[GM-Team][国漫][择日飞升][A Good Day to Ascend][2026][13-16][HEVC][GB][4K]',
    category: 'season',
    expect: {
      episode: { kind: 'range', from: 13, to: 16 },
      group: 'GM-Team',
      year: 2026,
    },
    note: '裸 `[13-16]` 范围块 + 独立年份块',
  },
  {
    raw: '[DBD-Raws][约会大作战 第二季/Date a Live II/デート・ア・ライブ II][01-10TV全集+OAD+特典映像][1080P][BDRip][HEVC-10bit][简繁外挂][FLAC][MKV]',
    category: 'collection',
    expect: { episode: null, group: 'DBD压制', season: 2 },
    note: 'TV全集+OAD+特典映像 混装；`II` 罗马数字季度',
  },
  {
    raw: '[阿特拉斯字幕组·迦勒底技术班][命运-奇异赝品][Fate strange Fake][合集][SP&S01(01-13)][日英配音][简繁日&简繁英内封PGS][WEB][1080p AV1 AAC×2]',
    category: 'collection',
    expect: { episode: null, group: '阿特拉斯字幕组·迦勒底技术班' },
    note: '`SP&S01(01-13)` SP+S1 混装（人工勘误：归 collection）',
  },

  // ============ 单集·特殊形态（含 OVA/SP 的单集） ============
  {
    raw: '[SweetSub][正相反的你与我][Seihantai na Kimi to Boku][25][WebRip][1080P][AVC 8bit][简日双语]（检索用：相反的你和我）',
    category: 'single',
    expect: { episode: { kind: 'single', no: 25 }, group: 'SweetSub' },
  },
  {
    raw: '【2026夏季日剧】[MagicStar] 直到T恤干透 番外 / Tシャツが乾くまで サイドストーリー EP03.5 [WEBDL] [1080p]【生】',
    category: 'single',
    expect: { episode: { kind: 'single', no: 3.5 }, group: 'MagicStar' },
    note: '小数集 `EP03.5`',
  },
  {
    raw: '[百冬练习组&LoliHouse] BanG Dream! YUME∞MITA / バンドリ！ ゆめ∞みた - 13 [WebRip 1080p HEVC-10bit AAC][简繁内封字幕][END]',
    category: 'single',
    expect: {
      episode: { kind: 'single', no: 13 },
      group: '百冬练习组&LoliHouse',
    },
    note: '标题含 `∞`；尾部 `[END]`',
  },
  {
    raw: '[GM-Team][云深不知梦 特别篇 逐冥之役][Eclipse of Illusion SP-The Miasma War][2026][05][4K HEVC 10Bit]',
    category: 'single',
    expect: {
      episode: { kind: 'single', no: 5 },
      group: 'GM-Team',
      year: 2026,
      episodeType: 'SP',
    },
    note: '标题与英文名均含 SP；独立年份块；SP 单集',
  },
  {
    raw: '[LoliHouse] 侦探已经，死了。 第二季 / Tantei wa Mou, Shindeiru. S2 - 03 [WebRip 1080p HEVC-10bit AAC][简繁内封字幕]',
    category: 'single',
    expect: {
      episode: { kind: 'single', no: 3 },
      group: 'LoliHouse',
      season: 2,
    },
  },
  {
    raw: '[ANi] Tensei Shitara Ken Deshita S02 /  轉生就是劍 第二季 - 04 [1080P][Baha][WEB-DL][AAC AVC][CHT][MP4]',
    category: 'single',
    expect: {
      episode: { kind: 'single', no: 4 },
      group: 'ANi',
      season: 2,
    },
    note: '英名含 S02、中名含第二季，双重季度信号',
  },
  {
    raw: '[三明治摆烂组] 转生就是剑 第二季 / 转生成为魔剑了 第二季 / Tensei Shitara Ken Deshita S2 / 転生したら剣でしたⅡ - 03 - [简日内嵌][WebRip AVC 8bit 1080P]',
    category: 'single',
    expect: {
      episode: { kind: 'single', no: 3 },
      group: '三明治摆烂组',
      season: 2,
    },
    note: '季度出现 4 种形态：第二季×2、S2、罗马数字 Ⅱ',
  },
  {
    raw: '[LoliHouse] 夜樱家的大作战 第二季 第2部分 / Yozakura-san Chi no Daisakusen Season 2 - 41 [WebRip 1080p HEVC-10bit AAC][简繁内封字幕]',
    category: 'single',
    expect: {
      episode: { kind: 'single', no: 41 },
      group: 'LoliHouse',
      season: 2,
    },
    note: '`第二季 第2部分` 复合季度；单集 41',
  },
  {
    raw: '[MagicStar] 假面骑士My-Th 番外篇 十二支十色 / 仮面ライダーマイス スピンオフ 十二支十色 EP07 [WEBDL] [1080p] [TTFC]【生】',
    category: 'single',
    expect: {
      episode: { kind: 'single', no: 7 },
      group: 'MagicStar',
      episodeType: 'SP',
    },
    note: '番外篇/スピンオフ = SP；EP07 单集',
  },

  // ============ 更多单集形态（来自周更列表页） ============
  {
    raw: '[沸班亚马制作组] 转生贵族凭鉴定技能扭转人生 第三季 - 02 [IQIYI WebRip 2160p H265 Veryslow AAC][简繁内封字幕]',
    category: 'single',
    expect: {
      episode: { kind: 'single', no: 2 },
      group: '沸班亚马制作组',
      season: 3,
    },
    note: '中文季度 + `- 02` 单集',
  },
  {
    raw: '[咪路fans制作组]蜡笔小新 Crayonshinchan [1357][2026.10.17][1080P][GB_JP][MP4]',
    category: 'single',
    expect: { episode: { kind: 'single', no: 1357 }, group: '咪路fans制作组' },
    note: '陷阱：四位数集数 1357；日期块 [2026.10.17] 不能当集数',
  },
  {
    raw: '[咪路fans制作组]蜡笔小新 Crayonshinchan [227][1997.05.02][1080P][简日双语][数码修复版][MP4]',
    category: 'single',
    expect: { episode: { kind: 'single', no: 227 }, group: '咪路fans制作组' },
    note: '日期块 [1997.05.02] 与年份干扰',
  },
  {
    raw: '冰之城牆「氷の城壁」The Ramparts of Ice S02E03 1080p 日英雙語-多國字幕',
    category: 'single',
    expect: { episode: { kind: 'single', no: 3 }, season: 2 },
    note: '`S02E03` 单集；无括号、无发布组',
  },
  {
    raw: '[黑白字幕组]铠真传武士骑兵 / Yoroi Shin Den Samurai Troopers Part 2 [22] [WebRip 1080p AVC-8bit AAC][CHT](检索用：魔神坛斗士)',
    category: 'single',
    expect: { episode: { kind: 'single', no: 22 }, group: '黑白字幕组' },
    note: '陷阱：`Part 2` 是标题一部分，不是季度；`[22]` 才是集数',
  },
  {
    raw: '[搬运][Geoko]蒼き伝承 ウェルシュ＆シェダー 03|Aoki Denshou: Welsh & Shedar 03(1080P 无字幕)',
    category: 'single',
    expect: { episode: { kind: 'single', no: 3 }, group: 'Geoko' },
    note: '陷阱：`03|…03` 管道内两个 3；`[搬运]` 前缀',
  },
  {
    raw: '[ANi] 冰劍的魔術師將要統一世界 2 - 02 [1080P][Baha][WEB-DL][AAC AVC][CHT][MP4]',
    category: 'single',
    expect: { episode: { kind: 'single', no: 2 }, group: 'ANi', season: 2 },
    note: '陷阱：标题尾部的 `2` 是季度，`- 02` 是集数',
  },
  {
    raw: '[ANi] Ace of the Diamond S02 / 鑽石王牌 act2 第二季 - 15 [1080P][Baha][WEB-DL][AAC AVC][CHT][MP4]',
    category: 'single',
    expect: {
      episode: { kind: 'single', no: 15 },
      group: 'ANi',
      season: 2,
    },
    note: '陷阱：`S02`+`act2`+`第二季` 三重季度信号',
  },
  {
    raw: '[桜都字幕组] 弹珠汽水瓶里的千岁同学 第二季 / Chitose-kun wa Ramune Bin no Naka (2026) [01][1080P][简繁内封]',
    category: 'single',
    expect: {
      episode: { kind: 'single', no: 1 },
      group: '桜都字幕组',
      season: 2,
      year: 2026,
    },
  },
  {
    raw: '[LoliHouse] 名侦探光之美少女♪ / Star Detective Precure! - 38 [WebRip 1080p HEVC-10bit AAC][无字幕](检索用：Q娃)',
    category: 'single',
    expect: { episode: { kind: 'single', no: 38 }, group: 'LoliHouse' },
    note: '标题含音符 ♪；`(检索用：Q娃)` 垃圾注记',
  },
  {
    raw: '[雪飄工作室][おねがいアイプリ/Onegai_Aipri/拜托了美妙公主][29][简繁日外挂](检索:/美妙旋律/美妙天堂/美妙頻道/美妙魔法)',
    category: 'single',
    expect: { episode: { kind: 'single', no: 29 }, group: '雪飘工作室' },
    note: '标题块内斜杠连接三语；`(检索:/…)` 垃圾注记含斜杠',
  },
  {
    raw: '[Billion Meta Lab] 魔法姐妹露露莉莉 Mahou no Shimai Rurutto Riryi [14][1080P][HEVC-10bit][简繁日内封]',
    category: 'single',
    expect: { episode: { kind: 'single', no: 14 }, group: '亿次研同好会' },
    note: '词典命中：Billion Meta Lab → 亿次研同好会',
  },
  {
    raw: '[沸班亚马制作组] 飙马野郎 JOJO的奇妙冒险 第二&第三赛段 - 03 [NF WebRip 1080p H265 Veryslow AAC][简繁内封字幕]',
    category: 'single',
    expect: { episode: { kind: 'single', no: 3 }, group: '沸班亚马制作组' },
    note: '陷阱：`第二&第三赛段` 是标题（赛道名），不是季度',
  },
  {
    raw: '[LoliHouse] 用【循环利息】强制收回借出的魔力 / Kashita Maryoku wa Revo Barai de Kyousei Choushuu - 03 [WebRip 1080p HEVC-10bit AAC][简繁内封字幕]',
    category: 'single',
    expect: { episode: { kind: 'single', no: 3 }, group: 'LoliHouse' },
    note: '陷阱：标题内部嵌有全角括号【】',
  },
];
