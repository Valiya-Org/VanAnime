import { cnToNumber } from './cn-numeral';

describe('cnToNumber', () => {
  it.each([
    ['一', 1],
    ['十', 10],
    ['十一', 11],
    ['二十', 20],
    ['二十一', 21],
    ['一百零五', 105],
    ['一千零一', 1001],
    ['两千零二十四', 2024],
    ['一万二千', 12000],
    ['两', 2],
    ['〇', 0],
    ['廿一', 21],
  ])('%s → %i', (input, expected) => {
    expect(cnToNumber(input)).toBe(expected);
  });

  it('含非数字字符或空串返回 null', () => {
    expect(cnToNumber('abc')).toBeNull();
    expect(cnToNumber('')).toBeNull();
  });
});
