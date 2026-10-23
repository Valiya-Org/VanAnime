/**
 * 全量语料（由 .corpus-raw/ 的 5 个分类文件生成，勿手改）。
 *
 * category 只到「集数形态」粒度：
 *   single      单集
 *   season      整季/连续集数范围
 *   collection  合集/混合大包（episode 应为 null）
 *   movie       剧场版（episode 为 null 或多部电影的范围）
 *   noEpisode   无集数（episode 应为 null）
 */

export type RawCorpusCategory =
  'single' | 'season' | 'collection' | 'movie' | 'noEpisode';

export interface RawCorpusEntry {
  raw: string;
  category: RawCorpusCategory;
}

export const rawCorpus: RawCorpusEntry[] = [
  {
    raw: '[桜都字幕组] 不擅交际的未亡人雪女与诅咒戒指 / Hitozukiai ga Nigate na Miboujin no Yukionna-san to Noroi no Yubiwa [02][1080P][简繁内封]',
    category: 'single',
  },
  {
    raw: '[桜都字幕组] 飙马野郎 JOJO的奇妙冒险 / Steel Ball Run： JoJo no Kimyou na Bouken [04][1080P][简体内嵌]',
    category: 'single',
  },
  {
    raw: '[雪飄工作室][おねがいアイプリ/Onegai_Aipri/拜託了美妙公主][29][繁日內嵌](检索:/美妙旋律/美妙天堂/美妙頻道/美妙魔法)',
    category: 'single',
  },
  {
    raw: '[桜都字幕组] FX战士久留美 / FX Senshi Kurumi-chan [02][1080P][简体内嵌]',
    category: 'single',
  },
  {
    raw: '[LoliHouse] 夜樱家的大作战 第二季 第2部分 / Yozakura-san Chi no Daisakusen Season 2 - 41 [WebRip 1080p HEVC-10bit AAC][简繁内封字幕]',
    category: 'single',
  },
  {
    raw: '[雪飄工作室][おねがいアイプリ/Onegai_Aipri/拜托了美妙公主][29][简繁日外挂](检索:/美妙旋律/美妙天堂/美妙頻道/美妙魔法)',
    category: 'single',
  },
  {
    raw: '[ANi] 黑化吧！聖女大人 第二季 - 03 [1080P][Baha][WEB-DL][AAC AVC][CHT][MP4]',
    category: 'single',
  },
  {
    raw: '[三明治摆烂组&LoliHouse] 世界最强的魔女，就此开始 / 世界最强魔女，始动 / Sekai Saikyou no Majo, Hajimemashita - 02 [WebRip 1080p HEVC-10bit AAC][简繁日内封字幕]',
    category: 'single',
  },
  {
    raw: '[沸班亚马制作组] 死神 千年血战篇-祸进谭- - 49 [CR WebRip 1080p H265 Veryslow AAC][简繁内封字幕]',
    category: 'single',
  },
  {
    raw: '[沸班亚马制作组] 青之箱 第二季 - 02 [NF WebRip AI2160p H265 Veryslow EAC3][简繁内封字幕]',
    category: 'single',
  },
  {
    raw: '[绿茶字幕组&LoliHouse] 学生会也有洞！ / Seitokai ni mo Ana wa Aru - 02 [WebRip 1080p HEVC-10bit AAC][简繁日内封字幕]',
    category: 'single',
  },
  {
    raw: '[三明治摆烂组&LoliHouse] 转生就是剑 第二季 / 转生成为魔剑了 第二季 / Tensei Shitara Ken Deshita S2 - 03 [WebRip 1080p HEVC-10bit AAC][简繁日内封字幕]',
    category: 'single',
  },
  {
    raw: '[GM-Team][云深不知梦 特别篇 逐冥之役][Eclipse of Illusion SP-The Miasma War][2026][06 END][4K HEVC 10Bit]',
    category: 'single',
  },
  {
    raw: '[咪路fans制作组]蜡笔小新 Crayonshinchan [1357][2026.10.17][1080P][GB_JP][MP4]',
    category: 'single',
  },
  {
    raw: '【2026夏季日剧】[MagicStar] 直到T恤干透 番外 / Tシャツが乾くまで サイドストーリー EP03.5 [WEBDL] [1080p]【生】',
    category: 'single',
  },
  {
    raw: '[Billion Meta Lab] 魔法姐妹露露莉莉 Mahou no Shimai Rurutto Riryi [14][1080P][HEVC-10bit][简繁日内封]',
    category: 'single',
  },
  {
    raw: '[搬運][ANi] Tōgen Anki / 桃源暗鬼：日光·華嚴瀑布篇 - 03 [1080P][Baha][WEB-DL][AAC AVC][CHT][MP4]',
    category: 'single',
  },
  {
    raw: '[ANi] Tensei Goblin dakedo Shitsumon Aru / 轉生哥布林有問題嗎？ - 04 [1080P][Baha][WEB-DL][AAC AVC][CHT][MP4]',
    category: 'single',
  },
  {
    raw: '[云光字幕组] 小市民系列 Shoushimin Series [22集全合集][简体双语][1080p]招募翻译',
    category: 'single',
  },
  {
    raw: '[百冬练习组&LoliHouse] BanG Dream! YUME∞MITA / バンドリ！ ゆめ∞みた - 13 [WebRip 1080p HEVC-10bit AAC][简繁内封字幕][END]',
    category: 'single',
  },
  {
    raw: '[LoliHouse] 朱色假面 / Shuiro no Kamen - 02 [WebRip 1080p HEVC-10bit AAC][简繁内封字幕]',
    category: 'single',
  },
  {
    raw: '[三明治摆烂组] 乱世千金倪亚·利斯顿转生为娇弱千金的弑神武人华丽无双录 / Kyouran Reijou Nia Liston / 凶乱令嬢ニア・リストン - 03 - [简日内嵌][WebRip AVC 8bit 1080P]',
    category: 'single',
  },
  {
    raw: '[猎户压制部] 归还者的魔法要特别 第二季 / Kikansha no Mahou wa Tokubetsu desu S2 [14] [1080p] [简日内嵌] [2026年10月番]',
    category: 'single',
  },
  {
    raw: '[沸班亚马制作组] 青之箱 第二季 - 02 [NF WebRip 1080p H265 Veryslow EAC3][简繁内封字幕]',
    category: 'single',
  },
  {
    raw: '[天月搬運組][怪胎兄弟 The Freak Brothers 第二季][全08集][英語無字][MKV][720P][WEB-RAW]',
    category: 'single',
  },
  {
    raw: '[桜都字幕组] 弹珠汽水瓶里的千岁同学 第二季 / Chitose-kun wa Ramune Bin no Naka (2026) [01][1080P][繁体内嵌]',
    category: 'single',
  },
  {
    raw: '[Billion Meta Lab] 魔法姐妹露露莉莉 Mahou no Shimai Rurutto Riryi [14][1080P][简日内嵌]',
    category: 'single',
  },
  {
    raw: '[LoliHouse] 魔法骑士雷阿斯 / Magic Knight Rayearth (2026) - 02 [WebRip 1080p HEVC-10bit AAC][简繁内封字幕]',
    category: 'single',
  },
  {
    raw: '[ANi] Sora wa Akai Kawa no Hotori / 赤河戀影 - 03 [1080P][Baha][WEB-DL][AAC AVC][CHT][MP4]',
    category: 'single',
  },
  {
    raw: '[桜都字幕组] 飙马野郎 JOJO的奇妙冒险 / Steel Ball Run： JoJo no Kimyou na Bouken [05][1080P][简体内嵌]',
    category: 'single',
  },
  {
    raw: '[SweetSub][正相反的你与我][Seihantai na Kimi to Boku][25][WebRip][1080P][AVC 8bit][简日双语]（检索用：相反的你和我）',
    category: 'single',
  },
  {
    raw: '[❀拨雪寻春❀] 萤火虫的出嫁 / ホタルの嫁入り / Hotaru no Yomeiri / Firefly Wedding - 01 [WebRip][HEVC-10bit 1080p][繁日内嵌]',
    category: 'single',
  },
  {
    raw: '[ANi] Sora wa Akai Kawa no Hotori / 赤河戀影 - 06 [1080P][Baha][WEB-DL][AAC AVC][CHT][MP4]',
    category: 'single',
  },
  {
    raw: '[LoliHouse] 兽王武神丹帝拜恩 / Juuou Mujin Dandivine - 02 [WebRip 1080p HEVC-10bit AAC][简繁内封字幕]',
    category: 'single',
  },
  {
    raw: '[綠茶字幕組] 描繪直至生命盡頭 / 畫完這個就去死 / Kore Kaite Shine [08][WebRip][1080p][繁日內嵌]',
    category: 'single',
  },
  {
    raw: '[ANi] Ace of the Diamond S02 / 鑽石王牌 act2 第二季 - 15 [1080P][Baha][WEB-DL][AAC AVC][CHT][MP4]',
    category: 'single',
  },
  {
    raw: '【喵萌奶茶屋】★10月新番★[某暗部的少女共栖 / とある暗部の少女共棲 / Toaru Anbu no Item][02][1080p][简繁日内封]',
    category: 'single',
  },
  {
    raw: '[沸班亚马制作组] 飙马野郎 JOJO的奇妙冒险 第二&第三赛段 - 03 [NF WebRip 1080p H265 Veryslow AAC][简繁内封字幕]',
    category: 'single',
  },
  {
    raw: '[LoliHouse] 至高之力 / VERTEX FORCE - 03 [WebRip 1080p HEVC-10bit AAC][简繁内封字幕]',
    category: 'single',
  },
  {
    raw: '[Alice Raw] 侵略！烏賊娘 OAD 侵略！イカ娘 OAD 第03話 「助っ人じゃなイカ？／バレなイカ？／警察官じゃなイカ？」 (ATX 3840x2160 x265 AAC)',
    category: 'single',
  },
  {
    raw: '[绿茶字幕组] 僵尸搜寻中 / Zombie Sagashitemasu [02][WebRip][1080p][简繁日内封]',
    category: 'single',
  },
  {
    raw: '[桜都字幕组] FX战士久留美 / FX Senshi Kurumi-chan [03][1080P][繁体内嵌]',
    category: 'single',
  },
  {
    raw: '冰之城牆「氷の城壁」The Ramparts of Ice S02E03 1080p 日英雙語-多國字幕',
    category: 'single',
  },
  {
    raw: '[LoliHouse] 魔法骑士雷阿斯 / Magic Knight Rayearth (2026) - 03 [WebRip 1080p HEVC-10bit AAC][简繁内封字幕]',
    category: 'single',
  },
  {
    raw: '[沸班亚马制作组] 青之箱 第二季 - 01 [BILIBILI WebRip 2160p H265 Veryslow EAC3][简繁内封字幕]',
    category: 'single',
  },
  {
    raw: '[LoliHouse] 用【循环利息】强制收回借出的魔力 / Kashita Maryoku wa Revo Barai de Kyousei Choushuu - 03 [WebRip 1080p HEVC-10bit AAC][简繁内封字幕]',
    category: 'single',
  },
  {
    raw: '【百冬練習組】【BanG Dream Yumemita】[13][1080p AVC AAC][繁體][完]',
    category: 'single',
  },
  {
    raw: '[ANi] FX Senshi KURUMICHAN /  FX 戰士久留美 - 04 [1080P][Baha][WEB-DL][AAC AVC][CHT][MP4]',
    category: 'single',
  },
  {
    raw: '[桜都字幕组] FX战士久留美 / FX Senshi Kurumi-chan [03][1080P][简繁内封]',
    category: 'single',
  },
  {
    raw: '[ANi] Sora wa Akai Kawa no Hotori / 赤河戀影 - 07 [1080P][Baha][WEB-DL][AAC AVC][CHT][MP4]',
    category: 'single',
  },
  {
    raw: '[LoliHouse] 青箱 第二季 / Ao no Hako S2 / Blue Box S2 - 27 [WebRip 1080p HEVC-10bit AAC][简繁内封字幕]',
    category: 'single',
  },
  {
    raw: '[黑白字幕组]铠真传武士骑兵 / Yoroi Shin Den Samurai Troopers Part 2 [22] [WebRip 1080p AVC-8bit AAC][CHS](检索用：魔神坛斗士)',
    category: 'single',
  },
  {
    raw: '[桜都字幕组] 飙马野郎 JOJO的奇妙冒险 / Steel Ball Run： JoJo no Kimyou na Bouken [04][1080P][简繁内封]',
    category: 'single',
  },
  {
    raw: '[Skymoon-Raws] 龍珠超：比路斯 / Dragon Ball Super: Beerus - 02 [ViuTV][WEB-DL][CHT][1080p][AVC AAC]',
    category: 'single',
  },
  {
    raw: '[LoliHouse] 兽王武神丹帝拜恩 / Juuou Mujin Dandivine - 03 [WebRip 1080p HEVC-10bit AAC][简繁内封字幕]',
    category: 'single',
  },
  {
    raw: '[LoliHouse] 侦探已经，死了。 第二季 / Tantei wa Mou, Shindeiru. S2 - 03 [WebRip 1080p HEVC-10bit AAC][简繁内封字幕]',
    category: 'single',
  },
  {
    raw: '[ANi] Sora wa Akai Kawa no Hotori / 赤河戀影 - 01 [1080P][Baha][WEB-DL][AAC AVC][CHT][MP4]',
    category: 'single',
  },
  {
    raw: '[❀拨雪寻春❀] 萤火虫的出嫁 / ホタルの嫁入り / Hotaru no Yomeiri / Firefly Wedding - 02 [WebRip][HEVC-10bit 1080p][简日内嵌]',
    category: 'single',
  },
  {
    raw: '[三明治摆烂组] 转生就是剑 第二季 / 转生成为魔剑了 第二季 / Tensei Shitara Ken Deshita S2 / 転生したら剣でしたⅡ - 03 - [简日内嵌][WebRip AVC 8bit 1080P]',
    category: 'single',
  },
  {
    raw: '[LoliHouse] 归还者的魔法要特别 / 重生者的魔法一定要特别 / Kikansha no Mahou wa Tokubetsu desu - 15 [WebRip 1080p HEVC-10bit AAC][简繁内封字幕](检索：第二季)',
    category: 'single',
  },
  {
    raw: '[ANi] DARK MACHINE THE ANIMATION / 闇機 DARK MACHINE - 02 [1080P][Baha][WEB-DL][AAC AVC][CHT][MP4]',
    category: 'single',
  },
  {
    raw: '[桜都字幕组] FX战士久留美 / FX Senshi Kurumi-chan [02][1080P][繁体内嵌]',
    category: 'single',
  },
  {
    raw: '[黑白字幕组]铠真传武士骑兵 / Yoroi Shin Den Samurai Troopers Part 2 [22] [WebRip 1080p AVC-8bit AAC][CHT](检索用：魔神坛斗士)',
    category: 'single',
  },
  {
    raw: '[ANi] Ao Ashi S02 /  青之蘆葦 第二季 - 03 [1080P][Baha][WEB-DL][AAC AVC][CHT][MP4]',
    category: 'single',
  },
  {
    raw: '[桜都字幕组] FX战士久留美 / FX Senshi Kurumi-chan [03][1080P][简体内嵌]',
    category: 'single',
  },
  {
    raw: '[LoliHouse] 名侦探光之美少女♪ / Star Detective Precure! - 38 [WebRip 1080p HEVC-10bit AAC][无字幕](检索用：Q娃)',
    category: 'single',
  },
  { raw: '[影片搬運][雪鹰领主][GB][全26話][1080P][MP4]', category: 'single' },
  {
    raw: '[MagicStar] 假面骑士My-Th 番外篇 十二支十色 / 仮面ライダーマイス スピンオフ 十二支十色 EP07 [WEBDL] [1080p] [TTFC]【生】',
    category: 'single',
  },
  {
    raw: '[ANi] Yozakurasan Chi no Daisakusen S02 / 夜櫻家大作戰 第二季 - 41 [1080P][Baha][WEB-DL][AAC AVC][CHT][MP4]',
    category: 'single',
  },
  {
    raw: '[ANi] Sora wa Akai Kawa no Hotori / 赤河戀影 - 16 [1080P][Baha][WEB-DL][AAC AVC][CHT][MP4]',
    category: 'single',
  },
  {
    raw: '[沸班亚马制作组] 转生贵族凭鉴定技能扭转人生 第三季 - 02 [IQIYI WebRip 2160p H265 Veryslow AAC][简繁内封字幕]',
    category: 'single',
  },
  {
    raw: '[LoliHouse] FX战士久留美 / FX Senshi Kurumi-chan - 03 [WebRip 1080p HEVC-10bit AAC][简繁内封字幕]',
    category: 'single',
  },
  {
    raw: '[Skymoon-Raws] 夜櫻家大作戰 / Yozakurasan Chi no Daisakusen - 41 [ViuTV][WEB-DL][CHT][1080p][AVC AAC]',
    category: 'single',
  },
  {
    raw: '[桜都字幕组] 飙马野郎 JOJO的奇妙冒险 / Steel Ball Run： JoJo no Kimyou na Bouken [05][1080P][繁体内嵌]',
    category: 'single',
  },
  {
    raw: '[ANi] Sora wa Akai Kawa no Hotori / 赤河戀影 - 02 [1080P][Baha][WEB-DL][AAC AVC][CHT][MP4]',
    category: 'single',
  },
  {
    raw: '[三明治摆烂组&LoliHouse] 乱世千金倪亚·利斯顿转生为娇弱千金的弑神武人华丽无双录 / Kyouran Reijou Nia Liston - 02 [WebRip 1080p HEVC-10bit AAC][简繁日内封字幕]',
    category: 'single',
  },
  {
    raw: '[ANi] FX Senshi KURUMICHAN / FX 戰士久留美 - 03 [1080P][Baha][WEB-DL][AAC AVC][CHT][MP4]',
    category: 'single',
  },
  {
    raw: '[ANi] 冰劍的魔術師將要統一世界 2 - 02 [1080P][Baha][WEB-DL][AAC AVC][CHT][MP4]',
    category: 'single',
  },
  {
    raw: '[三明治摆烂组] 亂世千金倪亞·利斯頓轉生為嬌弱千金的弒神武人華麗無雙錄 / Kyouran Reijou Nia Liston / 凶乱令嬢ニア・リストン - 03 - [繁日內嵌][WebRip AVC 8bit 1080P]',
    category: 'single',
  },
  {
    raw: '[Skymoon-Raws] 遭到流放的轉生重騎士憑藉遊戲知識大開無雙 / Tsuihou sareta Tensei Juukishi wa Game Chishiki de Musou suru - 16 [ViuTV][WEB-DL][CHT][1080p][AVC AAC]',
    category: 'single',
  },
  {
    raw: '[沸班亚马制作组] 死神 千年血战篇-祸进谭- - 49 [IQIYI WebRip 2160p H265 Veryslow AAC][简繁内封字幕]',
    category: 'single',
  },
  {
    raw: '[咪路fans制作组]蜡笔小新 Crayonshinchan [227][1997.05.02][1080P][简日双语][数码修复版][MP4]',
    category: 'single',
  },
  {
    raw: '【今晚月色真美】[青之箱 第二季 / アオのハコ Season 2 / Ao no Hako Season 2][03][WebRip][1080P][AVC-8bit][AAC][简日内嵌]',
    category: 'single',
  },
  {
    raw: '【喵萌奶茶屋】★10月新番★[某暗部的少女共棲 / とある暗部の少女共棲 / Toaru Anbu no Item][02][1080p][繁日雙語]',
    category: 'single',
  },
  {
    raw: '[桜都字幕组] 飙马野郎 JOJO的奇妙冒险 / Steel Ball Run： JoJo no Kimyou na Bouken [04][1080P][繁体内嵌]',
    category: 'single',
  },
  {
    raw: '[❀拨雪寻春❀] 萤火虫的出嫁 / ホタルの嫁入り / Hotaru no Yomeiri / Firefly Wedding - 01 [WebRip][HEVC-10bit 1080p][简繁日内封]',
    category: 'single',
  },
  {
    raw: '[三明治摆烂组&LoliHouse] 乱世千金倪亚·利斯顿转生为娇弱千金的弑神武人华丽无双录 / Kyouran Reijou Nia Liston - 03 [WebRip 1080p HEVC-10bit AAC][简繁日内封字幕]',
    category: 'single',
  },
  {
    raw: '[绿茶字幕组&LoliHouse] 描绘直至生命尽头 / 画完这个就去死 / 畫完這個再去死 / これ描いて死ね / Kore Kaite Shine - 08 [WebRip 1080p HEVC-10bit AAC][简繁日内封字幕]',
    category: 'single',
  },
  {
    raw: '[Skymoon-Raws] 被放逐的作弊賦予魔術師享受隨心所欲的第二人生 / The Laid-Off Cheat-Granting Mage Enjoys a Second - 03 [ViuTV][WEB-DL][CHT][1080p][AVC AAC]',
    category: 'single',
  },
  {
    raw: '【2026夏季日剧】[MagicStar] 直到T恤干透 番外 / Tシャツが乾くまで サイドストーリー EP01.5 [WEBDL] [1080p]【生】',
    category: 'single',
  },
  {
    raw: '[LoliHouse] 魔法★探险家 / Magical Explorer - 04 [WebRip 1080p HEVC-10bit AAC][简繁内封字幕]',
    category: 'single',
  },
  {
    raw: '[绿茶字幕组] 青之箱 第二季 / Ao no Hako S2 [02][WebRip][1080p][简繁日内封]',
    category: 'single',
  },
  {
    raw: '【悠哈璃羽字幕社】[死神 千年血战篇 祸进谭]/ [Bleach Thousand Year Blood War][49][x264 1080p][CHS][简体内嵌]',
    category: 'single',
  },
  {
    raw: '【悠哈璃羽字幕社】[死神 千年血戰篇 禍進譚]/ [Bleach Thousand Year Blood War][49][x264 1080p][CHT][繁體內嵌]',
    category: 'single',
  },
  {
    raw: '[桜都字幕组] 弹珠汽水瓶里的千岁同学 第二季 / Chitose-kun wa Ramune Bin no Naka (2026) [01][1080P][简体内嵌]',
    category: 'single',
  },
  {
    raw: '[LoliHouse] FX战士久留美 / FX Senshi Kurumi-chan - 01 [WebRip 1080p HEVC-10bit AAC][简繁内封字幕]',
    category: 'single',
  },
  {
    raw: '[jibaketa合成&壓制][TVB粵語]歌姬奏章：皇家少女樂團 / Princession Orchestra - 40 [粵語+無字幕][BD 1920x1080 x264 AAC YUE]',
    category: 'single',
  },
  {
    raw: '[ANi] Sora wa Akai Kawa no Hotori / 赤河戀影 - 04 [1080P][Baha][WEB-DL][AAC AVC][CHT][MP4]',
    category: 'single',
  },
  {
    raw: '[ANi] Horemajo / 你好，身為魔女的我，被心上人委託製作迷情藥 - 03 [1080P][Baha][WEB-DL][AAC AVC][CHT][MP4]',
    category: 'single',
  },
  {
    raw: '[LoliHouse] 青箱 第二季 / Ao no Hako S2 / Blue Box S2 - 26 [WebRip 1080p HEVC-10bit AAC][简繁内封字幕]',
    category: 'single',
  },
  {
    raw: '[LoliHouse] 朱色假面 / Shuiro no Kamen - 01 [WebRip 1080p HEVC-10bit AAC][简繁内封字幕]',
    category: 'single',
  },
  {
    raw: '[ANi] Sora wa Akai Kawa no Hotori / 赤河戀影 - 05 [1080P][Baha][WEB-DL][AAC AVC][CHT][MP4]',
    category: 'single',
  },
  {
    raw: '[LoliHouse] FX战士久留美 / FX Senshi Kurumi-chan - 02 [WebRip 1080p HEVC-10bit AAC][简繁内封字幕]',
    category: 'single',
  },
  {
    raw: '[GM-Team][云深不知梦 特别篇 逐冥之役][Eclipse of Illusion SP-The Miasma War][2026][05][4K HEVC 10Bit]',
    category: 'single',
  },
  {
    raw: '[搬运][Geoko]蒼き伝承 ウェルシュ＆シェダー 03|Aoki Denshou: Welsh & Shedar 03(1080P 无字幕)',
    category: 'single',
  },
  {
    raw: '[ANi] Shuiro no Kamen / 朱色假面 - 02 [1080P][Baha][WEB-DL][AAC AVC][CHT][MP4]',
    category: 'single',
  },
  {
    raw: '[沸班亚马制作组] 转生贵族凭鉴定技能扭转人生 第三季 - 02 [CR WebRip 1080p H265 Veryslow AAC][简繁内封字幕]',
    category: 'single',
  },
  {
    raw: '[桜都字幕组] 物语系列 番外＆怪物季 / Monogatari Series： Off & Monster Season [14][1080p][简体内嵌]',
    category: 'single',
  },
  {
    raw: '[ANi] Chitosekun wa Ramune Bin no Naka / 彈珠汽水瓶裡的千歲同學 - 15 [1080P][Baha][WEB-DL][AAC AVC][CHT][MP4]',
    category: 'single',
  },
  {
    raw: '[桜都字幕组] 飙马野郎 JOJO的奇妙冒险 / Steel Ball Run： JoJo no Kimyou na Bouken [05][1080P][简繁内封]',
    category: 'single',
  },
  {
    raw: '[桜都字幕组] 弹珠汽水瓶里的千岁同学 第二季 / Chitose-kun wa Ramune Bin no Naka (2026) [01][1080P][简繁内封]',
    category: 'single',
  },
  {
    raw: '【喵萌奶茶屋】★10月新番★[佐佐木与文鸟小哔 第二季 / Sasaki to Pii-chan S2][02][1080p][简日双语]',
    category: 'single',
  },
  {
    raw: '[ANi]  重生者的魔法一定要特別 第二季 - 15 [1080P][Baha][WEB-DL][AAC AVC][CHT][MP4]',
    category: 'single',
  },
  {
    raw: '[LoliHouse] 佐佐木与文鸟小哔 第二季 / Sasaki to P-chan S2 - 03 [WebRip 1080p HEVC-10bit AAC][简繁内封字幕]',
    category: 'single',
  },
  {
    raw: '[沸班亚马制作组] 青之箱 第二季 - 02 [BILIBILI WebRip 2160p H265 Veryslow EAC3][简繁内封字幕]',
    category: 'single',
  },
  {
    raw: '[Billion Meta Lab] 魔法姐妹露露莉莉 Mahou no Shimai Rurutto Riryi [14][1080P][繁日內嵌]',
    category: 'single',
  },
  {
    raw: '[ANi] Tensei Shitara Ken Deshita S02 /  轉生就是劍 第二季 - 04 [1080P][Baha][WEB-DL][AAC AVC][CHT][MP4]',
    category: 'single',
  },
  {
    raw: '[LoliHouse] 归还者的魔法要特别 / 重生者的魔法一定要特别 / Kikansha no Mahou wa Tokubetsu desu - 14 [WebRip 1080p HEVC-10bit AAC][简繁内封字幕](检索：第二季)',
    category: 'single',
  },
  {
    raw: '[绿茶字幕组] 我推的孩子 第三季 / Oshi no Ko S3 [25-35 修正合集][WebRip][1080p][简繁日内封]',
    category: 'season',
  },
  {
    raw: '[LoliHouse] 铠真传武士骑兵 / Yoroi Shin Den Samurai Troopers [13-24 合集][WebRip 1080p HEVC-10bit AAC][无字幕][Fin]',
    category: 'season',
  },
  {
    raw: '[LoliHouse] 『你们先走我断后』，于是10年后我成为了传说 / Koko wa Ore ni Makasete Saki ni Ike to Itte kara 10-nen ga Tattara Densetsu ni Natteita. [01-12 合集][WebRip 1080p HEVC-10bit AAC][简繁内封字幕][Fin]',
    category: 'season',
  },
  {
    raw: '[喵萌奶茶屋&LoliHouse] 琉璃的宝石 / Ruri no Houseki [01-13 修正合集][WebRip 1080p HEVC-10bit AAC][简繁日内封字幕][Fin]',
    category: 'season',
  },
  {
    raw: '【百冬練習組】【戰隊大失格_Sentai Daishikkaku】[01-12][1080p AVC AAC][繁體][合集]',
    category: 'season',
  },
  {
    raw: '[千夏字幕组][传颂之物 二人的白皇_Utawarerumono Futari no Hakuoro][第01-28话][1080p_HEVC][简繁内封][合集]',
    category: 'season',
  },
  {
    raw: '[爱恋字幕社] 魔法少女奈叶EXCEEDS Gun Blaze Vengeance/Mahou Shoujo Lyrical Nanoha EXCEEDS (01-12Fin WEBRIP 1080p AVC AAC 简中)',
    category: 'season',
  },
  {
    raw: '[7³ACG] 藤本树 17-26/Tatsuki Fujimoto 17-26 S01 | 01-08 [简繁字幕] BDrip 1080p x265 OPUS 2.0',
    category: 'season',
  },
  {
    raw: '【豌豆字幕组】[关于我转生变成史莱姆这档事 第四季 / Tensei Shitara Slime Datta Ken S4][01-24(73-96)][简体][1080P][MP4]',
    category: 'season',
  },
  {
    raw: "[绿茶字幕组] 身为暗杀者的我明显比勇者还强 / My Status As An Assassin Obviously Exceeds The Hero's [01-12 修正合集 v2][WebRip][1080p][繁简日内封]",
    category: 'season',
  },
  {
    raw: '[LoliHouse] 正后方的神威 / 從後面來的神威先生 / うしろの正面カムイさん / Ushiro no Shoumen Kamui-san [01-12 合集][WebRip 1080p HEVC-10bit AAC][简繁内封字幕][Fin]',
    category: 'season',
  },
  {
    raw: '[桜都字幕组] 阿鲁斯的巨兽 / Ars no Kyojuu [1-12 Fin v2][1080p][简繁内封]',
    category: 'season',
  },
  { raw: '[轻之国度字幕组][Anima Yell!][合集][720P][MP4]', category: 'season' },
  {
    raw: '【悠哈璃羽字幕社&西农YUI汉化组】[暗芝居 第十四季_Yami Shibai 14][01-13 END][x264 1080p][CHS]',
    category: 'season',
  },
  {
    raw: '電馭叛客：邊緣行者 2「サイバーパンク：エッジランナーズ２」Cyberpunk Edgerunners S02E01~10 1080p 日英雙語-多國字幕',
    category: 'season',
  },
  {
    raw: '[LoliHouse] BLACK TORCH 暗黑灯火 [01-12 合集][WebRip 1080p HEVC-10bit AAC][简繁内封字幕][Fin]',
    category: 'season',
  },
  {
    raw: '【合集】【2026夏季日剧】[MagicStar] Black Trick ~操控裁决的辩护人~ / ブラックトリック ~裁きを操る弁護人~ [WEBDL] [1080p] [Netflix]【生】【附官方日英简繁中字幕】',
    category: 'season',
  },
  {
    raw: '[7³ACG] 左撇子艾伦/Hidarikiki no Eren S01 | 01-13 [简繁字幕] BDrip 1080p x265 OPUS 2.0',
    category: 'season',
  },
  {
    raw: '[❀拨雪寻春❀] 四月是你的谎言 / 四月は君の嘘 / Shigatsu wa Kimi no Uso / Your Lie in April [BDRip][HEVC-10bit 1080p][简繁日内封][Rev.]',
    category: 'season',
  },
  {
    raw: '[绿茶字幕组] 魔都精兵的奴隶 第二季 / Mato Seihei no Slave 2 [13-24修正合集][WebRip][1080p][简繁日内封]',
    category: 'season',
  },
  {
    raw: '【DHR動研字幕組】[請讓我撒嬌，仙狐大人！_Sewayaki Kitsune no Senko-san][01-12全][繁體][720P][MP4](合集版本)',
    category: 'season',
  },
  {
    raw: '[風車字幕組][魔法戰爭Mahou Sensou][01-12][完][繁體][MP4][720P]',
    category: 'season',
  },
  {
    raw: '【动漫国字幕组】★10月新番[SPY×FAMILY间谍家家酒 / 间谍过家家][01-50(全集)][1080P][简体][MP4]',
    category: 'season',
  },
  {
    raw: '[LoliHouse] 我与尼特女忍者的莫名同居生活 / NEET Kunoichi [01-12+EX 合集][WebRip 1080p HEVC-10bit AAC][简繁内封字幕][Fin]',
    category: 'season',
  },
  {
    raw: '[WBX-Raws] Go！プリンセスプリキュア/Go！Princess Precure/Go！Princess 光之美少女 TV EP01-50 全 [BDrip][HEVC 1080P FLAC]（附Musical Show）',
    category: 'season',
  },
  {
    raw: '[爱恋&漫猫字幕组] 令和妖神斑小姐/Reiwa no Dara-san (01-13Fin WEBRIP 1080p AVC AAC MP4 2026年7月 简中)',
    category: 'season',
  },
  {
    raw: '[LoliHouse] 文豪野犬 汪！2 / Bungou Stray Dogs Wan! S2 [01-12 合集][WebRip 1080p HEVC-10bit AAC][简繁内封字幕][Fin]',
    category: 'season',
  },
  {
    raw: '[绿茶字幕组] Silent Witch 沉默魔女的秘密 / Silent Witch - Chinmoku no Majo no Kakushigoto [01-13 修正合集][BDRip][HEVC-10bit 1080p FLAC ASSx2][简繁日内封]',
    category: 'season',
  },
  {
    raw: '[DBD-Raws][亲吻姐姐/kiss×sis][OAD][00-11全集][1080P][BDRip][HEVC-10bit][简繁外挂][FLAC][MKV](キス×シス)',
    category: 'season',
  },
  {
    raw: '真・恋姫†無双 全話 BDRip 1920x1080 x264 AAC (BD Original Version)',
    category: 'season',
  },
  {
    raw: '[Clarita] 岩元前辈的推荐 / Iwamoto-senpai no Suisen [01-12 合集][WebRip 1080p HEVC-10bit AAC][繁体内封字幕][Fin]',
    category: 'season',
  },
  {
    raw: '[LoliHouse] 盗掘王 / 盗墓王 / 我独自盗墓 / Tomb Raider King / Toukutsu Ou [01-12 合集][WebRip 1080p HEVC-10bit AAC][简繁内封字幕][Fin]',
    category: 'season',
  },
  {
    raw: '[LoliHouse] 擅长逃跑的殿下 第二季 / 少主溜得快 第二季 / Nige Jouzu no Wakagimi S2 [01-12 合集][WebRip 1080p HEVC-10bit AAC][简繁内封字幕][Fin]',
    category: 'season',
  },
  {
    raw: '【幻櫻字幕組】【殺手寓言 The Fable】【01~25】【BIG5_MP4】【1280X720】【合集】',
    category: 'season',
  },
  {
    raw: '[DBD-Raws][太阳战队太阳火神/Taiyo Sentai Sun Vulcan][01-50TV全集][1080P][HDTVRip][HEVC-10bit][AAC][MKV](太陽戦隊サンバルカン)',
    category: 'season',
  },
  {
    raw: '六四位元字幕組★跨越種族與你相戀 Kimi to Koete Koi ni Naru★01~12(完)★1920x1080★AVC AAC MP4★繁體中文(全修正合集+ass字幕)',
    category: 'season',
  },
  {
    raw: '[绿茶字幕组] 能帮我弄干净吗？ / Kirei ni Shite Moraemasu ka [01-12 修正合集 v2][WebRip][1080p][简繁日内封]',
    category: 'season',
  },
  {
    raw: '[漫貓字幕社&貓戀漢化組] 物語系列 番外 怪物季/Monogatari Series Off Monster Season (01-14Fin WEBRIP 1080p AVC AAC MP4 2024年7月 繁中)',
    category: 'season',
  },
  { raw: '【R2RAW】】【魔法の天使】【我是小甜甜】[全话]', category: 'season' },
  {
    raw: '[DBD-Raws][头号战队豪兽者/No.1 Sentai Gozyuger][01-49TV全集+特典映像][1080P][BDRip][HEVC-10bit][日文内封][FLAC][MKV](ナンバーワン戦隊ゴジュウジャー)',
    category: 'season',
  },
  {
    raw: 'Sakura 2022 Lycoris Recoil s01 01-13 1080p HEVC',
    category: 'season',
  },
  {
    raw: '【幻樱字幕组】【租借女友第二季 Kanojo Okarishimasu S2】【合集V2】【GB_MP4】【1280X720】',
    category: 'season',
  },
  {
    raw: '[GM-Team][国漫][择日飞升][A Good Day to Ascend][2026][13-16][HEVC][GB][4K]',
    category: 'season',
  },
  {
    raw: "[LP-Raws&离谱Sub] BanG Dream! It's MyGO!!!!! [01-13 Fin][BDRip AVC-8bit AAC][1080p][简日内嵌][三次校对字幕][REV]",
    category: 'season',
  },
  {
    raw: '[LoliHouse] MAO摩绪 [01-26 合集][WebRip 1080p HEVC-10bit AAC][简繁内封字幕][Fin]',
    category: 'season',
  },
  {
    raw: '[澄空学园&雪飘工作室][碧蓝幻想 二期][GRANBLUE FANTASY-The Animation Season2][01-12&EX1 合集][720p][简体内嵌]',
    category: 'season',
  },
  {
    raw: '[アニメ BD] ストライクウィッチーズ 全話 (1920x1080 H.264／AVC AAC 字幕)',
    category: 'season',
  },
  {
    raw: '六四位元字幕組★哪裡有溫柔對待阿宅的辣妹！？ Otaku ni Yasashii Gal wa Inai★01~12(完)★1920x1080★AVC AAC MP4★繁體中文(全修正合集+ass字幕)',
    category: 'season',
  },
  {
    raw: '六四位元字幕組★死靈之子的宇宙恐怖秀 Necronomico no Cosmic Horror Show★01~12_完★1920x1080★AVC AAC MP4★繁體中文(全修正合集+ass字幕)',
    category: 'season',
  },
  {
    raw: '[豌豆字幕组&LoliHouse] 王者天下 第六季 / Kingdom S6 [01-13 修正合集][WebRip 1080p HEVC-10bit AAC][简繁外挂字幕][Fin]',
    category: 'season',
  },
  {
    raw: "【喵萌奶茶屋】★04月新番★[杂旅 / 随兴旅-That's Journey- / Zatsu Tabi: That's Journey][01-12][1080p][简日双语]",
    category: 'season',
  },
  {
    raw: '[LoliHouse] 幼女战记II / Youjo Senki II [01-12 合集][WebRip 1080p HEVC-10bit AAC][简繁内封字幕][Fin](检索用：谭雅战记)',
    category: 'season',
  },
  {
    raw: '六四位元字幕組★阿爾瑪醬想成為家人 Alma-chan wa Kazoku ni Naritai★01~11(完)★1920x1080★AVC AAC MP4★繁體中文(全修正合集+ass字幕)',
    category: 'season',
  },
  {
    raw: '[LoliHouse] 乙女游戏世界对路人角色很不友好2 / Otome Game Sekai wa Mob ni Kibishii Sekai desu 2 [01-12 合集][WebRip 1080p HEVC-10bit AAC][简繁内封字幕][Fin](检索：女性向游戏世界 恋爱游戏世界)',
    category: 'season',
  },
  {
    raw: '未来少年柯南.未来少年コナン.Future.Boy.Conan.英语+日语+法语.英文+法文.Disc1.EP01-EP07.Remux.GBR.SDR.UHD.Blu-ray.2160P.HEVC.DTS-HD.MA.2.0-ZF(小水管做种)',
    category: 'season',
  },
  {
    raw: '[绿茶字幕组] 能帮我弄干净吗？ / Kirei ni Shite Moraemasu ka [01-12 修正合集 v3][WebRip][1080p][简繁日内封]',
    category: 'season',
  },
  {
    raw: '六四位元字幕組★金牌得主 第二季 Medalist 2★14~22(完)★1920x1080★AVC AAC MP4★繁體中文(全修正合集+ass字幕)',
    category: 'season',
  },
  {
    raw: '【CXRAW】【ドラゴンボール超】【龙珠超】【1-131Fin】【BDrip】【HEVC Main10P FLAC MKV】',
    category: 'season',
  },
  {
    raw: '[喵萌奶茶屋&LoliHouse] 全修。 / ZENSHU [01-12 修正合集 v2][WebRip 1080p HEVC-10bit AAC][简繁日内封字幕][Fin]',
    category: 'season',
  },
  {
    raw: '[喵萌奶茶屋&LoliHouse] 金牌得主 / Medalist [14-22 修正合集][WebRip 1080p HEVC-10bit AAC][简繁日内封字幕][Fin]',
    category: 'season',
  },
  {
    raw: '【爱咕字幕组】回复术士之重启人生[Kaifuku_Jutsushi_no_Yarinaoshi_-_01~12 END_[AT-X][WebRip 1920x1080 AAC][简体内嵌]完全回复版',
    category: 'season',
  },
  {
    raw: '[豌豆字幕组&风之圣殿&LoliHouse] 咒术回战 / Jujutsu Kaisen [48-59 修正合集][WebRip 1080p HEVC-10bit AAC][简繁外挂字幕][Fin]',
    category: 'season',
  },
  {
    raw: '[亿次研同好会&三明治摆烂组] 日本三国 / Nippon Sangoku / 日本三國 [01-12 修正合集][简繁日内封][WebRip HEVC-10bit 1080P AAC][V2]',
    category: 'season',
  },
  {
    raw: 'SFSub&六四位元字幕組★29歲單身中堅冒險家的日常 29-sai Dokushin Chuuken Boukensha no Nichijou★01~12(完)★1920x1080★AVC AAC MP4★繁體中文&日文字幕(全修正合集+ass字幕)',
    category: 'season',
  },
  {
    raw: '(アニメ BD) オオカミさんと七人の仲間たち 全話 (1920x1080 x264 AAC)',
    category: 'season',
  },
  {
    raw: '[LoliHouse] 从0位居民开始的边境领主大人 / Ryoumin 0-nin Start no Henkyou Ryoushu-sama [01-12 合集][WebRip 1080p HEVC-10bit AAC][简繁内封字幕][Fin]',
    category: 'season',
  },
  {
    raw: '[MingY&熔岩动画Sub] 街角魔族 2丁目 / Machikado Mazoku S2 [01-12+Mini][BDRip][简日内嵌]（校对合集）',
    category: 'season',
  },
  {
    raw: '[7³ACG] SPY×FAMILY 间谍家家酒 第3季/Spy x Family S03 | 01-13 [简繁字幕] BDrip 1080p x265 OPUS 2.0',
    category: 'season',
  },
  {
    raw: '[7³ACG] 夏目友人帐/Natsume Yuujinchou S01 | 01-13 [简繁字幕] BDrip 1080p x265 OPUS 2.0',
    category: 'season',
  },
  {
    raw: '【中肯字幕組】【1月新番】【川尻小玉的懒散生活】【全集】【BIG5_MP4】【1920X1080】',
    category: 'season',
  },
  {
    raw: '[SweetSub][机动战士高达 GQuuuuuuX][Mobile Suit Gundam GQuuuuuuX][01-12 精校合集][WebRip][1080P][AVC 8bit][简日双语]',
    category: 'season',
  },
  {
    raw: '[霜庭云花Sub][BanG Dream! Ave Mujica][01-13 合集][1080P][AVC AAC][简日双语][WebRip]',
    category: 'season',
  },
  {
    raw: '【极影字幕·毁片党】 男女之间存在友情吗？不，不存在！ 第01-12集 GB_CN HEVC_opus 1080p',
    category: 'season',
  },
  {
    raw: '【PMFAN字幕组】【宝可梦 钻石&珍珠】【000-193+M10-M13】【合集】【中日双语字幕】【480P+1080P】【MP4】宠物小精灵DP 检索用',
    category: 'season',
  },
  {
    raw: '[❀拨雪寻春❀] 恶女不才，请多包涵 ~雏宫蝶鼠换身传~ / ふつつかな悪女ではございますが / Futsutsuka na Akujo de wa Gozaimasu ga [01-11 Fin.][WebRip][HEVC-10bit 1080p][简繁日内封]',
    category: 'season',
  },
  {
    raw: '[DBD-Raws][红战士在异世界成了冒险者/Sentai Red Isekai de Boukensha ni Naru][01-12TV全集+特典映像][1080P][BDRip][HEVC-10bit][简繁外挂][FLAC][MKV](戦隊レッド 異世界で冒険者になる)',
    category: 'season',
  },
  {
    raw: '[诸神字幕组][男子游泳部 第三季][Free! - Dive to the Future][01-12完][简繁日语字幕][1080P][HEVC MKV]',
    category: 'season',
  },
  {
    raw: '[7³ACG] 黑执事：绿之魔女篇/Kuroshitsuji S05 | 01-13 [简繁字幕] BDrip 1080p x265 OPUS 2.0',
    category: 'season',
  },
  {
    raw: '[喵萌奶茶屋&VCB-Studio] 赛博朋克：边缘行者 / Cyberpunk Edgerunners / サイバーパンク: エッジランナーズ 10-bit 1080p HEVC BDRip [S1 Fin]',
    category: 'season',
  },
  {
    raw: '[云光字幕组] 二十世纪电气目录 Nijuuseiki Denki Mokuroku [合集][简体双语][1080p]招募翻译',
    category: 'season',
  },
  {
    raw: '[豌豆字幕组&LoliHouse] 关于我转生变成史莱姆这档事 第四季 / Tensei Shitara Slime Datta Ken 4th Season [01-24(73-96) 合集][WebRip 1080p HEVC-10bit AAC][简繁外挂字幕][Fin]',
    category: 'season',
  },
  {
    raw: '[DBD-Raws][关于我转生变成史莱姆这档事 OAD/Tensei Shitara Slime Datta Ken OAD][01-05合集][1080P][BDRip][HEVC-10bit][简繁外挂][FLAC][MKV](転生したらスライムだった件 OAD)',
    category: 'season',
  },
  {
    raw: '[LoliHouse] 在超市后门吸烟的二人 / 躲在超市后门抽烟的两人 / Super no Ura de Yani Suu Futari [01-12 合集][WebRip 1080p HEVC-10bit AAC][简繁内封字幕][Fin]',
    category: 'season',
  },
  {
    raw: '[冷番补完字幕组][飘泊的太阳][さすらいの太陽][Sasurai no Taiyou][1971][TV 01-26Fin][720p][内封简繁中字]',
    category: 'season',
  },
  {
    raw: '[アニメ][全話]To Heart -Remember my Memories- 1-13&To Heart 1-13',
    category: 'season',
  },
  {
    raw: 'BACCANO! －バッカーノ！－ 全話 (BD 1920x1080 x264 AAC)',
    category: 'season',
  },
  {
    raw: '[7³ACG] 黑执事 寄宿学校篇/Kuroshitsuji S04 | 01-11 [简繁字幕] BDrip 1080p AV1 OPUS 2.0',
    category: 'season',
  },
  {
    raw: '[LoliHouse] 最强废渣皇子暗中活跃于帝位之争 / Degarashi Ouji no Anyaku Teii Arasoi [01-12 合集][WebRip 1080p HEVC-10bit AAC][简繁内封字幕][Fin]',
    category: 'season',
  },
  {
    raw: '[Prejudice-Studio] 与你相恋至生命尽头 Kimi ga Shinu made Koi wo Shitai [01-13 精修合集][WebRip 1080P HEVC 10Bit AAC MKV][简繁日内封][V2]',
    category: 'season',
  },
  {
    raw: '[SweetSub][Alien 9][01-04 合集][BDRip][1080P][AVC 8bit][简日双语]（检索用：校园外星人，异形特攻学园）',
    category: 'season',
  },
  {
    raw: '【楓葉字幕組】[寵物小精靈 / 寶可夢 旅途][001-136+SP01-04][合集][繁體][1080P][MP4]',
    category: 'season',
  },
  {
    raw: "[VCB-Studio] 不幸职业【鉴定士】实则最强 / Fuguushoku 'Kanteishi' ga Jitsu wa Saikyou Datta / 不遇職【鑑定士】が実は最強だった 10-bit 1080p HEVC BDRip [Fin]",
    category: 'season',
  },
  {
    raw: '【喵萌奶茶屋】[我喜歡的女孩忘記戴眼鏡 / Suki na Ko ga Megane wo Wasureta][01-13END][BDRip][1080p][繁日雙語][招募翻譯]',
    category: 'season',
  },
  {
    raw: '未来少年柯南.未来少年コナン.Future.Boy.Conan.英语+日语+法语.英文+法文.Disc3.EP14-EP20.Remux.GBR.SDR.UHD.Blu-ray.2160P.HEVC.DTS-HD.MA.2.0-ZF(小水管做种,做种时间不固定,一般晚上)',
    category: 'season',
  },
  {
    raw: '六四位元字幕組★自稱惡役千金的未婚妻觀察紀錄 Jishou Akuyaku Reijou na Konyakusha no Kansatsu Kiroku★01~12(完)★1920x1080★AVC AAC MP4★繁體中文(全修正合集+ass字幕)',
    category: 'season',
  },
  {
    raw: '[酷漫404][輝夜姬想讓人告白 一超級浪漫一][01-13][1080P][WebRip][繁日雙語(內嵌+外掛)][AVC AAC][MP4][字幕組招人內詳]',
    category: 'season',
  },
  {
    raw: '[DBD-Raws][返乡战士/帝皇战纪/Overman King Gainer][01-26TV全集+特典][1080P][BDRip][HEVC-10bit][简繁外挂][FLAC][MKV](オーバーマン キングゲイナー)',
    category: 'season',
  },
  {
    raw: '[DBD-Raws][超级潜水艇99/Submarine Super 99][01-13TV全集+特典映像][美版/USA.Ver][1080P][BDRip][HEVC-10bit][AC3+FLAC][MKV](サブマリン スーパー99)',
    category: 'season',
  },
  {
    raw: '[Amor字幕组&萌樱字幕组][杀手奶爸 Buddy Diddies][01-12][CHS CHT_JP][合集][1080P][HDrip][MP4][急招翻譯校對時軸特效]',
    category: 'season',
  },
  {
    raw: '[愛戀字幕組&丸子家族][Lady寶石寵物(Lady Jewel Pet)][01-52_合集][BIG5][720P][MP4]',
    category: 'season',
  },
  {
    raw: '[LoliHouse] 数码宝贝BEATBREAK / DIGIMON BEATBREAK [01-49 合集][WebRip 1080p HEVC-10bit AAC][简繁内封字幕][Fin]',
    category: 'season',
  },
  {
    raw: '【夢幻戀櫻字幕組】[Sora no Method][天體的秩序/天體的運行式][第01-13話][完結][BIG5][MP4](附全提供畫面牆紙/本作ass特效)',
    category: 'season',
  },
  {
    raw: '[晚街與燈][Re：從零開始的異世界生活 第四季合集 全（喪失篇+奪回篇+小劇場） / Re:Zero kara Hajimeru Isekai Seikatsu 4th][總第67~85][WebRip][1080P_AVC_AAC][繁日雙語內嵌]',
    category: 'season',
  },
  {
    raw: '[豌豆字幕组&LoliHouse] Kuroshitsuji - Midori no Majo-hen / 黑执事 绿之魔女篇 [01-13 合集][WebRip 1080p HEVC-10bit AAC][简繁外挂字幕][Fin]',
    category: 'season',
  },
  {
    raw: '[GM-Team][云深不知梦 特别篇 逐冥之役][Eclipse of Illusion SP-The Miasma War][2026][01-06 Fin][4K HEVC 10Bit]',
    category: 'season',
  },
  {
    raw: '[7³ACG] Tougen Anki S01 | 01-24 [简繁字幕] BDrip 1080p x265 OPUS 2.0',
    category: 'season',
  },
  {
    raw: '[愛戀字幕社][4月新番][歲月流逝飯菜依舊美味][Hibi wa Sugiredo Meshi Umashi][01-12][1080P][MP4][繁中]',
    category: 'season',
  },
  {
    raw: '[诸神字幕组][我心里危险的东西][Boku no Kokoro no Yabai Yatsu][01-25+SP全][BDRip][简繁日语字幕][1080P][HEVC MKV]',
    category: 'season',
  },
  { raw: 'イリヤの空、UFOの夏 全話+おまけ(640*480 AVI)', category: 'season' },
  {
    raw: '[LoliHouse] 令和妖神斑小姐 / Reiwa no Dara-san [01-13 合集][WebRip 1080p HEVC-10bit AAC][简繁内封字幕][Fin]',
    category: 'season',
  },
  {
    raw: '[DBD-Raws][东岛丹三郎想成为假面骑士/Toujima Tanzaburou wa Kamen Rider ni Naritai][01-24TV全集+特典映像][1080P][BDRip][HEVC-10bit][简繁外挂][FLAC][MKV](東島丹三郎は仮面ライダーになりたい)',
    category: 'season',
  },
  {
    raw: '[DBD-Raws][不擅吸血的吸血鬼/Chanto Suenai Kyuuketsuki-chan][01-12TV全集][1080P][BDRip][HEVC-10bit][简繁外挂][FLAC][MKV](ちゃんと吸えない吸血鬼ちゃん)',
    category: 'season',
  },
  {
    raw: '[雪飘工作室][幸福充电光之美少女/HappinessCharge_Precure!/ハピネスチャージプリキュア！][BDrip][37-49_END][简繁外挂](检索:Q娃)',
    category: 'season',
  },
  {
    raw: '[喵萌奶茶屋&LoliHouse] 和雨和你 / 雨天遇见狸 / Ame to Kimi to [01-12 修正合集][WebRip 1080p HEVC-10bit AAC][简繁日内封字幕][Fin]',
    category: 'season',
  },
  {
    raw: '[绿茶字幕组] 金牌得主 第二季 / Medalist S2 [14-22][BDRip][1080p][简繁日内封]',
    category: 'season',
  },
  {
    raw: '[亿次研同好会&三明治摆烂组] 日本三国 / Nippon Sangoku / 日本三國 [01-12 修正合集][繁日內嵌][WebRip AVC 8bit 1080P AAC]',
    category: 'season',
  },
  {
    raw: '【TSDM字幕组】[以死亡游戏为生。／靠死亡遊戲混飯吃。][Shibou Yuugi de Meshi wo Kuu][01-11全集][HEVC-10bit 1080p AAC][MKV][简繁日内封字幕]死亡遊戯で飯を食う',
    category: 'season',
  },
  {
    raw: '[LoliHouse] 入间同学入魔了！S4 / Mairimashita! Iruma-kun S4 [01-24 合集][WebRip 1080p HEVC-10bit AAC][简繁内封字幕][Fin]',
    category: 'season',
  },
  {
    raw: '[LoliHouse] 碧蓝航线 微速前进 二 / Azur Lane - Bisoku Zenshin! S2 [01-12 合集][WebRip 1080p HEVC-10bit AAC][简繁内封字幕][Fin]',
    category: 'season',
  },
  {
    raw: '【TSDM字幕组】[恶魔阿萨谢尔在召唤你][AZAZEL_SAN][1-13+2OAD][MKV简繁内挂][720P]',
    category: 'season',
  },
  {
    raw: '[7³ACG] 南镰仓高校女子自行车社/Minami Kamakura Koukou Joshi Jitensha-bu S01 | 01-12+SPx1 [简繁字幕] BDrip 1080p x265 OPUS 2.0',
    category: 'season',
  },
  {
    raw: '[桜都字幕组] 「只能触摸一分钟哦...」合租房的秘密规则。 / 「1 Funkan dake Furete mo Ii yo...」 Share House no Himitsu Rule. [01-08 Fin][1080p][简体内嵌]',
    category: 'season',
  },
  {
    raw: '[c.c動漫][1月新番][為了養老金去異界存八萬金][01-12][合集][BIG5][1080P][MP4]',
    category: 'season',
  },
  {
    raw: '[绿茶字幕组] 间谍过家家 第3期/SPY×FAMILY Season 3 [38-50 修正合集][WebRip][1080p][简繁日内封]',
    category: 'season',
  },
  {
    raw: '【极影字幕·毁片党】完全相反的你和我 第01-25集 GB_CN AV1_opus 1080p',
    category: 'season',
  },
  {
    raw: '【合集】結城友奈は勇者である 结城友奈是勇者 01-30',
    category: 'season',
  },
  {
    raw: '【百冬練習組】【BanG Dream Morfonication】[1080p AVC AAC][繁體][修正合集]',
    category: 'season',
  },
  {
    raw: '【動漫國字幕組】★04月新番[躍動青春][01-12(全集)][720P][繁體][MP4]',
    category: 'season',
  },
  {
    raw: '【RAW】【Kaitou Saint Tail_怪盜 セイント☆テ-ル_怪盗圣少女】【全话】',
    category: 'season',
  },
  {
    raw: '【MCE汉化组】[鬼灭之刃][Kimetsu no Yaiba][鬼灭学园物语][情人节篇][01-04][简体][1080p][x264 AAC]',
    category: 'season',
  },
  {
    raw: '【澄空学园&动漫国字幕组】[午夜的倾心旋律][01-12][BDRip][AVC_AAC][720P][简体][MP4]',
    category: 'season',
  },
  {
    raw: '[喵萌奶茶屋&LoliHouse] 记忆缝线 / Your Forma / ユア・フォルマ - [01-13 精校合集][WebRip 1080p HEVC-10bit AAC][简繁日内封字幕][Fin]',
    category: 'season',
  },
  {
    raw: '【澄空学园&华盟字幕社】 甘城光辉游乐园 Amagi Brilliant Park 01-13 MKV 720P 简繁外挂 合集',
    category: 'season',
  },
  {
    raw: '[绿茶字幕组] 靠死亡游戏混饭吃。 / Shibou Yuugi de Meshi wo Kuu [01-11修正合集][WebRip][1080p][简繁日内封](检索用：以死亡游戏为生。）',
    category: 'season',
  },
  {
    raw: '[DBD-Raws][正义使者 我的英雄学院之非法英雄/Vigilante Boku no Hero Academia Illegals][01-13TV全集][1080P][BDRip][HEVC-10bit][简繁外挂][FLAC][MKV](ヴィジランテ-僕のヒーローアカデミアILLEGALS-)',
    category: 'season',
  },
  {
    raw: '[銀色子彈字幕組][名偵探柯南][SEASON2021 年度TV合集][993-1032][繁日雙語MP4][1080P]',
    category: 'season',
  },
  {
    raw: '【华盟字幕社】[七月新番][Koimonogatari][恋物语][全][GB][720p_MP4]',
    category: 'season',
  },
  {
    raw: '[GM-Team][国漫][画江湖之不良人 第7季][Drawing Jianghu of Bu Liang Ren Ⅶ][2025][01-12 Fin][HEVC][GB][4K]',
    category: 'season',
  },
  {
    raw: '【豌豆字幕组】[七大罪 Nanatsu no Taizai][01-24+OAD01-02+SP01-04][合集][GB简体][720P][MP4][百度网盘]',
    category: 'season',
  },
  {
    raw: '[罗小黑战记/The Legend of LuoXiaohei][正片01-27+番外01-03][简体][网盘][普通版]',
    category: 'season',
  },
  {
    raw: '[晚街与灯][Re：从零开始的异世界生活 第四季合集 全（丧失篇+夺回篇+小剧场） / Re:Zero kara Hajimeru Isekai Seikatsu 4th][总第67~85][WebRip][1080P_AVC_AAC][简日双语内嵌]',
    category: 'season',
  },
  {
    raw: '【DMHY】【多田君不恋爱/Tada-kun wa Koi o Shinai】[01-13][合集rev][简体][720P][MP4]',
    category: 'season',
  },
  {
    raw: '[AngelEcho]【合集】ラブライブ! LoveLive! School Idol Diary 第01-19话',
    category: 'season',
  },
  {
    raw: '【Dymy字幕組】【Tesagure! Bukatsu-mono_摸索吧!社團活動Encore】【第01-12話】【BIG5】【1280X720】【MP4】【成員招募中】',
    category: 'season',
  },
  {
    raw: '[LoliHouse] 乡下大叔成为剑圣II / Katainaka no Ossan, Kensei ni Naru II [01-12 合集][WebRip 1080p HEVC-10bit AAC][简繁内封字幕][Fin]',
    category: 'season',
  },
  {
    raw: '[整理搬运] 幽游白书 (幽遊白書) (YuYu Hakusho)：TV动画+OVA篇+剧场版+漫画+CD+其他；日语音轨; 外挂简中字幕 (整理时间：2024.02.29)',
    category: 'collection',
  },
  {
    raw: '[DBD-Raws][梦比优斯奥特曼/Ultraman Mebius][01-50TV全集+剧场版+外传+特典][1080P][BDRip][HEVC-10bit][FLAC][MKV](ウルトラマンメビウス)',
    category: 'collection',
  },
  {
    raw: '[整理搬运] 濑户的花嫁 (瀬戸の花嫁) (My Bride is a Mermaid / Seto no Hanayome)：TV动画+OVA篇+漫画+CD+其他；日语音轨; 外挂简中字幕 (整理时间：2023.10.08)',
    category: 'collection',
  },
  {
    raw: '[整理搬运] 福星小子 / 山T女福星 (うる星やつら) (Urusei Yatsura)：TV动画 (1981年版)+OVA篇+剧场版+漫画+音乐+其他；日语音轨; 外挂简中字幕 (整理时间：2023.11.06)',
    category: 'collection',
  },
  {
    raw: '[整理搬运] 幸运星 (らき☆すた) (Lucky Star)：TV动画+OVA篇+漫画+音乐+其他；日英音轨; 外挂简中字幕 (整理时间：2023.12.03)',
    category: 'collection',
  },
  {
    raw: '[整理搬运] 青出于蓝 / 青蓝姻缘 / 未婚关系 (藍より青し) (Ai Yori Aoshi)：TV动画 (第1~2季)+OVA篇+漫画+CD+其他；日语音轨; 外挂繁中字幕 (整理时间：2024.06.30)',
    category: 'collection',
  },
  {
    raw: '[DBD-Raws][MyGO!!!!!×Ave Mujica 合同ライブ「わかれ道の、その先へ」][DAY1+2+特典][1080P][BDRip][HEVC-10bit][FLAC][MKV]',
    category: 'collection',
  },
  {
    raw: '【兔子字幕社】12岁。合集 12-Sai. Collection【OAD+TV+真人版】【1280X720】【简体】【GB_MP4】',
    category: 'collection',
  },
  {
    raw: '[整理搬运] 家庭教师 Hitman Reborn ! / 家庭教师 Reborn ! 杀手利邦 (家庭教師ヒットマン Reborn !) (Katekyo Hitman Reborn ! / Reborn !)：TV动画+漫画+音乐+其他；日语音轨; 外挂简中字幕 (整理时间：2024.01.22)',
    category: 'collection',
  },
  {
    raw: '美少女战士合集9.Sailor Moon Collection Part 9 录像视频合集 (附Part 7合集)',
    category: 'collection',
  },
  {
    raw: '[整理搬运] 轻音少女 (けいおん !) (K-ON !)：TV动画 (第1~2季)+剧场版+演唱会+漫画+CD+其他；日语音轨; 外挂简中字幕 (整理时间：2023.05.09)',
    category: 'collection',
  },
  {
    raw: '[阿特拉斯字幕组·迦勒底技术班][命运-奇异赝品][Fate strange Fake][合集][SP&S01(01-13)][日英配音][简繁日&简繁英内封PGS][WEB][1080p AV1 AAC×2]',
    category: 'collection',
  },
  {
    raw: '[整理搬运] 不可思议的游戏 / 不思议游戏 / 梦幻游戏 / 幻梦游戏 (ふしぎ遊戯) (Fushigi Yugi / The Mysterious Play / Curious Play)：TV动画+OVA篇+漫画+小说+音乐+其他；日语音轨; 外挂繁中字幕 (整理时间：2025.11.12)',
    category: 'collection',
  },
  {
    raw: '[VCB-Studio] 监狱学园 / Prison School 10-bit 1080p AVC BDRip [TV + OAD Reseed Fin]',
    category: 'collection',
  },
  {
    raw: '[DBD-Raws][希德尼娅的骑士/Sidonia no Kishi][TV全集+剧场版+特典映像][1080P][BDRip][HEVC-10bit][简繁外挂][FLAC][MKV](シドニアの騎士)',
    category: 'collection',
  },
  {
    raw: '[DBD-Raws][牙狼：红莲之月/GARO Guren no Tsuki][01-24TV全集+OVA+特典映像][1080P][BDRip][HEVC-10bit][简繁外挂][FLAC][MKV](牙狼 -紅蓮ノ月-)',
    category: 'collection',
  },
  {
    raw: '[整理搬运] 蓝兰岛漂流记 (ながされて藍蘭島) (Nagasarete Airantou)：TV动画+漫画+CD+其他；日语音轨; 外挂简中字幕 (整理时间：2026.09.26)',
    category: 'collection',
  },
  {
    raw: '[阿特拉斯字幕组·雪原市出差所][命运—奇异赝品][Fate/strange Fake][合集(SP&S01)][BDRip][AV1 1080p FLAC][V3][简繁日内封PGS]',
    category: 'collection',
  },
  {
    raw: '[整理搬运] 珈百璃的堕落 / 废天使加百列 (ガヴリールドロップアウト) (Gabriel Dropout / Gavuriru Doroppuauto)：TV动画+OVA篇+漫画+CD+其他；日语音轨; 外挂简中字幕 (整理时间：2024.10.13)',
    category: 'collection',
  },
  {
    raw: '[DBD-Raws][约会大作战 第二季/Date a Live II/デート・ア・ライブ II][01-10TV全集+OAD+特典映像][1080P][BDRip][HEVC-10bit][简繁外挂][FLAC][MKV]',
    category: 'collection',
  },
  {
    raw: "[DBD-Raws][约会大作战 第一季/Date a Live S1/デート・ア・ライブ][导演剪辑版/Director's Cut/ディレクターズカット版][01-12TV全集+OAD][1080P][BDRip][HEVC-10bit][简繁外挂][FLAC][MKV]",
    category: 'collection',
  },
  {
    raw: '[肥猫压制][FatCatRAW][飞女刑警3少女忍法帖传奇][TV+SP][1080P][HDTVRIP]',
    category: 'collection',
  },
  {
    raw: '[整理搬运] 零之使魔 (ゼロの使い魔) (Zero no Tsukaima / The Familiar of Zero)：TV动画 (第1~4季)+OVA篇+小说+漫画+CD+其他；日语音轨; 外挂简中字幕 (整理时间：2026.07.18)',
    category: 'collection',
  },
  {
    raw: '[DBD-Raws][丧女/Watamote][01-12TV全集+OAD][1080P][BDRip][HEVC-10bit][简繁外挂][FLAC][MKV](Watashi ga Motenai no wa Dou Kangaete mo Omaera ga Warui!/私がモテないのはどう考えてもお前らが悪い!)',
    category: 'collection',
  },
  {
    raw: '[DBD-Raws][暗杀教室 第一季/Ansatsu Kyoushitsu S1][00-22TV全集+OAD+特典][1080P][BDRip][HEVC-10bit][简繁日外挂][FLAC][MKV](暗殺教室S1)',
    category: 'collection',
  },
  {
    raw: '[整理搬运] 少女与战车 (ガールズ＆パンツァー) (Girls und Panzer)：TV动画+OVA篇+剧场版+漫画+CD+其他；日语音轨; 外挂简中, 英文字幕 (整理时间：2025.04.02)',
    category: 'collection',
  },
  {
    raw: '[整理搬运] 侵略 ! 乌贼娘 / 侵略 ! 花枝娘 (侵略 ! イカ娘) (Shinryaku ! Ika Musume / Squid Girl)：TV动画 (第1~2季)+OAD篇+音乐+漫画+其他；日语音轨; 外挂简中字幕 (整理时间：2020.06.20)',
    category: 'collection',
  },
  {
    raw: '[整理搬运] 我的妹妹哪有这么可爱 / 我的妹妹不可能那么可爱 (俺の妹がこんなに可愛いわけがない) (Oreimo / Ore no Imoto ga Konna ni Kawaii Wake ga Nai)：TV动画 (第1~2季)+小说+漫画+CD+其他；日语音轨; 外挂简中字幕 (整理时间：2021.06.16)',
    category: 'collection',
  },
  {
    raw: '[DBD-Raws][奥美迦奥特曼/Ultraman Omega][01-25TV全集+SP+特典映像][1080P][BDRip][HEVC-10bit][FLAC][MKV](ウルトラマンオメガ)',
    category: 'collection',
  },
  {
    raw: '【极影字幕社】★[排球少年 Haikyuu!! S1-S3 OAD][DVDrip][480P][HEVC]',
    category: 'collection',
  },
  {
    raw: '[1080P][DBD-Raws][阿拉蕾 (1997)/Dr. Slump][01-74TV全集+SP][Remux][简繁外挂][AC3][MKV](ドクタースランプ)',
    category: 'collection',
  },
  {
    raw: '[DBD-Raws][香格里拉・开拓异境～粪作猎手挑战神作～ 第二季/Shangri-La Frontier: Kusogee Hunter, Kamige ni Idoman to Su S2][01-25TV全集+SP][1080P][BDRip][HEVC-10bit][简繁外挂][FLAC][MKV](シャングリラ・フロンティア ~クソゲーハンター, 神ゲーに挑まんとす~ S2)',
    category: 'collection',
  },
  {
    raw: '[DBD-Raws][干物妹！小埋/Himouto! Umaru-chan][第一季+第二季(R)+OAD][1080P][BDRip][HEVC-10bit][简繁外挂][FLAC][MKV](干物妹! うまるちゃん)',
    category: 'collection',
  },
  {
    raw: '[VCB-Studio] 关于我转生变成史莱姆这档事 / Tensei Shitara Slime Datta Ken / 転生したらスライムだった件 10-bit 1080p HEVC BDRip [S1 Reseed + OAD Reseed + S2 Reseed + MOVIE + WEB + S3]',
    category: 'collection',
  },
  {
    raw: '[VCB-Studio] 邻座的怪同学 / Tonari no Kaibutsu-kun / となりの怪物くん 10-bit 1080p HEVC BDRip [S1 + OAD Fin]',
    category: 'collection',
  },
  {
    raw: '[整理搬运] 头文字D (頭文字D) (Initial D)：TV动画 (第1~2季、第4~6季)+OVA篇+剧场版+漫画+CD+其他；日语音轨; 外挂简中字幕 (整理时间：2026.09.09)',
    category: 'collection',
  },
  {
    raw: "[AHU-SUB][生而为狗，我很幸福/无意间变成狗，被喜欢的女生捡回家。_My Life as Inukai-san's Dog][01-12+OVA1-2][BDRIP 1920x1080 HEVC-YUV420P10 FLAC][MKV 简繁外挂]",
    category: 'collection',
  },
  {
    raw: '[整理搬运] 新世纪福音战士 (新世紀エヴァンゲリオン) (Neon Genesis Evangelion)：TV动画+老剧场版+新剧场版+ONA篇+漫画+CD+其他；日语音轨; 外挂简中, 英文字幕 (整理时间：2025.10.05)',
    category: 'collection',
  },
  {
    raw: '[VCB-Studio] 我的脑内恋碍选项 / Noucome / 俺の脳内選択肢が, 学園ラブコメを全力で邪魔している 10-bit 1080p AVC BDRip [TV + OAD Reseed v2 Fin]',
    category: 'collection',
  },
  {
    raw: '[VCB-Studio] 元气少女缘结神 / Kamisama Hajimemashita / 神様はじめました 10-bit 1080p/720p HEVC BDRip/DVDRip [S1-S2 + OAD Fin]',
    category: 'collection',
  },
  {
    raw: "[整理搬运] 逮捕令 / 辣妹逮捕令 / 皇家双妹唛 (逮捕しちゃうぞ) (You're Under Arrest / Taiho Shichauzo)：TV动画 (第1~3季)+特别篇+OVA篇+剧场版+漫画+CD+其他；日语音轨; 外挂繁中字幕 (整理时间：2026.07.15)",
    category: 'collection',
  },
  {
    raw: '[DVD RIP] [ANIME] Kamen no Maid Guy(All episodes+OST+EXTRA)(JpnRAW) 仮面のメイドガイ全話+OST+DVD特典など',
    category: 'collection',
  },
  {
    raw: '[喵萌奶茶屋&VCB-Studio] 与爱丽丝梦游仙境 / 穿越吧！不思议少女 10-bit 1080p HEVC BDRip [MOVIE Reseed Fin]',
    category: 'movie',
  },
  {
    raw: '【风之圣殿字幕组】★剧场版[偶像活动×美妙天堂 剧场版 -相遇的奇迹-][BDRip][简繁内嵌][1080P][MP4](付特典)',
    category: 'movie',
  },
  {
    raw: '[7³ACG] 关于我转生变成史莱姆这档事 剧场版 苍海之泪篇/Tensei Shitara Slime Datta Ken: Soukai no Namida-hen 2026 [简繁字幕] BDrip 1080p x265 OPUS 2.0',
    category: 'movie',
  },
  {
    raw: '[转载][DPGRAW][假面骑士Kabuto 剧场版 神速爱 导演剪辑版][BDrip][1080P][×265_FLAC×2][MKV]',
    category: 'movie',
  },
  {
    raw: '[S1的大朋友们 x 雪飘工作室][偶像活动x美妙天堂 电影 -相遇的奇迹！/アイカツ！×プリパラ THE MOVIE -出会いのキセキ！/Aikatsu x Pripara][BDrip][特典 LIVE纯享][简繁外挂]',
    category: 'movie',
  },
  {
    raw: '【喵萌奶茶屋】★剧场版★[超时空辉夜姬！加长版 / Chou Kaguya-hime! Extend ver.][BDRip][1080p][简体]',
    category: 'movie',
  },
  {
    raw: '[GM-Team][国漫][仙逆剧场版 弑仙之战][Renegade Immortal Slaying the Blood Progenitor][Movie][2026][HEVC][GB][4K]',
    category: 'movie',
  },
  {
    raw: '乌龙派出所真人电影版：封锁胜哄桥.Kochikame.The.Movie：Save.The.Kachidiki.Bridge.2011.国日双语.简繁英字幕.BDrip.1080P',
    category: 'movie',
  },
  {
    raw: '[奶²&LoliHouse] 剧场版草莓王子 开始的物语～Strawberry School Festival!!! / Strawberry Prince the Movie [WebRip 1080p HEVC-10bit AAC][简日内封字幕]',
    category: 'movie',
  },
  {
    raw: '[漫游字幕组] 福音战士新剧场版合集 EVANGELION 1.11 / 2.22 / 3.333 / 3.0+1.11 UHDrip 2160p 简中内嵌',
    category: 'movie',
  },
  {
    raw: '[LinRip] 剧场版 吹响吧！上低音号 ~最终乐章 前篇~ ／ Gekijouban Hibike! Euphonium - Saishuu Gakushou Zenpen [UHDRip 2160p HEVC-10bit DV TrueHD][简繁日内封 ASSx4]',
    category: 'movie',
  },
  {
    raw: '【2026日影】[MagicStar] 未来 [WEBDL] [1080p] [U-NEXT]【生】【附特典映像】',
    category: 'movie',
  },
  {
    raw: '【喵萌奶茶屋】★剧场版★[绽放于巴黎之星 / 绽放的巴黎之星 / パリに咲くエトワール / Paris ni Saku Etoile][1080p][简日双语]',
    category: 'movie',
  },
  {
    raw: '【喵萌奶茶屋】★剧场版★[祈念守护人 / Kusunoki no Bannin][BDRip][1080p][简体]',
    category: 'movie',
  },
  {
    raw: '[DBD-Raws][名侦探柯南剧场版28 独眼的残像/Detective Conan Movie 28 One-eyed Flashback][正片+SP+特典映像][1080P(附4K下载地址)][BDRip][HEVC-10bit][日文内封][FLACx2][MKV](名探偵コナン 隻眼の残像)',
    category: 'movie',
  },
  {
    raw: '[Skymoon-Raws] 劇場版「暗殺教室」：我們的時光 / ASSASSINATION CLASSROOM THE MOVIE: OUR TIME [Baha][WEB-DL][CHT][1080p][AVC AAC][MP4]',
    category: 'movie',
  },
  {
    raw: '[冷番补完字幕组][赤影疾风][红色旋风][紅いハヤテ][Akai Hayate][1991][OVA][480p][内封简繁中字]',
    category: 'noEpisode',
  },
  {
    raw: '[咪路fans制作组][蜡笔小新SP Crayonshinchan SP] [全员集合的正月哦][1997.01.03][1080P][简日双语][数码修复版][MP4]',
    category: 'noEpisode',
  },
  {
    raw: '[冷番补完字幕组][东海道四谷怪谈 此恨岂能消][東海道 四谷怪談 このうらみはらさでおくべきか][2000][OVA][480p][内封简繁中字]',
    category: 'noEpisode',
  },
  {
    raw: '53yrs ago - [1973-2009] Casshan_再造人卡夏(新造人間キャシャーン)_TV.OVA.実写映画',
    category: 'noEpisode',
  },
  {
    raw: '头文字D.番外篇1.Initial.D.Extra.Stage1.2001.飞跃之蓝.国粤日英双俄乌泰法西十语.多国字幕.BD.1080P.V6修正补漏版(可离线到115或者迅雷网盘下载观看)',
    category: 'noEpisode',
  },
  {
    raw: '[Kekkan] ヒロイン？聖女？いいえ、オールワークスメイドです（誇）！ / Heroine? Seijo? Iie, All Works Maid desu (Hokori)! (WebRip 1080p AV1 简繁官字)',
    category: 'noEpisode',
  },
  {
    raw: '[251122][Vanguard Sound][Grils Frontline Original Soundtrack Vol.3(少女前线 公式设定画集III 豪华版 特典)][16bit／44.1kHz][FLAC+MP4]',
    category: 'noEpisode',
  },
  {
    raw: '【2026春季日剧SP】[MagicStar] 告别医院2 / お別れホスピタル2 Part.1 [WEBDL] [1080p] [NHKP]【生】【附日字】',
    category: 'noEpisode',
  },
  {
    raw: '[MagicStar] 爆上战队奔奔者 番外篇 formation lap 银河清道夫 / 爆上戦隊ブンブンジャーformation lap 始末屋 オブ ギャラクシー [WEBDL] [1080p] [TTFC]【生】',
    category: 'noEpisode',
  },
  {
    raw: '[MagicStar] 假面骑士Gotchard 番外篇 冥黑的默示录 拉克西斯 / 仮面ライダーガッチャード スピンオフ 冥黒の黙示録 ラケシス [WEBDL] [1080p] [TTFC]【生】',
    category: 'noEpisode',
  },
  {
    raw: '【2024秋季日剧】[MagicStar] 无能之鹰 番外篇 / 無能の鷹 スピンオフ [WEBDL] [1080p] [AMZN]【生】',
    category: 'noEpisode',
  },
  {
    raw: '【2025春季日剧】[MagicStar] PJ ~航空救难团~ 番外篇 / PJ ~航空救難団~ スピンオフ [WEBDL] [1080p] [TELASA]【生】【V2修正】',
    category: 'noEpisode',
  },
  {
    raw: '【今晚月色真美】[奈奈与薰的SM日记 / ナナとカオル / Nana to Kaoru][OAD][DVDrip][720P][HEVC-10bit][AAC][简日内嵌][Fin]',
    category: 'noEpisode',
  },
  {
    raw: '[jibaketa合成][代理商粵語]怪獸8號 番外篇 保科放大假 / 保科特休日 / 保科的休息日 / Kaijuu 8-gou Hoshina no Kyuujitsu [粵日雙語+內封繁體中文字幕](WEB 1920x1080 x264 AACx2 SRT Ani-One CHT)',
    category: 'noEpisode',
  },
  {
    raw: '[H-Enc] 尖帽子的魔法工房 / Tongari Boushi no Atelier (BDRip 1080p HEVC FLAC)',
    category: 'noEpisode',
  },
  {
    raw: '【2026春季日剧SP】[MagicStar] 告别医院2 / お別れホスピタル2 Part.2 [WEBDL] [1080p] [NHKP]【生】【附日字】',
    category: 'noEpisode',
  },
];
