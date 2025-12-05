import dayjs from 'dayjs';

/**
 * ISO形式の日時文字列をdatetime-local形式に変換
 * @param isoString ISO形式の日時文字列（例: "2024-12-31T23:59:59.000Z"）
 * @returns datetime-local形式の文字列（例: "2024-12-31T23:59"）、nullの場合は空文字列
 */
export const formatDateTimeLocal = (isoString: string | null): string => {
  if (!isoString) return '';
  // ISO形式（YYYY-MM-DDTHH:mm:ss.sssZ）をdatetime-local形式（YYYY-MM-DDTHH:mm）に変換
  return dayjs(isoString).format('YYYY-MM-DDTHH:mm');
};
