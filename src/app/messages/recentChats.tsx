import React from 'react';
import { FaPlus, FaSearch } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";

type Chat = {
    teacherId: string;
    teacherName: string;
    lastMessage: string;
};

type RecentChatsProps = {
    chats: Chat[];
    onChatSelect: (chat: Chat) => void;
    onCreateNewChat: () => void; // New prop for creating a new chat
};

const RecentChats: React.FC<RecentChatsProps> = ({ chats, onChatSelect, onCreateNewChat }) => {
    return (
        <div className=" p-4 rounded">
            <div className='bg-white w-full p-4 flex items-center rounded-full h-[10%]' onClick={onCreateNewChat}>
                <div className='bg-blue-100 text-blue-600 p-4 rounded-full mr-5'>
                    <FaPlus className='bg-blue-100 text-blue-500 cursor-pointer' />
                </div>
                <p className='text-xl font-bold'>Create New</p>
            </div>
            <div className='p-4 '>
                <div className='flex justify-between items-center'>
                    <h2 className="text-2xl font-bold mb-4">Chat</h2>
                    <BsThreeDots className='text-2xl font-bold text-gray-500 cursor-pointer' />
                </div>
                <div className='flex relative mb-3'>
                    <FaSearch className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500' />
                    <input
                        type="text"
                        placeholder="Search..."
                        className='flex-grow p-2 border border-gray-300 rounded-xl pl-4'
                    />
                </div>
                <ul className='space-y-3'>
                    {chats.map((chat, index) => (
                        <li key={index} className="cursor-pointer flex items-center bg-white rounded-lg px-3 py-4" onClick={() => onChatSelect(chat)}>
                            <div className='w-[40px] h-[40px] border-2 border-white rounded-full flex items-center justify-center overflow-hidden'>
                                <img src="/bijju.png" className='rounded-full w-full h-full object-cover' alt="" />
                            </div>
                            <div className="ml-3">
                                <strong>{chat.teacherName}</strong>
                                <p className="text-sm text-gray-500">{chat.lastMessage}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default RecentChats;
