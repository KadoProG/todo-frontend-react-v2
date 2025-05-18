import { SideBar } from '@/components/AppLayout/SideBar';
import { useAuthContext } from '@/contexts/authContext';

type Props = {
  children: React.ReactNode;
};

export const AppLayout: React.FC<Props> = ({ children }) => {
  const { user } = useAuthContext();
  return (
    <div className="flex h-screen">
      <SideBar />

      <div className="flex-1">
        <div className="sticky flex bg-bg-base-hover dark:bg-bg-base-hover-dark">
          ようこそ、{user?.name}さん
        </div>
        {children}
      </div>
    </div>
  );
};
