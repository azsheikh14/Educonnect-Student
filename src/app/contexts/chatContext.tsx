// contexts/ChatContext.tsx
'use client'
import React, { createContext, useState, useContext, ReactNode } from 'react';

type Chat = {
    teacherId: string;
    teacherName: string;
    teacherProfilePic: string;
    lastMessage?: string;
};

type ChatContextType = {
    currentChat: Chat | null;
    setCurrentChat: (chat: Chat | null) => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
    const [currentChat, setCurrentChat] = useState<Chat | null>(null);

    return (
        <ChatContext.Provider value={{ currentChat, setCurrentChat }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChatContext = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChatContext must be used within a ChatProvider');
    }
    return context;
};
