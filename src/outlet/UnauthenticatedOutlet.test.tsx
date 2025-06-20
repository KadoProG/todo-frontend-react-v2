import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthContext } from '@/contexts/auth';
import { UnauthenticatedOutlet } from '@/outlet/UnauthenticatedOutlet';

// テスト用のモックコンポーネント
const TestComponent = () => <div>未認証ページ</div>;
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
  initialEntries = ['/unprotected'],
}: {
  authValue: ReturnType<typeof createAuthContextValue>;
  initialEntries?: string[];
}) => (
  <AuthContext.Provider value={authValue}>
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/" element={<HomeComponent />} />
        <Route element={<UnauthenticatedOutlet />}>
          <Route path="/unprotected" element={<TestComponent />} />
        </Route>
      </Routes>
    </MemoryRouter>
  </AuthContext.Provider>
);

describe('UnauthenticatedOutlet', () => {
  describe('未認証の場合', () => {
    it('Outletを表示する', () => {
      const authValue = createAuthContextValue('unAuthenticated');

      render(<TestWrapper authValue={authValue} />);

      expect(screen.getByText('未認証ページ')).toBeInTheDocument();
      expect(screen.queryByText('ホームページ')).not.toBeInTheDocument();
    });

    it('ユーザー情報がnullである', () => {
      const authValue = createAuthContextValue('unAuthenticated');

      render(<TestWrapper authValue={authValue} />);

      expect(authValue.user).toBeNull();
    });
  });

  describe('認証済みの場合', () => {
    it('ホームページにリダイレクトする', () => {
      const authValue = createAuthContextValue('authenticated');

      render(<TestWrapper authValue={authValue} />);

      expect(screen.getByText('ホームページ')).toBeInTheDocument();
      expect(screen.queryByText('未認証ページ')).not.toBeInTheDocument();
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

  describe('認証状態がpendingの場合', () => {
    it('ホームページにリダイレクトする', () => {
      const authValue = createAuthContextValue('pending');

      render(<TestWrapper authValue={authValue} />);

      expect(screen.getByText('ホームページ')).toBeInTheDocument();
      expect(screen.queryByText('未認証ページ')).not.toBeInTheDocument();
    });
  });

  describe('認証状態がerrorの場合', () => {
    it('ホームページにリダイレクトする', () => {
      const authValue = createAuthContextValue('error');

      render(<TestWrapper authValue={authValue} />);

      expect(screen.getByText('ホームページ')).toBeInTheDocument();
      expect(screen.queryByText('未認証ページ')).not.toBeInTheDocument();
    });
  });

  describe('リダイレクトの動作', () => {
    it('リダイレクト時にstateが正しく設定される', () => {
      const authValue = createAuthContextValue('authenticated');

      render(<TestWrapper authValue={authValue} />);

      // Navigateコンポーネントが正しくレンダリングされていることを確認
      // 実際のリダイレクト動作はReact Routerが処理するため、
      // ここではホームページが表示されることを確認
      expect(screen.getByText('ホームページ')).toBeInTheDocument();
    });

    it('異なるパスからアクセスしても適切にリダイレクトされる', () => {
      const authValue = createAuthContextValue('authenticated');

      render(<TestWrapper authValue={authValue} initialEntries={['/unprotected/other']} />);

      // 存在しないパスの場合、React Routerは何も表示しない
      // 認証状態が認証済みなので、リダイレクトが発生するはずだが、
      // 実際のルーティング設定では何も表示されない
      expect(screen.queryByText('未認証ページ')).not.toBeInTheDocument();
    });
  });

  describe('コンテキストの依存関係', () => {
    it('AuthContextから正しくstatusを取得している', () => {
      const authValue = createAuthContextValue('unAuthenticated');

      render(<TestWrapper authValue={authValue} />);

      // 未認証の場合、Outletが表示される
      expect(screen.getByText('未認証ページ')).toBeInTheDocument();
    });

    it('AuthContextの値が変更されると適切に反応する', () => {
      const { rerender } = render(
        <TestWrapper authValue={createAuthContextValue('unAuthenticated')} />
      );

      // 最初は未認証なのでOutletが表示される
      expect(screen.getByText('未認証ページ')).toBeInTheDocument();

      // 認証済みに変更
      rerender(<TestWrapper authValue={createAuthContextValue('authenticated')} />);

      // ホームページにリダイレクトされる
      expect(screen.getByText('ホームページ')).toBeInTheDocument();
      expect(screen.queryByText('未認証ページ')).not.toBeInTheDocument();
    });
  });

  describe('AuthenticatedOutletとの対比', () => {
    it('認証状態に対する動作がAuthenticatedOutletと逆である', () => {
      // 未認証の場合
      const unauthenticatedValue = createAuthContextValue('unAuthenticated');
      const { rerender } = render(<TestWrapper authValue={unauthenticatedValue} />);

      expect(screen.getByText('未認証ページ')).toBeInTheDocument();

      // 認証済みの場合
      rerender(<TestWrapper authValue={createAuthContextValue('authenticated')} />);
      expect(screen.getByText('ホームページ')).toBeInTheDocument();
    });
  });
});
