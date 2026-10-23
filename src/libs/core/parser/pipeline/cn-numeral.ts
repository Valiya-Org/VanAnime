/** 中文数字（个位）→ 数值 */
const DIGITS: Record<string, number> = {
  零: 0,
  〇: 0,
  一: 1,
  二: 2,
  两: 2,
  兩: 2,
  三: 3,
  四: 4,
  五: 5,
  六: 6,
  七: 7,
  八: 8,
  九: 9,
};

/** 十/百/千：带倍率，向前累积到当前段 */
const UNITS: Record<string, number> = { 十: 10, 百: 100, 千: 1000 };

/** 万/亿：分段进位 */
const BIG_UNITS: Record<string, number> = { 万: 10000, 亿: 100000000 };

/** 廿=20、卅=30 这类合体数字 */
const COMPOUND: Record<string, number> = { 廿: 20, 卅: 30 };

/**
 * 中文数字 → 阿拉伯数字（任意位数的常见写法）。
 *
 * 例：三→3、十一→11、二十→20、二十一→21、一百零五→105、
 * 一千零一→1001、两千零二十四→2024、一万二千→12000。
 * 含无法识别字符时返回 null。
 */
export function cnToNumber(input: string): number | null {
  if (!input) return null;

  let total = 0; // 万/亿 段以上的累计
  let section = 0; // 当前段（万以下）的累计
  let number = 0; // 当前待乘倍率的数字

  for (const ch of input) {
    if (DIGITS[ch] != null) {
      number = DIGITS[ch];
    } else if (UNITS[ch] != null) {
      const unit = UNITS[ch];
      // 「十」开头时省略了「一」：十 → 10
      if (number === 0 && unit === 10) number = 1;
      section += number * unit;
      number = 0;
    } else if (BIG_UNITS[ch] != null) {
      // 例：一万 / 三千二百万 —— 先把当前段整体进位
      section += number;
      total += section * BIG_UNITS[ch];
      section = 0;
      number = 0;
    } else if (COMPOUND[ch] != null) {
      section += COMPOUND[ch];
      number = 0;
    } else {
      return null;
    }
  }

  return total + section + number;
}
