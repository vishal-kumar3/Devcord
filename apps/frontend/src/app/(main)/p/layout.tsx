import type { Metadata } from 'next';
import Sidebar from '../../../components/Sidebar/Sidebar';
import { SocketProvider } from '@/providers/socket.provider';

export const metadata: Metadata = {
  title: '',
  description: '',
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode,
}) {
  return (
    <SocketProvider>
      <div className='relative flex'>
        <Sidebar />
        {children}
      </div>
    </SocketProvider>
  )
}
