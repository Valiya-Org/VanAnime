import { Injectable } from '@nestjs/common';
import { LogService } from '../log/log.service';
import { Ctx } from 'src/libs/modal/ctx/Ctx';
import { VanAnimeMetaData } from 'src/libs/modal/parser/VanAnimeMetaData';
import aniep from 'aniep';
import { groupDictionary } from '../../modal/parser/Dictionary/GroupDictionary';
import _ from 'lodash';
import { EpisodeInfo } from '../../../libs/modal/parser/EpisodeInfo';

@Injectable()
export class FileNameParserService {
  private readonly ctx: Ctx = {
    serviceContext: 'FileNameParserService',
  };
  constructor(private readonly logService: LogService) {}

  public parseFirstBlockToGroup(fileName: string, result: VanAnimeMetaData) {
    const ctx: Ctx = { ...this.ctx, functionContext: 'ParseFirstBlockToGroup' };
    // 匹配文件名开头 [] 或 【】 中的内容
    const catchFirstBlockWithBrackets = fileName.match(/^(\[|【)(.*?)(\]|】)/);
    if (catchFirstBlockWithBrackets === null) return;
    const contentInBrackets = catchFirstBlockWithBrackets[2];

    // 开始对首个块内容进行匹配
    let matchedCount = 0;
    const possibleGroups = contentInBrackets.split(/&|＆|×|\+/);
    for (let possibleGroup of possibleGroups) {
      possibleGroup = possibleGroup.trim();
      const matchResult = Object.entries(groupDictionary).find(([, value]) => {
        if (new RegExp(value.regex).test(possibleGroup)) return true;
      });

      if (matchResult) {
        result.group.push({
          rawName: possibleGroup,
          parsedName: matchResult[1].content,
        });
        this.logService.log(
          `字幕组信息匹配成功: ${matchResult[1].content}`,
          ctx,
        );
        matchedCount++;
      } else {
        result.group.push({
          rawName: possibleGroup,
          parsedName: possibleGroup,
        });
      }
    }

    result.groupIndex = {
      index: fileName.indexOf(catchFirstBlockWithBrackets[0]),
      length: catchFirstBlockWithBrackets[0].length,
      content: catchFirstBlockWithBrackets[0],
    };

    // 首块中没有被识别到的发布组，或首个 [] 并非发布组
    // 首个 [] 中仅分割出一个词，且这个词中还有空格逗号感叹号问号全角句号，那么首个 [] 极有可能不是发布组名而是作品名 (如 c.c动漫 的名称)
    // 如果满足此条件，进入当前 if，这时我们判断文件名中不存在发布组名，且这个块应该是作品标题，所以清空已有的group信息.
    if (
      matchedCount === 0 &&
      possibleGroups.length === 1 &&
      (possibleGroups[0].match(/ |\?|!|,|？|！|，|。/) ||
        possibleGroups[0].match(/ARTE|RideBack/i))
    ) {
      this.logService.log(
        `名称中首个信息块极大概率不为发布组而是标题，清空组信息`,
        ctx,
      );
      result.group = [];
      result.groupIndex = null;
    }
  }

