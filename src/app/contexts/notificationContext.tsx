'use client';
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import io from 'socket.io-client';
import { useUserContext } from './userContext';
import Notification from '@/app/interfaces/Notification'

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  removeNotification: (index: number) => void;
  setNotifications: (newNotifications: Notification[]) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

const socketUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const socket = io(socketUrl);

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotificationsState] = useState<Notification[]>([]);

  const { userData } = useUserContext();
  const userId = userData?._id;

  useEffect(() => {
    const storedNotifications = localStorage.getItem('notifications');
    if (storedNotifications) setNotificationsState(JSON.parse(storedNotifications));
  }, []);

  useEffect(() => {
    if (!userId) return;

    socket.on('teacherNotification', (notification: Notification) => {
      addNotification(notification);
    });

    socket.on(`teacher_${userId}`, (notification: Notification) => {
      addNotification(notification);
    });

    return () => {
      socket.off('teacherNotification');
      socket.off(`teacher_${userId}`);
    };
  }, [userId]);

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (notification: Notification) => {
  console.log('notification :', notification);
    setNotificationsState((prevNotifications) => [...prevNotifications, notification]);
  };

  const removeNotification = (index: number) => {
    setNotificationsState((prevNotifications) => {
      const updatedNotifications = prevNotifications.filter((_, i) => i !== index);
      localStorage.setItem('notifications', JSON.stringify(updatedNotifications));

      const removedNotification = prevNotifications[index];
      if (removedNotification) {
        socket.emit('removeNotification', { _id: removedNotification._id });
      }

      return updatedNotifications;
    });
  };

  const setNotifications = (newNotifications: Notification[]) => {
  console.log('newNotifications :', newNotifications);
    setNotificationsState(newNotifications);
    localStorage.setItem('notifications', JSON.stringify(newNotifications));
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification, setNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};
