import type { FC } from 'react';

import { cn } from '@/utils';

type AvatarProps = {
  /** アイコン画像の URL。未設定なら名前の頭文字にフォールバックする */
  iconUrl?: string | null;
  /** 代替テキストとフォールバックの頭文字に使うユーザ名 */
  name: string;
  /** 一辺のピクセル数 */
  size?: number;
  /** デザインの追記 */
  className?: string;
};

export const Avatar: FC<AvatarProps> = ({ iconUrl, name, size = 32, className }) => {
  // サロゲートペア（絵文字など）が壊れないよう、コードポイント単位で先頭を取り出す
  const initial = Array.from(name.trim())[0] ?? '?';

  return (
    <span
      data-testid="avatar"
      role={iconUrl ? undefined : 'img'}
      aria-label={iconUrl ? undefined : name}
      className={cn(
        'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-bg-base-hover select-none dark:border-border-dark dark:bg-bg-base-hover-dark',
        className
      )}
      style={{ width: size, height: size, fontSize: size * 0.45 }}
    >
      {iconUrl ? (
        <img src={iconUrl} alt={name} className="h-full w-full object-cover" />
      ) : (
        <span aria-hidden="true">{initial}</span>
      )}
    </span>
  );
};
