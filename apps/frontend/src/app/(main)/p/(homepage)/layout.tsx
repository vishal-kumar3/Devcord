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
      <div className="w-[270px]">
        <HomeSidebar />
      </div>
      {children}
    </div>
  )
}
