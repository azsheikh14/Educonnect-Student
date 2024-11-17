'use client';
import './globals.css';
import Sidebar from '../app/components/Sidebar'
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import HomeHeader from '@/app/pages/Home/HomeHeader';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/account/login' || pathname === '/account/signup';

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLgScreen, setIsLgScreen] = useState(false); // Initialize to false

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  useEffect(() => {
    const handleResize = () => {
      const isLargeScreen = window.innerWidth >= 1024; // Use window here
      setIsLgScreen(isLargeScreen);
      setIsSidebarOpen(isLargeScreen); // Adjust sidebar state based on screen size
    };

    handleResize(); // Call once to set initial state
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsLgScreen(window.innerWidth >= 1024); // Set initial state based on window width
    }
  }, []);

  return (
    <html lang="en">
      <body className={`antialiased`}>
        <div className="flex h-screen">
          {!isAuthPage && (
            <>
              <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} isLgScreen={isLgScreen} />
              <div className={`h-full bg-gray-100 transition-all duration-300 w-full ${isSidebarOpen ? 'lg:ml-64' : ''} ${!isLgScreen && isSidebarOpen ? 'overflow-hidden' : ''}`}>
                <div className={`flex flex-col min-h-screen ${!isLgScreen && isSidebarOpen ? 'opacity-50' : ''}`}>
                  <div className="bg-white border-b border-b-gray-300">
                    <HomeHeader isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
                  </div>
                  <div className="flex-1 bg-gray-100">
                    {children}
                  </div>
                </div>
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