  public parseTitle(fileName: string, result: VanAnimeMetaData) {
    // 如果标题已经存在，不继续处理
    if (result.name !== null) return;

    /**
     * 1. 使用 findAniEpIndex 方法，截取集数和发布组块中间的内容
     */

    let maybeTitle: string | string[];

    // 1.1. 如果发布组块存在，截取发布组块中间的内容
    if (result.groupIndex && result.episodeIndex) {
      maybeTitle = fileName.slice(
        result.groupIndex.index + result.groupIndex.length,
        result.episodeIndex.index,
      );
    }
    // 1.2. 如果发布组块不存在，截取开头到集数块的内容
    else {
      maybeTitle = fileName.slice(0, fileName.length);
    }

    // 寻找年份
    const year = maybeTitle.match(/\(((18|19|20)\d{2})\)/);
    if (year) {
      result.year = parseInt(year[1]);
      maybeTitle = maybeTitle.replace(year[0], '');
    }

    maybeTitle = maybeTitle.trim();

    // 移除结尾“第”
    if (maybeTitle.endsWith('第'))
      maybeTitle = maybeTitle.slice(0, maybeTitle.length - 1);

    // 移除结尾横杠
    if (maybeTitle.endsWith('-'))
      maybeTitle = maybeTitle.slice(0, maybeTitle.length - 1);

    // 用 [ ] _ 还有空格拆开
    maybeTitle = maybeTitle.split(/\[|\]| |_/);
    // 移除上一个 for 产生的空字符串
    maybeTitle = this.tidyStringArray(maybeTitle);
    maybeTitle = maybeTitle.join(' ');

    result.name = maybeTitle;
    return;

    // /**
    //  * 2. 备用方案：利用 aniep 找到的集数找出可能的标题文本
    //  */

    // // 不含首个发布组块的剩余部分，用于兼容旧版移植过来的代码（即下面的）
    // let pendingPart;
    // if (result.groupIndex) {
    //   pendingPart = fileName.slice(
    //     result.groupIndex.index + result.groupIndex.length,
    //   );
    // } else {
    //   pendingPart = fileName;
    // }

    // // 用 [ ] ( ) 还有空格拆开
    // let nameNoFirstBlock = pendingPart.split(/\[|\]|\(|\)| /);
    // nameNoFirstBlock = _.concat(...nameNoFirstBlock); // 将零散的数组合并
    // nameNoFirstBlock = this.tidyStringArray(nameNoFirstBlock); // trim 和删除空格

    // // 删除无用词汇
    // nameNoFirstBlock.forEach((element) => {
    //   const isGarbage = this.garbageCleaner(element);
    //   if (isGarbage) element = '';
    // });

    // // 移除上一个 for 产生的空字符串
    // nameNoFirstBlock = this.tidyStringArray(nameNoFirstBlock);

    // let title = '';
    // // 将发布组后，集数前的部分进行遍历

    // for (const j in nameNoFirstBlock) {
    //   if (j == nameNoFirstBlock[nameNoFirstBlock.length]) break; // 遍历到达集数位置，停止遍历
    //   if (
    //     nameNoFirstBlock[j].match(
    //       /(BD|Web|DVD)(Rip|-DL){0,1}|AVC|HEVC|((H|X).{0,1}(264|265))|1080P|720P|480P/i,
    //     )
    //   )
    //     break; // fix some bad name
    //   if (nameNoFirstBlock[j].match(/(OVA|SP|OAD|NCOP|NCED|SONG)\d{0,3}/i))
    //     break; // OVA SP 等类型到达结尾
    //   if (nameNoFirstBlock[j].match(/^-|_&/)) continue; // 跳过符号词
    //   title = title + nameNoFirstBlock[j] + ' ';
    // }
    // // 找到标题文本
    // if (title) {
    //   result.name = title.trim();
    // }
  }

  private tidyStringArray(list: string[]) {
    list.forEach((element) => element.trim());
    return _.compact(list);
  }

  private garbageCleaner(word: string) {
    // 垃圾正则
    const garbageDict = [
      /招募(翻译|时轴后期|后期|时轴)/gi,
      /(\d{1,2}|一|四|七|十)月(新|){0,1}番/gi,
      /[A-F\d]{8}/gi, // CRC32 校验码
      /(new-ani.me)/gi,
    ];

    for (const thisDictRegExp of garbageDict) {
      // 遍历此词典的内容
      const thisWordReplaced = word.replace(thisDictRegExp, '').trim();
      if (!thisWordReplaced) return true;
    }
    return false; // 什么也没匹配到，不是垃圾
  }

