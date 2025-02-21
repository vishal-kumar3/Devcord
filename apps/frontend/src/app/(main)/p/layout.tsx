import type { Metadata } from 'next';
import Sidebar from '../../../components/Sidebar/Sidebar';
import { SocketProvider } from '@/providers/socket.provider';
import ImagekitProvider from '@/providers/imagekit.provider';
import { SessionProvider } from "next-auth/react"


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
    <SessionProvider>
      <ImagekitProvider>
        <SocketProvider>
          <div className='relative flex'>
            <Sidebar />
            {children}
          </div>
        </SocketProvider>
      </ImagekitProvider>
    </SessionProvider>
  )
}
