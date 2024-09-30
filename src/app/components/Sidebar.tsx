'use client';
import React from 'react';
import Link from 'next/link';
import { IoHomeOutline, IoPersonOutline, IoMailOutline, IoSettingsOutline, IoLogOutOutline, IoMenuOutline } from 'react-icons/io5';
import { FaChalkboardUser } from "react-icons/fa6";
import { ImBooks } from "react-icons/im";
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { SiGoogleclassroom } from "react-icons/si";

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
    if (window.innerWidth < 768 && isOpen) {
      toggleSidebar();
    }
  };

  return (
    <div className={`fixed top-0 left-0 px-4 py-10 h-full bg-blue-600 text-white transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex justify-center p-2 md:hidden w-full mb-8">
        <button onClick={toggleSidebar} className="text-white">
          <IoMenuOutline className="text-3xl font-bold" />
        </button>
      </div>
      <ul className="flex flex-col justify-between h-full space-y-8 w-full items-center text-sm">
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
          <Link href="/classes" className="flex flex-col items-center transition w-full" onClick={handleLinkClick}>
            <SiGoogleclassroom className="text-2xl" />
            <span className="mt-1">Classes</span>
          </Link>
        </li>
        <li className="w-full flex flex-col items-center">
          <Link href="/teachers" className="flex flex-col items-center transition w-full" onClick={handleLinkClick}>
            <FaChalkboardUser className="text-2xl" />
            <span className="mt-1">Teachers</span>
          </Link>
        </li>
        <li className="w-full flex flex-col items-center">
          <Link href="/notes" className="flex flex-col items-center transition w-full" onClick={handleLinkClick}>
            <ImBooks className="text-2xl" />
            <span className="mt-1">Notes</span>
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
