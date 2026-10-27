/**
 * 历史 spec 用例迁移 —— 旧 filenameparser.service.spec.ts 的 61 条用例，
 * 按新契约（结构化数字集数）重新标注后并入语料体系。
 *
 * 说明：
 * - 旧用例只测集数，期望值是字符串（'01-13'）/数字（隐含）/null；
 *   这里统一换算为新契约：'01-13' → { kind:'range', from:1, to:13 }，
 *   '08' → { kind:'single', no:8 }，null → null。
 * - category 按集数形态归类：single / season（旧 range 改名；整季/全话/Fin 无数字 → season）。
 * - 旧实现在这批用例上 53/61 失败（含纯类型分歧），迁移后以新契约重跑
 *   才能区分"值对类型错"与"值就错"两类问题。
 */

import { CorpusEntry } from './dmhy-corpus';

export const legacyCorpus: CorpusEntry[] = [
  {
    raw: '【DMHY】【多田君不恋爱/Tada-kun wa Koi o Shinai】[01-13][合集rev][简体][720P][MP4]',
    category: 'season',
    expect: { episode: { kind: 'range', from: 1, to: 13 } },
  },
  {
    raw: '[❀拨雪寻春❀] 四月是你的谎言 / 四月は君の嘘 / Shigatsu wa Kimi no Uso / Your Lie in April [BDRip][HEVC-10bit 1080p][简繁日内封][Rev.]',
    category: 'season',
    expect: { episode: null },
  },
  {
    raw: "【喵萌奶茶屋】★04月新番★[杂旅 / 随兴旅-That's Journey- / Zatsu Tabi: That's Journey][01-12][1080p][简日双语]",
    category: 'season',
    expect: { episode: { kind: 'range', from: 1, to: 12 } },
  },
  {
    raw: '【喵萌奶茶屋】[我喜歡的女孩忘記戴眼鏡 / Suki na Ko ga Megane wo Wasureta][01-13END][BDRip][1080p][繁日雙語][招募翻譯]',
    category: 'season',
    expect: { episode: { kind: 'range', from: 1, to: 13 } },
  },
  {
    raw: '[桜都字幕组] 「只能触摸一分钟哦...」合租房的秘密规则。 / 「1 Funkan dake Furete mo Ii yo...」 Share House no Himitsu Rule. [01-08 Fin][1080p][简体内嵌]',
    category: 'season',
    expect: { episode: { kind: 'range', from: 1, to: 8 } },
  },
  {
    raw: '[桜都字幕组] 阿鲁斯的巨兽 / Ars no Kyojuu [1-12 Fin v2][1080p][简繁内封]',
    category: 'season',
    expect: { episode: { kind: 'range', from: 1, to: 12 } },
  },
  {
    raw: '[天月搬運組][怪胎兄弟 The Freak Brothers 第二季][全08集][英語無字][MKV][720P][WEB-RAW]',
    category: 'single',
    expect: { episode: { kind: 'single', no: 8 } },
  },
  {
    raw: '【极影字幕·毁片党】 男女之间存在友情吗？不，不存在！ 第01-12集 GB_CN HEVC_opus 1080p',
    category: 'season',
    expect: { episode: { kind: 'range', from: 1, to: 12 } },
  },
  {
    raw: '[豌豆字幕组&LoliHouse] Kuroshitsuji - Midori no Majo-hen / 黑执事 绿之魔女篇 [01-13 合集][WebRip 1080p HEVC-10bit AAC][简繁外挂字幕][Fin]',
    category: 'season',
    expect: { episode: { kind: 'range', from: 1, to: 13 } },
  },
  {
    raw: '[喵萌奶茶屋&LoliHouse] 记忆缝线 / Your Forma / ユア・フォルマ - [01-13 精校合集][WebRip 1080p HEVC-10bit AAC][简繁日内封字幕][Fin]',
    category: 'season',
    expect: { episode: { kind: 'range', from: 1, to: 13 } },
  },
  {
    raw: '[喵萌奶茶屋&LoliHouse] 全修。 / ZENSHU [01-12 修正合集 v2][WebRip 1080p HEVC-10bit AAC][简繁日内封字幕][Fin]',
    category: 'season',
    expect: { episode: { kind: 'range', from: 1, to: 12 } },
  },
  {
    raw: '[LoliHouse] 我与尼特女忍者的莫名同居生活 / NEET Kunoichi [01-12+EX 合集][WebRip 1080p HEVC-10bit AAC][简繁内封字幕][Fin]',
    category: 'season',
    expect: { episode: { kind: 'range', from: 1, to: 12 } },
  },
  {
    raw: '【悠哈璃羽字幕社&西农YUI汉化组】[暗芝居 第十四季_Yami Shibai 14][01-13 END][x264 1080p][CHS]',
    category: 'season',
    expect: { episode: { kind: 'range', from: 1, to: 13 } },
  },
  {
    raw: "[AHU-SUB][生而为狗，我很幸福/无意间变成狗，被喜欢的女生捡回家。_My Life as Inukai-san's Dog][01-12+OVA1-2][BDRIP 1920x1080 HEVC-YUV420P10 FLAC][MKV 简繁外挂]",
    category: 'collection',
    expect: { episode: null },
  },
  {
    raw: '【TSDM字幕组】[恶魔阿萨谢尔在召唤你][AZAZEL_SAN][1-13+2OAD][MKV简繁内挂][720P]',
    category: 'season',
    expect: { episode: { kind: 'range', from: 1, to: 13 } },
  },
  {
    raw: '【動漫國字幕組】★04月新番[躍動青春][01-12(全集)][720P][繁體][MP4]',
    category: 'season',
    expect: { episode: { kind: 'range', from: 1, to: 12 } },
  },
  {
    raw: '【幻櫻字幕組】【殺手寓言 The Fable】【01~25】【BIG5_MP4】【1280X720】【合集】',
    category: 'season',
    expect: { episode: { kind: 'range', from: 1, to: 25 } },
  },
  {
    raw: '【幻樱字幕组】【租借女友第二季 Kanojo Okarishimasu S2】【合集V2】【GB_MP4】【1280X720】',
    category: 'season',
    expect: { episode: null },
  },
  {
    raw: '[愛戀字幕社][4月新番][歲月流逝飯菜依舊美味][Hibi wa Sugiredo Meshi Umashi][01-12][1080P][MP4][繁中]',
    category: 'season',
    expect: { episode: { kind: 'range', from: 1, to: 12 } },
  },
  {
    raw: '[DBD-Raws][超级潜水艇99/Submarine Super 99][01-13TV全集+特典映像][美版/USA.Ver][1080P][BDRip][HEVC-10bit][AC3+FLAC][MKV](サブマリン スーパー99)',
    category: 'season',
    expect: { episode: { kind: 'range', from: 1, to: 13 } },
  },
  {
    raw: '[c.c動漫][1月新番][為了養老金去異界存八萬金][01-12][合集][BIG5][1080P][MP4]',
    category: 'season',
    expect: { episode: { kind: 'range', from: 1, to: 12 } },
  },
  {
    raw: '[罗小黑战记/The Legend of LuoXiaohei][正片01-27+番外01-03][简体][网盘][普通版]',
    category: 'season',
    expect: { episode: { kind: 'range', from: 1, to: 27 } },
  },
  {
    raw: '[千夏字幕组][传颂之物 二人的白皇_Utawarerumono Futari no Hakuoro][第01-28话][1080p_HEVC][简繁内封][合集]',
    category: 'season',
    expect: { episode: { kind: 'range', from: 1, to: 28 } },
  },
  {
    raw: '[酷漫404][輝夜姬想讓人告白 一超級浪漫一][01-13][1080P][WebRip][繁日雙語(內嵌+外掛)][AVC AAC][MP4][字幕組招人內詳]',
    category: 'season',
    expect: { episode: { kind: 'range', from: 1, to: 13 } },
  },
  {
    raw: '[诸神字幕组][我心里危险的东西][Boku no Kokoro no Yabai Yatsu][01-25+SP全][BDRip][简繁日语字幕][1080P][HEVC MKV]',
    category: 'season',
    expect: { episode: { kind: 'range', from: 1, to: 25 } },
  },
  {
    raw: '[诸神字幕组][男子游泳部 第三季][Free! - Dive to the Future][01-12完][简繁日语字幕][1080P][HEVC MKV]',
    category: 'season',
    expect: { episode: { kind: 'range', from: 1, to: 12 } },
  },
  {
    raw: '[霜庭云花Sub][BanG Dream! Ave Mujica][01-13 合集][1080P][AVC AAC][简日双语][WebRip]',
    category: 'season',
    expect: { episode: { kind: 'range', from: 1, to: 13 } },
  },
  {
    raw: '[GM-Team][国漫][画江湖之不良人 第7季][Drawing Jianghu of Bu Liang Ren Ⅶ][2025][01-12 Fin][HEVC][GB][4K]',
    category: 'season',
    expect: { episode: { kind: 'range', from: 1, to: 12 } },
  },
  {
    raw: '[風車字幕組][魔法戰爭Mahou Sensou][01-12][完][繁體][MP4][720P]',
    category: 'season',
    expect: { episode: { kind: 'range', from: 1, to: 12 } },
  },
  {
    raw: '[雪飘工作室][幸福充电光之美少女/HappinessCharge_Precure!/ハピネスチャージプリキュア！][BDrip][37-49_END][简繁外挂](检索:Q娃)',
    category: 'season',
    expect: { episode: { kind: 'range', from: 37, to: 49 } },
  },
  {
    raw: '[澄空学园&雪飘工作室][碧蓝幻想 二期][GRANBLUE FANTASY-The Animation Season2][01-12&EX1 合集][720p][简体内嵌]',
    category: 'season',
    expect: { episode: { kind: 'range', from: 1, to: 12 } },
  },
  {
    raw: '【MCE汉化组】[鬼灭之刃][Kimetsu no Yaiba][鬼灭学园物语][情人节篇][01-04][简体][1080p][x264 AAC]',
    category: 'season',
    expect: { episode: { kind: 'range', from: 1, to: 4 } },
  },
  {
    raw: '[愛戀字幕組&丸子家族][Lady寶石寵物(Lady Jewel Pet)][01-52_合集][BIG5][720P][MP4]',
    category: 'season',
    expect: { episode: { kind: 'range', from: 1, to: 52 } },
  },
  {
    raw: '【合集】結城友奈は勇者である 结城友奈是勇者 01-30',
    category: 'season',
    expect: { episode: { kind: 'range', from: 1, to: 30 } },
  },
  {
    raw: '[AngelEcho]【合集】ラブライブ! LoveLive! School Idol Diary 第01-19话',
    category: 'season',
    expect: { episode: { kind: 'range', from: 1, to: 19 } },
  },
  {
    raw: '[SweetSub][机动战士高达 GQuuuuuuX][Mobile Suit Gundam GQuuuuuuX][01-12 精校合集][WebRip][1080P][AVC 8bit][简日双语]',
    category: 'season',
    expect: { episode: { kind: 'range', from: 1, to: 12 } },
  },
  {
    raw: '【楓葉字幕組】[寵物小精靈 / 寶可夢 旅途][001-136+SP01-04][合集][繁體][1080P][MP4]',
    category: 'season',
    expect: { episode: { kind: 'range', from: 1, to: 136 } },
  },
  {
    raw: '[轻之国度字幕组][Anima Yell!][合集][720P][MP4]',
    category: 'season',
    expect: { episode: null },
  },
  {
    raw: '[云光字幕组] 小市民系列 Shoushimin Series [22集全合集][简体双语][1080p]招募翻译',
    category: 'single',
    expect: { episode: { kind: 'single', no: 22 } },
  },
  {
    raw: '【豌豆字幕组】[七大罪 Nanatsu no Taizai][01-24+OAD01-02+SP01-04][合集][GB简体][720P][MP4][百度网盘]',
    category: 'collection',
    expect: { episode: null },
  },
  {
    raw: '【中肯字幕組】【1月新番】【川尻小玉的懒散生活】【全集】【BIG5_MP4】【1920X1080】',
    category: 'season',
    expect: { episode: null },
  },
  {
    raw: '[銀色子彈字幕組][名偵探柯南][SEASON2021 年度TV合集][993-1032][繁日雙語MP4][1080P]',
    category: 'season',
    expect: { episode: { kind: 'range', from: 993, to: 1032 } },
  },
  {
    raw: '【澄空学园&华盟字幕社】 甘城光辉游乐园 Amagi Brilliant Park 01-13 MKV 720P 简繁外挂 合集',
    category: 'season',
    expect: { episode: { kind: 'range', from: 1, to: 13 } },
  },
  {
    raw: '【华盟字幕社】[七月新番][Koimonogatari][恋物语][全][GB][720p_MP4]',
    category: 'season',
    expect: { episode: null },
  },
  {
    raw: '【Dymy字幕組】【Tesagure! Bukatsu-mono_摸索吧!社團活動Encore】【第01-12話】【BIG5】【1280X720】【MP4】【成員招募中】',
    category: 'season',
    expect: { episode: { kind: 'range', from: 1, to: 12 } },
  },
  {
    raw: '[喵萌奶茶屋&VCB-Studio] 赛博朋克：边缘行者 / Cyberpunk Edgerunners / サイバーパンク: エッジランナーズ 10-bit 1080p HEVC BDRip [S1 Fin]',
    category: 'season',
    expect: { episode: null },
  },
  {
    raw: "[VCB-Studio] 不幸职业【鉴定士】实则最强 / Fuguushoku 'Kanteishi' ga Jitsu wa Saikyou Datta / 不遇職【鑑定士】が実は最強だった 10-bit 1080p HEVC BDRip [Fin]",
    category: 'season',
    expect: { episode: null },
  },
  {
    raw: '【DHR動研字幕組】[請讓我撒嬌，仙狐大人！_Sewayaki Kitsune no Senko-san][01-12全][繁體][720P][MP4](合集版本)',
    category: 'season',
    expect: { episode: { kind: 'range', from: 1, to: 12 } },
  },
  {
    raw: '[影片搬運][雪鹰领主][GB][全26話][1080P][MP4]',
    category: 'single',
    expect: { episode: { kind: 'single', no: 26 } },
  },
  {
    raw: "[LP-Raws&离谱Sub] BanG Dream! It's MyGO!!!!! [01-13 Fin][BDRip AVC-8bit AAC][1080p][简日内嵌][三次校对字幕][REV]",
    category: 'season',
    expect: { episode: { kind: 'range', from: 1, to: 13 } },
  },
  {
    raw: '【百冬練習組】【戰隊大失格_Sentai Daishikkaku】[01-12][1080p AVC AAC][繁體][合集]',
    category: 'season',
    expect: { episode: { kind: 'range', from: 1, to: 12 } },
  },
  {
    raw: '【百冬練習組】【BanG Dream Morfonication】[1080p AVC AAC][繁體][修正合集]',
    category: 'season',
    expect: { episode: null },
  },
  {
    raw: '[冷番补完字幕组][飘泊的太阳][さすらいの太陽][Sasurai no Taiyou][1971][TV 01-26Fin][720p][内封简繁中字]',
    category: 'season',
    expect: { episode: { kind: 'range', from: 1, to: 26 } },
  },
  {
    raw: '【爱咕字幕组】回复术士之重启人生[Kaifuku_Jutsushi_no_Yarinaoshi_-_01~12 END_[AT-X][WebRip 1920x1080 AAC][简体内嵌]完全回复版',
    category: 'season',
    expect: { episode: { kind: 'range', from: 1, to: 12 } },
  },
  {
    raw: '【CXRAW】【ドラゴンボール超】【龙珠超】【1-131Fin】【BDrip】【HEVC Main10P FLAC MKV】',
    category: 'season',
    expect: { episode: { kind: 'range', from: 1, to: 131 } },
  },
  {
    raw: '【夢幻戀櫻字幕組】[Sora no Method][天體的秩序/天體的運行式][第01-13話][完結][BIG5][MP4](附全提供畫面牆紙/本作ass特效)',
    category: 'season',
    expect: { episode: { kind: 'range', from: 1, to: 13 } },
  },
  {
    raw: '[WBX-Raws] Go！プリンセスプリキュア/Go！Princess Precure/Go！Princess 光之美少女 TV EP01-50 全 [BDrip][HEVC 1080P FLAC]（附Musical Show）',
    category: 'season',
    expect: { episode: { kind: 'range', from: 1, to: 50 } },
  },
  {
    raw: '[Amor字幕组&萌樱字幕组][杀手奶爸 Buddy Diddies][01-12][CHS CHT_JP][合集][1080P][HDrip][MP4][急招翻譯校對時軸特效]',
    category: 'season',
    expect: { episode: { kind: 'range', from: 1, to: 12 } },
  },
  {
    raw: '[MingY&熔岩动画Sub] 街角魔族 2丁目 / Machikado Mazoku S2 [01-12+Mini][BDRip][简日内嵌]（校对合集）',
    category: 'season',
    expect: { episode: { kind: 'range', from: 1, to: 12 } },
  },
  {
    raw: 'Sakura 2022 Lycoris Recoil s01 01-13 1080p HEVC',
    category: 'season',
    expect: { episode: { kind: 'range', from: 1, to: 13 } },
  },
  {
    raw: '【PMFAN字幕组】【宝可梦 钻石&珍珠】【000-193+M10-M13】【合集】【中日双语字幕】【480P+1080P】【MP4】宠物小精灵DP 检索用',
    category: 'season',
    expect: { episode: { kind: 'range', from: 0, to: 193 } },
  },
];
