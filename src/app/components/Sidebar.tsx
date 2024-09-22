'use client';
import React from 'react';
import Link from 'next/link';
import { IoHomeOutline, IoPersonOutline, IoMailOutline, IoSettingsOutline, IoLogOutOutline, IoMenuOutline } from 'react-icons/io5';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      Cookies.remove('studentToken');
      router.push('/account/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleLinkClick = () => {
    // Close sidebar only on smaller screens
    if (window.innerWidth < 768 && isOpen) {
      toggleSidebar();
    }
  };

  return (
    <div className={`fixed top-0 left-0 p-4 md:pt-12 h-full bg-blue-600 text-white transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex justify-center p-2 md:hidden w-full mb-8">
        <button onClick={toggleSidebar} className="text-white">
          <IoMenuOutline className="text-3xl font-bold" />
        </button>
      </div>
      <ul className="flex flex-col space-y-16 w-full items-center text-sm">
        <li className="w-full flex flex-col items-center">
          <Link href="/" className="flex flex-col items-center transition w-full" onClick={handleLinkClick}>
            <IoHomeOutline className="text-2xl" />
            <span className="mt-1">Home</span>
          </Link>
        </li>
        <li className="w-full flex flex-col items-center">
          <Link href="/profile" className="flex flex-col items-center transition w-full" onClick={handleLinkClick}>
            <IoPersonOutline className="text-2xl" />
            <span className="mt-1">Profile</span>
          </Link>
        </li>
        <li className="w-full flex flex-col items-center">
          <Link href="/messages" className="flex flex-col items-center transition w-full" onClick={handleLinkClick}>
            <IoMailOutline className="text-2xl" />
            <span className="mt-1">Messages</span>
          </Link>
        </li>
        <li className="w-full flex flex-col items-center">
          <Link href="/settings" className="flex flex-col items-center transition w-full" onClick={handleLinkClick}>
            <IoSettingsOutline className="text-2xl" />
            <span className="mt-1">Settings</span>
          </Link>
        </li>
        <li className="w-full flex flex-col items-center cursor-pointer" onClick={handleLogout}>
          <IoLogOutOutline className="text-2xl" />
          <span className="mt-1">Logout</span>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
