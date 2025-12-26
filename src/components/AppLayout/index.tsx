import { useContext } from 'react';

import { NotificationBadge } from '@/components/AppLayout/NotificationBadge';
import { SideBar } from '@/components/AppLayout/SideBar';
import { AuthContext } from '@/contexts/auth';

type Props = {
  children: React.ReactNode;
};

export const AppLayout: React.FC<Props> = ({ children }) => {
  const { user } = useContext(AuthContext);
  return (
    <div className="flex h-screen">
      <SideBar />

      <div className="flex-1">
        <div className="sticky flex items-center justify-between bg-bg-base-hover px-4 py-2 dark:bg-bg-base-hover-dark">
          <span>ようこそ、{user?.name}さん</span>
          <NotificationBadge />
        </div>
        {children}
      </div>
    </div>
  );
};
