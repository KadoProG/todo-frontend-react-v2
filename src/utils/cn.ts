import { type ClassValue,clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * クラス名を結合し、Tailwind CSSのクラス競合を解決するユーティリティ関数
 * @param inputs - 結合するクラス名（文字列、配列、オブジェクトなど）
 * @returns 結合されたクラス名の文字列
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
