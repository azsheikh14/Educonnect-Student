'use client';
import localFont from 'next/font/local';
import './globals.css';
import Sidebar from './components/Sidebar';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { IoMenuOutline } from 'react-icons/io5';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/account/login' || pathname === '/account/signup';

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { // md breakpoint
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false); // Hide sidebar on small screens
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="flex h-screen">
          {!isAuthPage && (
            <>
              <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
              <div className={`flex-1 overflow-y-auto bg-gray-100 ${isSidebarOpen ? 'md:ml-[93px]' : 'md:ml-0'}`}>
                <div className="flex justify-start p-6 md:hidden w-full">
                  <button onClick={toggleSidebar} className="text-black">
                    <IoMenuOutline className="text-3xl font-bold" />
                  </button>
                </div>
                {children}
              </div>
            </>
          )}
          {isAuthPage && (
            <div className="flex-1 overflow-y-auto bg-gray-100">
              {children}
            </div>
          )}
        </div>
      </body>
    </html>
  );
}
