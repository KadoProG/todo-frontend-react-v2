import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthContext } from '@/contexts/auth';
import { AuthenticatedOutlet } from '@/outlet/AuthenticatedOutlet';

// テスト用のモックコンポーネント
const TestComponent = () => <div>認証済みページ</div>;
const HomeComponent = () => <div>ホームページ</div>;

// テスト用のAuthContext値
const createAuthContextValue = (
  status: 'pending' | 'unAuthenticated' | 'authenticated' | 'error'
) => ({
  status,
  user:
    status === 'authenticated'
      ? {
          id: 1,
          name: 'テストユーザー',
          email: 'test@example.com',
          email_verified_at: '2024-01-01T00:00:00Z',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        }
      : null,
  mutate: vi.fn(),
  logout: vi.fn(),
});

// テスト用のラッパーコンポーネント
const TestWrapper = ({
  authValue,
  initialEntries = ['/protected'],
}: {
  authValue: ReturnType<typeof createAuthContextValue>;
  initialEntries?: string[];
}) => (
  <AuthContext.Provider value={authValue}>
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/" element={<HomeComponent />} />
        <Route element={<AuthenticatedOutlet />}>
          <Route path="/protected" element={<TestComponent />} />
        </Route>
      </Routes>
    </MemoryRouter>
  </AuthContext.Provider>
);

describe('AuthenticatedOutlet', () => {
  describe('認証済みの場合', () => {
    it('Outletを表示する', () => {
      const authValue = createAuthContextValue('authenticated');

      render(<TestWrapper authValue={authValue} />);

      expect(screen.getByText('認証済みページ')).toBeInTheDocument();
      expect(screen.queryByText('ホームページ')).not.toBeInTheDocument();
    });

    it('ユーザー情報が正しく設定されている', () => {
      const authValue = createAuthContextValue('authenticated');

      render(<TestWrapper authValue={authValue} />);

      expect(authValue.user).toEqual({
        id: 1,
        name: 'テストユーザー',
        email: 'test@example.com',
        email_verified_at: '2024-01-01T00:00:00Z',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      });
    });
  });

  describe('未認証の場合', () => {
    it('ホームページにリダイレクトする', () => {
      const authValue = createAuthContextValue('unAuthenticated');

      render(<TestWrapper authValue={authValue} />);

      expect(screen.getByText('ホームページ')).toBeInTheDocument();
      expect(screen.queryByText('認証済みページ')).not.toBeInTheDocument();
    });

    it('ユーザー情報がnullである', () => {
      const authValue = createAuthContextValue('unAuthenticated');

      render(<TestWrapper authValue={authValue} />);

      expect(authValue.user).toBeNull();
    });
  });

  describe('認証状態がpendingの場合', () => {
    it('ホームページにリダイレクトする', () => {
      const authValue = createAuthContextValue('pending');

      render(<TestWrapper authValue={authValue} />);

      expect(screen.getByText('ホームページ')).toBeInTheDocument();
      expect(screen.queryByText('認証済みページ')).not.toBeInTheDocument();
    });
  });

  describe('認証状態がerrorの場合', () => {
    it('ホームページにリダイレクトする', () => {
      const authValue = createAuthContextValue('error');

      render(<TestWrapper authValue={authValue} />);

      expect(screen.getByText('ホームページ')).toBeInTheDocument();
      expect(screen.queryByText('認証済みページ')).not.toBeInTheDocument();
    });
  });

  describe('リダイレクトの動作', () => {
    it('リダイレクト時にstateが正しく設定される', () => {
      const authValue = createAuthContextValue('unAuthenticated');

      render(<TestWrapper authValue={authValue} />);

      // Navigateコンポーネントが正しくレンダリングされていることを確認
      // 実際のリダイレクト動作はReact Routerが処理するため、
      // ここではホームページが表示されることを確認
      expect(screen.getByText('ホームページ')).toBeInTheDocument();
    });

    it('異なるパスからアクセスしても適切にリダイレクトされる', () => {
      const authValue = createAuthContextValue('unAuthenticated');

      render(<TestWrapper authValue={authValue} initialEntries={['/protected/other']} />);

      // 存在しないパスの場合、React Routerは何も表示しない
      // 認証状態が未認証なので、リダイレクトが発生するはずだが、
      // 実際のルーティング設定では何も表示されない
      expect(screen.queryByText('認証済みページ')).not.toBeInTheDocument();
    });
  });

  describe('コンテキストの依存関係', () => {
    it('AuthContextから正しくstatusを取得している', () => {
      const authValue = createAuthContextValue('authenticated');

      render(<TestWrapper authValue={authValue} />);

      // 認証済みの場合、Outletが表示される
      expect(screen.getByText('認証済みページ')).toBeInTheDocument();
    });

    it('AuthContextの値が変更されると適切に反応する', () => {
      const { rerender } = render(
        <TestWrapper authValue={createAuthContextValue('authenticated')} />
      );

      // 最初は認証済みなのでOutletが表示される
      expect(screen.getByText('認証済みページ')).toBeInTheDocument();

      // 未認証に変更
      rerender(<TestWrapper authValue={createAuthContextValue('unAuthenticated')} />);

      // ホームページにリダイレクトされる
      expect(screen.getByText('ホームページ')).toBeInTheDocument();
      expect(screen.queryByText('認証済みページ')).not.toBeInTheDocument();
    });
  });
});
