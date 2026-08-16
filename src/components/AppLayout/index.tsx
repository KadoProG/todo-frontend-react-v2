import { useContext } from 'react';

import { NotificationBadge } from '@/components/AppLayout/NotificationBadge';
import { SideBar } from '@/components/AppLayout/SideBar';
import { Avatar } from '@/components/common/dataDisplay/Avatar';
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
          <div className="flex items-center gap-2">
            <span>ようこそ、{user?.name}さん</span>
            {user && <Avatar iconUrl={user.icon_url} name={user.name} size={28} />}
          </div>
          <NotificationBadge />
        </div>
        {children}
      </div>
    </div>
  );
};
