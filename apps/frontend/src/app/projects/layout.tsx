import type { Metadata } from 'next';
import Sidebar from '../../components/Sidebar/Sidebar';

export const metadata: Metadata = {
  title: '',
  description: '',
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='relative flex'>
      <Sidebar />
      {children}
    </div>
  )
}
