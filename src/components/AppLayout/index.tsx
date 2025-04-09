import { SideBar } from '@/components/AppLayout/SideBar';
import { useAuthContext } from '@/contexts/authContext';

type Props = {
  children: React.ReactNode;
};

export const AppLayout: React.FC<Props> = ({ children }) => {
  const { user } = useAuthContext();
  return (
    <div style={{ display: 'flex', minHeight: '100svh' }}>
      <SideBar />

      <div style={{ flex: 1 }}>
        <div style={{ position: 'sticky', background: '#eee', display: 'flex' }}>
          ようこそ、{user?.name}さん
        </div>
        {children}
      </div>
    </div>
  );
};
