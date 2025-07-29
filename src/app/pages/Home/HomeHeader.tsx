import React, { useState, useEffect, useRef } from 'react';
import { FaSearch } from "react-icons/fa";
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import NotificationDropdown from './notificationDropdown';
import Class from '@/app/interfaces/Class';
import Student from '@/app/interfaces/Student';
import { GoBell } from "react-icons/go";
import { IoPowerOutline } from "react-icons/io5";
import { useNotification } from '@/app/contexts/notificationContext';
import { useUserContext } from '@/app/contexts/userContext';
import { getUserNotifications } from '@/app/services/notificationService';

interface HomeHeaderProps {
    isOpen: boolean;
    toggleSidebar: () => void;
}

interface SearchResults {
    students: Student[];
    classes: Class[];
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ isOpen, toggleSidebar }) => {
    const router = useRouter();
    const pathname = usePathname();
    const { notifications, removeNotification, setNotifications } = useNotification();
    console.log('mynotifications :', notifications);
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults] = useState<SearchResults>({ students: [], classes: [] });
    const [showSearchResults] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { userData } = useUserContext();
    const [isSearchDropdownOpen, setSearchDropdownOpen] = useState(false);

    const options = [
        { name: 'Profile', path: '/profile', description: 'View and edit your profile', sections: [{ name: 'Set Availability', anchor: 'set-availability' }, { name: 'Bio', anchor: 'bio' }] },
        { name: 'Add Classes', path: '/classes', description: 'Create and manage your classes', sections: [] },
        { name: 'Timetable', path: '/timetable', description: 'View your class timetable', sections: [] },
    ];

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setShowDropdown(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const toggleDropdown = () => {
        setShowDropdown(prev => !prev);
    };

    const handleBellClick = () => {
        toggleDropdown();
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setShowDropdown(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const storedPaths = JSON.parse(sessionStorage.getItem('previousPaths') || '[]');
        if (storedPaths[0] !== pathname) {
            storedPaths.unshift(pathname);
            if (storedPaths?.length > 4) {
                storedPaths.pop();
            }
            sessionStorage.setItem('previousPaths', JSON.stringify(storedPaths));
        }
    }, [pathname]);

    const handleNavigation = () => {
        const storedPaths = JSON.parse(sessionStorage.getItem('previousPaths') || '[]');
        if (storedPaths?.length > 1) {
            const targetPath = storedPaths[1];
            storedPaths.shift();
            sessionStorage.setItem('previousPaths', JSON.stringify(storedPaths));
            router.push(targetPath);
        }
    };

    const handleLogout = async () => {
        try {
            console.log('Cookies.get(\'teacherToken\') :', Cookies.get('teacherToken'));
            Cookies.remove('teacherToken');
            localStorage.clear();
            sessionStorage.clear();
            await router.push('/account/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const filteredOptions = options.filter(option =>
        option.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        option.sections.some(section => section.name.toLowerCase().includes(searchTerm.toLowerCase()))
    ).map(option => ({
        ...option,
        filteredSections: option.sections.filter(section =>
            section.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }));

    const handleSearchOptionClick = (path: string, anchor?: string) => {
        router.push(path);
        setSearchDropdownOpen(false);
        setSearchTerm('');

        // If an anchor is provided, scroll to that section
        if (anchor) {
            setTimeout(() => {
                const element = document.getElementById(anchor);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 500); // Delay to allow the page to load
        }
    };

    const handleClickOutsideSearch = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setSearchDropdownOpen(false);
        }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            setSearchDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutsideSearch);
        document.addEventListener('keydown', handleEscapeKey);

        return () => {
            document.removeEventListener('mousedown', handleClickOutsideSearch);
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, []);

    useEffect(() => {
        const fetchNotifications = async () => {
            if (userData) {
                localStorage.removeItem('notifications');

                const res = await getUserNotifications(userData._id);
                setNotifications(res);
            }
        };

        fetchNotifications();
    }, [userData]);

    return (
        <div className='flex justify-between items-center p-2 h-14'>
            <div className='w-8 h-8 bg-gray-100 rounded-lg p-2 flex items-center justify-center cursor-pointer'>
                {isOpen ?
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 18 18" fill="none" onClick={handleNavigation}>
                        <path d="M8.99954 14.2483C9.14851 14.2492 9.29436 14.2057 9.4185 14.1233C9.54264 14.041 9.63945 13.9235 9.69657 13.7859C9.7537 13.6483 9.76856 13.4969 9.73925 13.3508C9.70995 13.2047 9.63782 13.0707 9.53204 12.9658L5.55704 8.99831L9.53204 5.03081C9.65491 4.88734 9.71912 4.70278 9.71183 4.51402C9.70454 4.32526 9.62629 4.14621 9.49272 4.01264C9.35915 3.87907 9.18009 3.80082 8.99133 3.79353C8.80258 3.78624 8.61802 3.85044 8.47454 3.97331L3.97454 8.47331C3.83486 8.61383 3.75645 8.80392 3.75645 9.00206C3.75645 9.2002 3.83486 9.39029 3.97454 9.53081L8.47454 14.0308C8.61424 14.1694 8.80279 14.2475 8.99954 14.2483Z" fill="#474C59" />
                        <path d="M13.4995 14.2492C13.6485 14.25 13.7944 14.2065 13.9185 14.1242C14.0426 14.0418 14.1394 13.9244 14.1966 13.7868C14.2537 13.6492 14.2686 13.4977 14.2393 13.3517C14.21 13.2056 14.1378 13.0716 14.032 12.9667L10.057 8.99916L14.032 5.03166C14.1733 4.89043 14.2526 4.69889 14.2526 4.49916C14.2526 4.29944 14.1733 4.10789 14.032 3.96666C13.8908 3.82543 13.6993 3.74609 13.4995 3.74609C13.2998 3.74609 13.1083 3.82543 12.967 3.96666L8.46704 8.46666C8.32736 8.60718 8.24895 8.79727 8.24895 8.99541C8.24895 9.19355 8.32736 9.38364 8.46704 9.52416L12.967 14.0242C13.0365 14.095 13.1193 14.1514 13.2107 14.19C13.3022 14.2287 13.4003 14.2488 13.4995 14.2492Z" fill="#474C59" />
                    </svg>
                    :
                    <img onClick={toggleSidebar} src="/menu.png" alt="" />
                }
            </div>
            <div className='relative flex items-center hidden md:block'>
                <div className="flex">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="searchInput p-2 border border-gray-300 rounded pr-10 focus:outline-none"
                        onFocus={() => setSearchDropdownOpen(true)} // Open dropdown on focus
                    />
                    <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer">
                        <FaSearch />
                    </button>
                </div>
                {isSearchDropdownOpen && searchTerm && filteredOptions?.length > 0 && (
                    <ul className="absolute z-10 bg-white border border-gray-300 mt-1 rounded shadow-lg w-full">
                        {filteredOptions.map(option => (
                            <li key={option.name} className="">
                                <div onClick={() => handleSearchOptionClick(option.path)} className="cursor-pointer hover:bg-gray-100 transition duration-200 p-2">
                                    <div className="font-semibold">{option.name}</div>
                                    <div className="text-gray-500 text-sm">{option.description}</div>
                                </div>
                                {option?.filteredSections?.length > 0 && (
                                    <ul className="mt-1">
                                        {option.filteredSections.map(section => (
                                            <li key={section.anchor} onClick={() => handleSearchOptionClick(option.path, section.anchor)} className="p-2 cursor-pointer hover:bg-gray-100 transition duration-200 text-base font-medium flex pl-6">
                                                <svg className='mr-2' width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M8 7L8 9C8 11.2091 9.79086 13 12 13L17 13" stroke="#200E32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                    <path d="M14 16L17 13L14 10" stroke="#200E32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                </svg>
                                                {section.name}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className='flex items-center mr-5'>
                <div className='flex items-center'>
                    <div className='w-8 h-8 bg-yellow-400 rounded-full mr-2'></div>
                    <p className='font-bold'>{userData?.name}</p>
                </div>
                <div className="ml-4 inline-block cursor-pointer" ref={dropdownRef}>
                    <div className="relative flex items-center" onClick={handleBellClick}>
                        <GoBell className="m-2 cursor-pointer text-xl" />
                        <div className="bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center -ml-4 -mt-4">{notifications?.notifications?.length || 0}</div>
                    </div>
                    {showDropdown && <NotificationDropdown notifications={notifications?.notifications} removeNotification={removeNotification} closeNotifications={toggleDropdown} />}
                </div>
                <IoPowerOutline className='cursor-pointer text-2xl ml-3' onClick={handleLogout} />
            </div>
            {showSearchResults && (
                <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 shadow-lg z-50">
                    {searchResults?.students?.length === 0 && searchResults?.classes?.length === 0 ? (
                        <div className="p-4 text-gray-500">No results found</div>
                    ) : (
                        <>
                            <div className="p-4">
                                <h2 className="text-lg font-semibold">Users</h2>
                                {searchResults.students.map((user) => (
                                    <div key={user._id}>{user.name}</div>
                                ))}
                            </div>
                            <div className="p-4">
                                <h2 className="text-lg font-semibold">Posts</h2>
                                {searchResults.classes.map((post) => (
                                    <div key={`${post.studentId}-${post.classDate}`}>{post.studentId}</div>  // Combining studentId and classDate
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default HomeHeader;