  public findEpisodeIndex(
    fileName: string,
    aniepEpisode?: string | number | number[],
  ): {
    index: number; // 集数的数字的首个字符的索引
    length: number; // 长度
    content: string; // 集数字符串
  } | null {
    const episode = aniepEpisode ?? aniep(fileName);
    const clearFileName = this.replaceNumberInFileName(fileName);

    // xxx [01] xxx
    if (typeof episode == 'number') {
      const episodeStr = episode.toString();
      let paddingLengths = [3, 2, 1]; // 填充长度的优先级顺序
      // 如果集数含有小数，如 "2.5"，那么此时最短就是三位了，最好从 "002.5" 找起
      if (episodeStr.match(/\./)) {
        paddingLengths = [5, 4, 3];
      }

      // 按照 001, 01, 1 的左 padding 来寻找
      for (const length of paddingLengths) {
        const paddingEpisode = episodeStr.padStart(length, '0');
        const index = clearFileName.indexOf(paddingEpisode);
        if (index !== -1) {
          return {
            index: index,
            length: paddingEpisode.length,
            content: paddingEpisode,
          };
        }
      }
    }
    // Xxxxx Xxx - 01-02 (MX 1280x720) -> [1, 2]
    // 简单范围集数的复合情况
    if (Array.isArray(episode)) {
      // 通过递归自调用的方式分别获取两个集数的位置情况
      const first = this.findEpisodeIndex(fileName, episode[0]);
      const second = this.findEpisodeIndex(fileName, episode[1]);

      if (first && second && first?.index !== -1 && second?.index !== -1) {
        const index = Math.min(first.index, second.index);
        let length;
        if (second.index > first.index) {
          length = second.index - first.index + second.length;
        } else {
          length = first.index - second.index + first.length;
        }
        const episodeString = fileName.slice(index, index + length);

        return {
          index: index,
          length: length,
          content: episodeString,
        };
      }
    }
    // 9.5|21.5, 文件名包含两种集数表达方式
    if (typeof episode == 'string' && episode.includes('|')) {
      // 仅仅是单集的两种表达方式情况：
      // 281|501 [SOSG&52wy][Naruto_Shippuuden][501(281)][BIG5][x264_AAC][1280x720].mp4
      if (!episode.includes(',')) {
        // 分别寻找两种数字的位置
        const [first, second] = episode.split('|');

        // 如果无法解析数字，则返回 null
        if (Number.isNaN(Number(first)) || Number.isNaN(Number(second))) {
          return null;
        }

        const firstIndex = this.findEpisodeIndex(fileName, Number(first));
        const secondIndex = this.findEpisodeIndex(fileName, Number(second));

        // 如果无法找到任一一种表达方式的索引，则返回 null
        if (!firstIndex || !secondIndex) return null;

        // 最小的索引是集数开始的位置
        const index = Math.min(firstIndex.index, secondIndex.index);
        // 长度应该是在前的集数的索引到在后的集数的结束位置
        let length;
        if (secondIndex.index > firstIndex.index) {
          length = secondIndex.index - firstIndex.index + secondIndex.length;
        } else {
          length = firstIndex.index - secondIndex.index + firstIndex.length;
        }

        let episodeString = fileName.slice(index, index + length);

        // 处理一下带括号而后面的括号没被计算进内的问题，如 `501(281)` 处理到这行仅仅只截到了 `501(281`
        if (episodeString.match(/\(|（/)) {
          if (fileName[index + length] === ')') {
            length = length + 1;
            episodeString = fileName.slice(index, index + length);
          } else if (fileName[index + length] === '）') {
            length = length + 1;
            episodeString = fileName.slice(index, index + length);
          } else if (fileName[index + length + 1] === ')') {
            length = length + 2;
            episodeString = fileName.slice(index, index + length);
          } else if (fileName[index + length + 1] === '）') {
            length = length + 2;
            episodeString = fileName.slice(index, index + length);
          }
        }

        return {
          index: index,
          length: length,
          content: episodeString,
        };
      }
      // 复杂情况：集数不仅仅用了两种表达方式，而且还是多集
      // (谁发明的这种写法)
      // 427,647|428,648 [XFSUB][Naruto Shippuuden][647-427_648-428][BIG5][x264 1280x720 AAC].mp4
      else {
        const [firstMethod, secondMethod] = episode.split('|');
        if (firstMethod.includes(',') && secondMethod.includes(',')) {
          const firstArray = firstMethod.split(',').map((obj) => Number(obj));
          const secondArray = secondMethod.split(',').map((obj) => Number(obj));

          // 集数不能无法解析为数字
          if (
            [...firstArray, ...secondArray].find((obj) => Number.isNaN(obj))
          ) {
            return null;
          }

          const first = this.findEpisodeIndex(fileName, firstArray);
          const second = this.findEpisodeIndex(fileName, secondArray);

          if (!first || !second) return null;

          const index = Math.min(first.index, second.index);
          let length;
          if (second.index > first.index) {
            length = second.index - first.index + second.length;
          } else {
            length = first.index - second.index + first.length;
          }

          let episodeString = fileName.slice(index, index + length);

          // 同上，处理一下带括号而后面的括号没被计算进内的问题，如 `501(281)` 处理到这行仅仅只截到了 `501(281`
          if (episodeString.match(/\(|（/)) {
            if (fileName[index + length] === ')') {
              length = length + 1;
              episodeString = fileName.slice(index, index + length);
            } else if (fileName[index + length] === '）') {
              length = length + 1;
              episodeString = fileName.slice(index, index + length);
            } else if (fileName[index + length + 1] === ')') {
              length = length + 2;
              episodeString = fileName.slice(index, index + length);
            } else if (fileName[index + length + 1] === '）') {
              length = length + 2;
              episodeString = fileName.slice(index, index + length);
            }
          }

          return {
            index,
            length,
            content: episodeString,
          };
        }
      }
    }
    return null;
  }

  private replaceNumberInFileName(fileName: string) {
    // 定义替换函数
    function replaceWithPlaceholder(match: string) {
      return '#'.repeat(match.length);
    }

    let clearFileName = fileName;
    clearFileName = clearFileName.replace(/[\r\n]$/, replaceWithPlaceholder);
    clearFileName = clearFileName.replace(
      /((?:\.mp4|\.mkv)+)$/,
      replaceWithPlaceholder,
    ); // remove file extension
    clearFileName = clearFileName.replace(/(v\d)$/i, replaceWithPlaceholder); // remove v2, v3 suffix
    clearFileName = clearFileName.replace(
      /(?<=\d)v[0-5]/i,
      replaceWithPlaceholder,
    ); // remove v2 from 13v2
    clearFileName = clearFileName.replace(
      /(x|h)26(4|5)/i,
      replaceWithPlaceholder,
    ); // remove x264 and x265
    clearFileName = clearFileName.replace(/\bmp4\b/i, replaceWithPlaceholder); // remove x264 and x265
    clearFileName = clearFileName.replace(
      /(8|10)-?bit/i,
      replaceWithPlaceholder,
    ); // remove 10bit and 10-bit
    clearFileName = clearFileName.replace(
      /(\[[0-9a-fA-F]{6,8}])/,
      replaceWithPlaceholder,
    ); // remove checksum like [c3cafe11]
    clearFileName = clearFileName.replace(
      /(\[\d{5,}])/,
      replaceWithPlaceholder,
    );
    clearFileName = clearFileName.replace(
      /\d\d\d\d-\d\d-\d\d/,
      replaceWithPlaceholder,
    ); // remove dates like [20190301]
    clearFileName = clearFileName.replace(
      /\d{3,4}\s*(?:x|×)\s*\d{3,4}p?/i,
      replaceWithPlaceholder,
    ); // remove dates like yyyy-mm-dd
    clearFileName = clearFileName.replace(
      /(?:2160|1080|720|480)(?:p|i)/i,
      replaceWithPlaceholder,
    ); // remove resolutions like 720p or 1080i
    clearFileName = clearFileName.replace(
      /(?:3840|1920|1280)[-_](?:2160|1080|720)/,
      replaceWithPlaceholder,
    ); // remove resolutions like 1280x720
    clearFileName = clearFileName.replace(/2k|4k/i, replaceWithPlaceholder); // remove resolutions 2k or 4k
    clearFileName = clearFileName.replace(
      /((19|20)\d\d)/,
      replaceWithPlaceholder,
    ); // remove years like 1999 or 2019
    clearFileName = clearFileName.replace(/\(BD\)/, replaceWithPlaceholder); // remove resolution like (BD)
    clearFileName = clearFileName.replace(/\(DVD\)/, replaceWithPlaceholder); // remove format like (DVD)

    return clearFileName;
  }

  public parseFilename(filename: string): EpisodeInfo {
    const replacedFileName = this.fileNameCleanerForEpiFinder(filename);
    let num = null;

    // Map Chinese numerals to digits
    const chineseMap: { [key: string]: number } = {
      一: 1,
      二: 2,
      三: 3,
      四: 4,
      五: 5,
      六: 6,
      七: 7,
      八: 8,
      九: 9,
      十: 10,
      十一: 11,
      十二: 12,
      十三: 13,
      十四: 14,
      十五: 15,
    };

    num = filename.match(/第([一二三四五六七八九十]+)(?:集|話|话|回|夜|弾)/); // 第三話
    if (num !== null) {
      return chineseMap[num[1]];
    }

    num = this.matchLevelOneEpisodeFormatCollection(replacedFileName);

    if (num !== null) {
      return num;
    }

    num = this.matchLevelTwoEpisodeFormatCollection(replacedFileName);

    if (num !== null) {
      return num;
    }

    return null;
  }

  private fileNameCleanerForEpiFinder(fileName: string) {
    fileName = fileName.replace(/[\r\n]$/, ''); // remove extra newlines from end of string
    fileName = fileName.replace(/((?:\.mp4|\.mkv)+)$/, ''); // remove file extension
    fileName = fileName.replace(/(v\d)$/i, ''); // remove v2, v3 suffix
    fileName = fileName.replace(/(\d)v[0-5]/i, '$1'); // remove v2 from 13v2
    fileName = fileName.replace(/(x|h)26(4|5)/i, ''); // remove x264 and x265
    fileName = fileName.replace(/\bmp4\b/i, ' '); // remove mp4
    fileName = fileName.replace(/(8|10)-?bit/i, ''); // remove 10bit and 10-bit
    fileName = fileName.replace(/全集|\(全集\)|TV全集|\(TV全集\)/gi, ''); // remove 全集 or (全集) or TV全集
    fileName = fileName.replace(/正片/gi, ''); // remove 正片
    fileName = fileName.replace(/\+\s*特典映像/gi, ''); // remove +特典映像
    fileName = fileName.replace(/精校合集/gi, ''); // remove 精校合集
    fileName = fileName.replace(/修正合集\s*(?:\s*[Vv]\d+)?/gi, ''); // remove 修正合集 or 修正合集 v2
    fileName = fileName.replace(
      /合集(?:\s*[Vv]\d+)?|\(合集(?:\s*[Vv]\d+)?\)/gi,
      '',
    ); // remove 合集 or 合集 v2 or (合集 v2)
    fileName = fileName.replace(/\+\s*OVA(?:\d{1,4}-\d{1,4})?/gi, ''); // remove +OVA
    fileName = fileName.replace(/\+\s*OAD(?:\d{1,4}-\d{1,4})?/gi, ''); // remove +OAD
    fileName = fileName.replace(/\+\s*SP(?:s)?(?:\d{1,4}-\d{1,4})?/gi, ''); // remove +SPs
    fileName = fileName.replace(/\+\s*番外(?:\d{1,4}-\d{1,4})?/gi, ''); // remove +番外
    fileName = fileName.replace(/\+\s*特典/gi, ''); // remove +特典
    fileName = fileName.replace(/\+\s*剧场版/gi, ''); // remove +剧场版
    fileName = fileName.replace(/\+\s*Mini/gi, ''); // remove +Mini
    fileName = fileName.replace(/\+\s*EX/gi, ''); // remove +EX
    fileName = fileName.replace(/\+\s*Movie/gi, ''); // remove +Movie
    fileName = fileName.replace(
      /(\d{1,4}-\d{1,4})\s*(?:_)?[Ff]in(?:\s*[Vv]\d+)?\b/,
      '$1',
    ); // remove 01-13 Fin v2
    fileName = fileName.replace(
      /(\d{1,4}-\d{1,4})\s*(?:_)?END(?:\s*[Vv]\d+)?\b/,
      '$1',
    ); // remove 01-13 END v2
    fileName = fileName.replace(/全\s*(\d{1,4})\s*集/g, '$1');
    fileName = fileName.replace(/(\d{1,4}-\d{1,4})全?完?/, '$1'); // remove 01-13全/完
    fileName = fileName.replace(/(?:TV|EP)(?:\s*)(\d{1,4}-\d{1,4})\b/, '$1'); // remove TV/EP 01-13
    fileName = fileName.replace(/(?:\d{1,4})月/, ''); // remove month like 1月
    fileName = fileName.replace(/(\[[0-9a-fA-F]{6,8}])/, '[]'); // remove checksum like [c3cafe11]
    fileName = fileName.replace(/(\[\d{5,}])/, ''); // remove dates like [20190301]
    fileName = fileName.replace(/\d\d\d\d-\d\d-\d\d/, ' '); // remove dates like yyyy-mm-dd
    fileName = fileName.replace(/\d{3,4}\s*(?:x|×)\s*\d{3,4}p?/i, ' '); // remove resolutions like 1280x720
    fileName = fileName.replace(/(?:2160|1080|720|480)(?:p|i)/i, ' '); // remove resolutions like 720p or 1080i
    fileName = fileName.replace(/(?:3840|1920|1280)[-_](?:2160|1080|720)/, ' '); // remove resolutions like 1280x720
    fileName = fileName.replace(/2k|4k/i, ' '); // remove resolutions 2k or 4k
    fileName = fileName.replace(/((19|20)\d\d)/, ''); // remove years like 1999 or 2019
    fileName = fileName.replace(/\(BD\)/, ''); // remove resolution like (BD)
    fileName = fileName.replace(/\(DVD\)/, ''); // remove format like (DVD)
    fileName = fileName.replace(/【/g, '['); // Unify format 【 to [
    fileName = fileName.replace(/】/g, ']'); // Unify format 】 to ]

    return fileName;
  }

  private matchLevelOneEpisodeFormatCollection(fileName: string) {
    const LevelOneEpisodeFormatCollection = [
      /^(\d{1,4})(?:-|~)(\d{1,4})$/, // 1234-5678
      /\[(\d+(?:\.\d)*)(?:-|&|~)(\d+(?:\.\d)*)(?:[\s\S])*]/, // [1234-5678 xxxXXXxx]
      /第? *(\d+)-(\d+) *(?:集|話|话|回|夜|弾)/, // 第 1-2 集
      /(?:\s|_)(\d+(?:\.\d)*)(?:-|&|~)(\d+(?:\.\d)*)(?:\s|_)/, // _1-2_ /sss 1-2 sss
      /\W(\d{1,4})-(\d{1,4})$/, // xxxx01-13.mp4
      / - (\d+)[-~](\d+)/, // xxxx - 13-26xxxx
    ];
    const LevelOneEpisodeFormatCollectionWithTwoGroup = [
      /\[(\d+)-(\d+)_(\d+)-(\d+)]/, // [1-2_13-14]
      /\[(\d+)-(\d+)\((\d+)-(\d+)\)]/, // [1-2(13-14)]
    ];
    const LevelOneEpisodeFormatCollectionWithExtraEpiInfo = [
      /\[(\d+)_(\d+)]/, // [1_2]
      /\[(\d+)(?: |_|-)(?:S\d)(?: |_|-)(\d+)(?: END)*]/i, // xxxx[13 s2-01]xxxx
      / - (\d{1,4}(?:\.\d)*) *\((?:s\d-)*(\d{1,4}(?:\.\d)*)\)/i, // xxxx - 01.5 (s1-13.5)xxxx
      /\[(\d+)\((?:EP\.)*(\d+)\)]/i, // xxxx[01(ep.13)]xxxx
    ];

    let num = null;

    // 遍历 LevelOneEpisodeFormatCollection 中的正则表达式
    for (const regex of LevelOneEpisodeFormatCollection) {
      num = fileName.match(regex);
      if (num !== null) {
        // 如果匹配成功，返回解析后的集数
        return [parseFloat(num[1]), parseFloat(num[2])];
      }
    }

    // Edge case: 处理一些特殊情况
    for (const regex of LevelOneEpisodeFormatCollectionWithExtraEpiInfo) {
      num = fileName.match(regex);
      if (num !== null) {
        return [parseFloat(num[1]), parseFloat(num[2])]
          .sort((a, b) => a - b)
          .join('|');
      }
    }

    for (const regex of LevelOneEpisodeFormatCollectionWithTwoGroup) {
      num = fileName.match(regex);
      if (num !== null) {
        return [
          [parseFloat(num[1]), parseFloat(num[2])]
            .sort((a, b) => a - b)
            .join(','),
          [parseFloat(num[3]), parseFloat(num[4])]
            .sort((a, b) => a - b)
            .join(','),
        ]
          .sort(
            (a, b) => parseFloat(a.split(',')[1]) - parseFloat(b.split(',')[1]),
          )
          .join('|'); // "1,2|13,14"
      }
    }

    return null; // 如果没有匹配到任何格式，返回 null
  }

  private matchLevelTwoEpisodeFormatCollection(
    fileName: string,
  ): EpisodeInfo | null {
    const LevelTwoEpisodeFormatCollection = [
      /第? *(\d+(?:\.\d)*) *(?:集|話|话|回|夜|弾)/, // 第 13.5 話
      /(?:s|v)\d{1,2}ep*(\d{1,2})/i, // S03EP13
      / - (\d\d(?:\.\d)*) *(?:Fin)* *\[(?:720|1080|4K)]/i, // xxxx - 13 [720]
      /\[(\d{1,4}(?:\.\d)*) *(?:END)*]/, // [13END]
      /\[(\d{1,2})\((?:OVA|OAD)\)]/, // [14(OVA)]
      /【(\d+)】/, // 【13】
      /「(\d+)」/, // 「13」
      /.+\[(\d{1,4}(?:\.\d)*)[^pPx]{0,4}]/i, // xxxx[13.5yyyy]xxxx
      /\[(\d{1,4})[ _-].+?]/, // xxxx[13-xxxx]xxxx
      /[\[][^]+_(\d{1,2})]/, // xxxx[xxxx_13]xxxx
      / (\d\d) \[/, // xxxx 13 [
      /(?: |\[|]|-)(\d\d)(?:\[|])/, // xxxx[ 13[xxxx
      /s\d-(\d{1,2})/i, // xxxxs2-13xxxx
      /\bE(\d{1,4}(?:\.\d\D)*)\b/, // xxxxE13.5xxxx
      /(?:EP|Episode|Round)\.? *(\d{1,4}(?:\.\d\D)*)/i, // xxxxEP 13.5xxxx
      /^(\d{1,4}(?:\.\d)*) - /, // 13.5 - xxxx
      / - (\d{1,4}(?:\.\d)*)/, // xxxx - 13.5xxxx
      /^(\d{1,4}(?:\.\d)*)\D/, // 13.5xxxx
      /(?:#|＃)(\d{1,2})\D/, // xxxx#13xxxx
      / (\d{1,4}(?:\.\d)*)[^xpP\]\d]{0,4} /, // xxxx 13.5yyyy xxxx
      /(\d{1,4})$/, // xxxx13.mp4
      /\D\.(\d{1,3})\.\D/, // xxxx.13.xxxx
      /\D(\d{1,4}) - /, // xxxx13 - xxxx
      /(?: |_)(\d{1,3})_/, // xxxx_13_xxxx
    ];

    let num = null;
    // 遍历 LevelTwoEpisodeFormatCollection 中的正则表达式
    for (const regex of LevelTwoEpisodeFormatCollection) {
      num = fileName.match(regex);
      if (num !== null) {
        return parseFloat(num[1]);
      }
    }

    return null;
  }
}
