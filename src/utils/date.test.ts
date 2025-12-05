import { describe, it, expect } from 'vitest';
import dayjs from 'dayjs';
import { formatDateTimeLocal } from '.';

describe('formatDateTimeLocal', () => {
  it('nullが渡された場合、空文字列を返すこと', () => {
    expect(formatDateTimeLocal(null)).toBe('');
  });

  it('空文字列が渡された場合、空文字列を返すこと', () => {
    expect(formatDateTimeLocal('')).toBe('');
  });

  it('ISO形式の日時文字列をdatetime-local形式に変換すること', () => {
    const isoString = '2024-12-31T23:59:59.000Z';
    const result = formatDateTimeLocal(isoString);
    // dayjsはローカルタイムゾーンでフォーマットするため、期待値もdayjsで計算
    const expected = dayjs(isoString).format('YYYY-MM-DDTHH:mm');
    expect(result).toBe(expected);
  });

  it('UTCタイムゾーンのISO形式文字列をローカルタイムゾーンに変換すること', () => {
    const isoString = '2024-01-01T00:00:00.000Z';
    const result = formatDateTimeLocal(isoString);
    const expected = dayjs(isoString).format('YYYY-MM-DDTHH:mm');
    expect(result).toBe(expected);
  });

  it('JSTタイムゾーンのISO形式文字列を正しく変換すること', () => {
    const isoString = '2024-12-31T14:30:00.000+09:00';
    const result = formatDateTimeLocal(isoString);
    const expected = dayjs(isoString).format('YYYY-MM-DDTHH:mm');
    expect(result).toBe(expected);
  });

  it('ミリ秒を含むISO形式文字列を正しく変換すること', () => {
    const isoString = '2024-06-15T12:34:56.789Z';
    const result = formatDateTimeLocal(isoString);
    const expected = dayjs(isoString).format('YYYY-MM-DDTHH:mm');
    expect(result).toBe(expected);
  });

  it('秒とミリ秒が含まれないISO形式文字列も正しく変換すること', () => {
    const isoString = '2024-03-20T08:15:00Z';
    const result = formatDateTimeLocal(isoString);
    const expected = dayjs(isoString).format('YYYY-MM-DDTHH:mm');
    expect(result).toBe(expected);
  });

  it('異なる日付と時刻の組み合わせで正しく変換すること', () => {
    const testCases = [
      '2024-12-25T09:00:00.000Z',
      '2024-07-04T18:45:00.000Z',
      '2024-02-29T23:59:00.000Z',
      '2024-01-15T12:30:00.000+09:00',
    ];

    testCases.forEach((input) => {
      const result = formatDateTimeLocal(input);
      const expected = dayjs(input).format('YYYY-MM-DDTHH:mm');
      expect(result).toBe(expected);
    });
  });

  it('フォーマット結果がYYYY-MM-DDTHH:mm形式であること', () => {
    const isoString = '2024-12-31T23:59:59.000Z';
    const result = formatDateTimeLocal(isoString);
    // YYYY-MM-DDTHH:mm形式の正規表現
    const formatRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
    expect(result).toMatch(formatRegex);
  });

  it('同じISO文字列に対して常に同じ結果を返すこと', () => {
    const isoString = '2024-06-15T12:34:56.789Z';
    const result1 = formatDateTimeLocal(isoString);
    const result2 = formatDateTimeLocal(isoString);
    expect(result1).toBe(result2);
  });
});
