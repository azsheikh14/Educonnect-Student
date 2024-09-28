'use client'

import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { useUserContext } from '../contexts/userContext';
import { useChatContext } from '../contexts/chatContext';
import RecentChats from './recentChats';
import axios from 'axios';
import PulseLoader from '@/app/loaders/chatLoader';
import { FaExternalLinkAlt, FaPaperPlane, FaArrowLeft } from 'react-icons/fa';
import TeacherSelectModal from '@/app/modal/teacherSelectModal';
import Teacher from '../interface/Teacher';
import Link from 'next/link';

// Socket connection
const socket = io(process.env.NEXT_PUBLIC_API_URL!);

// Message and Chat types
type Message = {
    senderId: string;
    text: string;
    timestamp: Date;
};

type Chat = {
    teacherId: string;
    teacherName: string;
    lastMessage: string;
};

const StudentChatComponent = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState('');
    const { userData } = useUserContext();
    const [recentChats, setRecentChats] = useState<Chat[]>([]);
    const { currentChat, setCurrentChat } = useChatContext();
    const [loadingMessages, setLoadingMessages] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [isScrolling, setIsScrolling] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showRecentChats, setShowRecentChats] = useState(true);

    useEffect(() => {
        const fetchRecentChats = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                const response = await axios.post(`${apiUrl}/chat/getRecentChats`, {
                    userId: userData?._id
                });
                setRecentChats(response.data);
            } catch (error) {
                console.error("Error fetching recent chats:", error);
            }
        };

        fetchRecentChats();
    }, [userData]);

    useEffect(() => {
        const fetchMessages = async () => {
            if (currentChat) {
                setLoadingMessages(true);

                try {
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                    const response = await axios.post(`${apiUrl}/chat/getChatById/`, {
                        teacherId: currentChat.teacherId,
                        userId: userData?._id,
                    });

                    if (response.status === 200) {
                        setMessages(response.data.messages || []);
                        setIsScrolling(true);
                    }
                } catch (error) {
                    console.error("Error fetching chat messages:", error);
                } finally {
                    setLoadingMessages(false);
                }
            }
        };

        fetchMessages();
    }, [currentChat]);

    useEffect(() => {
        socket.on('receiveMessage', (message: Message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.off('receiveMessage');
        };
    }, [currentChat]);

    useEffect(() => {
        if (messagesEndRef.current && isScrolling) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [messages, isScrolling]);

    const handleScroll = () => {
        if (chatContainerRef.current) {
            const { scrollTop, clientHeight, scrollHeight } = chatContainerRef.current;
            const isAtBottom = scrollHeight - scrollTop <= clientHeight + 50;
            setIsScrolling(isAtBottom);
        }
    };

    const sendMessage = () => {
        const studentId = userData?._id;
        const messageData = { senderId: studentId, receiverId: currentChat?.teacherId, text: message, timestamp: new Date() };

        socket.emit('sendMessage', messageData);
        setMessage('');
    };

    const handleChatSelect = async (chat: Chat) => {
        setCurrentChat(chat);
        setMessages([]);
    };

    const handleCreateNewChat = () => {
        setShowModal(true);
    };

    const handleTeacherSelect = async (teacher: Teacher) => {
        setCurrentChat({ teacherId: teacher._id, teacherName: teacher.name, lastMessage: '' });
        setMessages([]); // Clear previous messages
        setLoadingMessages(true);
        setShowModal(false); // Close the modal

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const response = await axios.post(`${apiUrl}/chat/getChatById/`, {
                teacherId: teacher._id,
                userId: userData?._id,
            });

            if (response.status === 200) {
                const messages = response.data.messages || [];
                setMessages(messages);
                setIsScrolling(true);
                setShowRecentChats(false); // Hide recent chats for new chat

                // Create the new chat object
                const newChat: Chat = {
                    teacherId: teacher._id,
                    teacherName: teacher.name,
                    lastMessage: messages.length > 0 ? messages[0].text : '',
                };

                setRecentChats((prevChats) => {
                    const existingChatIndex = prevChats.findIndex(chat => chat.teacherId === newChat.teacherId);

                    if (existingChatIndex > -1) {
                        const updatedChats = [...prevChats];
                        updatedChats[existingChatIndex] = { ...updatedChats[existingChatIndex], lastMessage: newChat.lastMessage };
                        return updatedChats;
                    } else {
                        return [newChat, ...prevChats];
                    }
                });
            } else {
                console.error("Unexpected response status:", response.status);
            }
        } catch (error) {
            console.error("Error fetching chat messages:", error);
        } finally {
            setLoadingMessages(false);
            if (messagesEndRef.current) {
                messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString();
    };

    let lastDisplayedDate: string | null = null;

    const goBackToRecentChats = () => {
        setCurrentChat(null);
        setShowRecentChats(true);
        setMessages([]); // Clear messages when going back
    };

    return (
        <div className="flex h-screen bg-blue-50 overflow-hidden">
            {/* Recent Chats */}
            <div className={`${showRecentChats && currentChat === null ? 'block' : 'hidden'} md:block w-full md:w-auto`}>
                <RecentChats chats={recentChats} onChatSelect={handleChatSelect} onCreateNewChat={handleCreateNewChat} />
            </div>

            {/* Chat Container */}
            <div className="flex-1 flex flex-col" ref={chatContainerRef} onScroll={handleScroll}>
                {/* Chat Header */}
                {currentChat && (
                    <div className="bg-white py-4 shadow justify-between flex items-center mx-auto rounded-full px-6 w-[95%] mt-4">
                        <button onClick={goBackToRecentChats} className="flex items-center text-blue-500">
                            <FaArrowLeft className="mr-2" />
                            Back
                        </button>
                        <div className='flex items-center'>
                            <div className='w-[40px]'>
                                <img src="/bijju.png" className='rounded-full mr-3' alt="Profile" onError={(e) => { e.currentTarget.src = '/path/to/placeholder-image.png'; }} />
                            </div>
                            <h2 className="text-xl font-bold ml-5">{currentChat.teacherName}</h2>
                        </div>
                        <Link href={`/teacher?id=${currentChat.teacherId}`}>
                            <FaExternalLinkAlt className='hidden md:block cursor-pointer' />
                        </Link>
                    </div>
                )}

                {/* Messages */}
                {!currentChat && (
                    <div className="flex-col items-center justify-center h-full md:flex hidden"> {/* Hidden by default, shown on medium screens */}
                        <img
                            src="/chat.png" // Replace with your image path
                            alt="Select a chat"
                            className="w-[50%] mb-4" // Adjust size as needed
                        />
                        <div className="text-center text-gray-500 text-lg font-semibold">
                            Select a chat to start messaging.
                        </div>
                        <div className="text-gray-400 text-sm mt-2">
                            Start by clicking on a Teachers name from the list.
                        </div>
                    </div>
                )}

                <div className={`flex-1 overflow-y-auto p-4 space-y-5 ${currentChat ? 'block' : 'hidden'}`}>
                    {loadingMessages ? (
                        <PulseLoader />
                    ) : messages.length === 0 ? (
                        <div className="text-center text-gray-500">
                            {currentChat ? "No messages found for this chat." : "Select a chat to start messaging."}
                        </div>
                    ) : (
                        messages.map((msg, index) => {
                            const messageDate = formatDate(new Date(msg.timestamp));
                            const isSameSender = index > 0 && messages[index - 1].senderId === msg.senderId;

                            const showDateSeparator = lastDisplayedDate !== messageDate;
                            if (showDateSeparator) {
                                lastDisplayedDate = messageDate;
                            }

                            const formattedTimestamp = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                            return (
                                <React.Fragment key={index}>
                                    {showDateSeparator && (
                                        <div className="text-center text-gray-400 my-2">{messageDate}</div>
                                    )}
                                    <div className={`flex items-end ${msg.senderId === userData?._id ? 'justify-end' : 'justify-start'} my-2`}>
                                        {msg.senderId === userData?._id ? (
                                            <div className="flex items-end">
                                                <div className={`p-3 rounded-tl-xl rounded-tr-xl rounded-bl-xl bg-pink-400 text-white text-right ${!isSameSender ? 'mr-0' : 'mr-11'} min-w-[120px]`}>
                                                    <p className="text-md mb-1 font-semibold">{msg.text}</p>
                                                    <p className="text-xs mt-1">{formattedTimestamp}</p>
                                                </div>
                                                {!isSameSender && (
                                                    <div className="my-1 ml-3">
                                                        <img src="/bijju.png" alt="You" className="w-8 h-8 rounded-full" />
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="flex items-end">
                                                {!isSameSender && (
                                                    <div className="my-1 mr-3">
                                                        <img src="/jin.jpg" alt="Teacher" className="w-8 h-8 rounded-full" />
                                                    </div>
                                                )}
                                                <div className={`p-3 rounded-tl-xl rounded-tr-xl rounded-br-xl bg-blue-400 text-white ${!isSameSender ? 'ml-0' : 'ml-11'} min-w-[120px]`}>
                                                    <p className="text-md mb-1 font-semibold">{msg.text}</p>
                                                    <p className="text-xs mt-1">{formattedTimestamp}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </React.Fragment>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                {currentChat && (
                    <div className="relative mb-[35px] mx-auto w-[80%] md:w-[50%]">

                        <input type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="border rounded-full w-full px-6 py-4 focus:outline-none"
                            placeholder="Type your message"
                        />
                        <div
                            onClick={sendMessage}
                            className="absolute right-[20px] top-1/2 transform -translate-y-1/2 cursor-pointer text-green-500 hover:text-green-600"
                        >
                            <FaPaperPlane size={24} />
                        </div>
                    </div>
                )}
            </div>

            {/* Teacher Select Modal */}
            {showModal && <TeacherSelectModal onSelect={handleTeacherSelect} onClose={() => setShowModal(false)} />}
        </div>
    );
};

export default StudentChatComponent;
