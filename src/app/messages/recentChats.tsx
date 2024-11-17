import React, { useEffect, useRef, useState } from 'react';
import { getTeachersBySearch } from '../services/teacherService';
import { useUserContext } from '../contexts/userContext';

type Chat = {
    teacherProfilePic: string;
    teacherId: string;
    teacherName: string;
    lastMessage: string;
    messageTime: string;
};

type RecentChatsProps = {
    chats: Chat[];
    onChatSelect: (chat: Chat) => void | Promise<void>; // Allow async functions
};

const RecentChats: React.FC<RecentChatsProps> = ({ chats, onChatSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredChats, setFilteredChats] = useState<Chat[]>([]);
    const [searchResults, setSearchResults] = useState<Chat[]>([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const searchResultsRef = useRef<HTMLDivElement>(null);
    const { userData } = useUserContext();

    useEffect(() => {
        setFilteredChats(chats);
    }, [chats]);

    const truncateMessage = (message: string | undefined) => {
        if (!message) return '';
        const words = message.split(' ');
        return words.length > 5 ? `${words.slice(0, 5).join(' ')}...` : message;
    };

    const fetchStudentsBySearch = async () => {
        try {
            if (userData) {
                const res = await getTeachersBySearch(searchTerm, userData._id);
                if (res && res.data) {
                    setShowSearchResults(true);
                    setSearchResults(res.data);
                }
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchResultsRef.current && !searchResultsRef.current.contains(event.target as Node)) {
                setShowSearchResults(false);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setShowSearchResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const handleSearch = () => {
        if (searchTerm.trim()) {
            fetchStudentsBySearch();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleSelectUser = (user: Chat) => {
        const existingChat = filteredChats.find(chat => chat.teacherId === user.teacherId);
        if (existingChat) {
            onChatSelect(existingChat);
        } else {
            setFilteredChats(prevChats => [...prevChats, user]);
            onChatSelect(user);
        }
        setSearchResults([]);
        setSearchTerm('');
        setShowSearchResults(false);
    };

    return (
        <div className="flex flex-col">
            <div className="relative border-b pb-4 border-gray-200">
                <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="absolute left-2 cursor-pointer" onClick={handleSearch}>
                        <path d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z" stroke="#767C8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <input
                        className="bg-gray-100 w-full pl-8 h-10 rounded-full border border-gray-300 focus:outline-none"
                        placeholder="Search"
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </div>

                {showSearchResults &&
                    <div ref={searchResultsRef} className="absolute top-12 left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {searchResults.length > 0 ? (
                            <ul>
                                {searchResults.map((result, index) => (
                                    <li key={index} className="cursor-pointer px-4 py-2 hover:bg-gray-100 flex items-center" onClick={() => handleSelectUser(result)}>
                                        <div className="w-8 h-8 mr-3">
                                            {result.teacherProfilePic ? (
                                                <img src={result.teacherProfilePic} alt="" className="w-full h-full object-cover rounded-full" />
                                            ) : (
                                                <img src="/svg/noPic.svg" alt="" />
                                            )}
                                        </div>
                                        <span>{result.teacherName}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <ul>
                                <li className="cursor-pointer px-4 py-2 hover:bg-gray-100 flex items-center">
                                    <div className="w-8 h-8 mr-3">
                                        <img src="/svg/noPic.svg" alt="" />
                                    </div>
                                    <span>No Teacher Found</span>
                                </li>
                            </ul>
                        )}
                    </div>
                }
            </div>

            <div className="flex-grow pt-3">
                <p className="text-base font-medium">All Messages</p>
                <ul>
                    {filteredChats.map((chat, index) => (
                        <li key={index} className="cursor-pointer flex items-center bg-white rounded-lg px-3 py-2" onClick={() => onChatSelect(chat)}>
                            <div className="w-10 h-10 border-2 border-white rounded-full flex items-center justify-center overflow-hidden">
                                {chat.teacherProfilePic ? (
                                    <img src={chat.teacherProfilePic} className="rounded-full w-full h-full object-cover" alt="" />
                                ) : (
                                    <div className="w-full h-full bg-yellow-400 rounded-full"></div>
                                )}
                            </div>
                            <div className="ml-3">
                                <strong>{chat.teacherName}</strong>
                                <p className="text-sm text-gray-500">{truncateMessage(chat.lastMessage)}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default RecentChats;
