import type { Metadata } from 'next';
import HomeSidebar from '@/components/HomePage/HomeSidebar';

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
    <div className="h-screen flex-1 flex">
      <div className="min-w-sidebar">
        <HomeSidebar />
      </div>
      {children}
    </div>
  )
}
