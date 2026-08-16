import type { Meta, StoryObj } from '@storybook/react-vite';

import { Avatar } from './Avatar';

/** 外部ホストに依存しないよう、サンプル画像はデータ URI で用意する */
const sampleIconUrl = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#2F6843"/><circle cx="32" cy="24" r="12" fill="#96E3AE"/><circle cx="32" cy="60" r="20" fill="#96E3AE"/></svg>'
)}`;

const meta = {
  title: 'Common/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    iconUrl: {
      control: 'text',
      description: 'アイコン画像の URL。未設定なら名前の頭文字にフォールバックする',
    },
    name: {
      control: 'text',
      description: '代替テキストとフォールバックの頭文字に使うユーザ名',
    },
    size: {
      control: 'number',
      description: '一辺のピクセル数',
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithIcon: Story = {
  args: {
    iconUrl: sampleIconUrl,
    name: '山田太郎',
  },
};

export const Fallback: Story = {
  args: {
    iconUrl: null,
    name: '山田太郎',
  },
};

export const FallbackAlphabet: Story = {
  args: {
    iconUrl: null,
    name: 'kadoprog',
  },
};

export const FallbackEmptyName: Story = {
  args: {
    iconUrl: null,
    name: '',
  },
};

export const Large: Story = {
  args: {
    iconUrl: sampleIconUrl,
    name: '山田太郎',
    size: 96,
  },
};

export const LargeFallback: Story = {
  args: {
    iconUrl: null,
    name: '山田太郎',
    size: 96,
  },
};
