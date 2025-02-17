import { SideBar } from '@/components/AppLayout/SideBar';

type Props = {
  children: React.ReactNode;
};

export const AppLayout: React.FC<Props> = ({ children }) => (
  <div style={{ display: 'flex' }}>
    <SideBar />
    <div>{children}</div>
  </div>
);
