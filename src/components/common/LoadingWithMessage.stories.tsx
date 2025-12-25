import type { Meta, StoryObj } from '@storybook/react-vite';
import { LoadingWithMessage } from './LoadingWithMessage';

const meta = {
  title: 'Common/LoadingWithMessage',
  component: LoadingWithMessage,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    message: {
      control: 'text',
      description: '表示するメッセージ',
    },
  },
} satisfies Meta<typeof LoadingWithMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    message: '読み込み中...',
  },
};

export const CustomMessage: Story = {
  args: {
    message: 'データを取得しています',
  },
};

export const LongMessage: Story = {
  args: {
    message: 'しばらくお待ちください。データの読み込みに時間がかかっています。',
  },
};

export const NoMessage: Story = {
  args: {
    message: undefined,
  },
};
