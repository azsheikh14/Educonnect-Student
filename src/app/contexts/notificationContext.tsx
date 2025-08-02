'use client';
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import io from 'socket.io-client';
import { useUserContext } from './userContext';
import Notification from '@/app/interfaces/Notification';

interface NotificationData {
  currentPage: string;
  notifications: Notification[];
  totalNotifications: string;
  totalPages: string;
}

interface NotificationContextType {
  notifications: NotificationData;
  addNotification: (notification: NotificationData) => void;
  removeNotification: (index: number) => void;
  setNotifications: (newNotifications: NotificationData) => void;
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
  // Initialize state with default values for a complete NotificationData object
  const [notifications, setNotificationsState] = useState<NotificationData>({
    currentPage: "",
    notifications: [],
    totalNotifications: "0",
    totalPages: "0"
  });

  const { userData } = useUserContext();
  const userId = userData?._id;

  useEffect(() => {
    const storedNotifications = localStorage.getItem('notifications');
    console.log('storedNotifications :', storedNotifications);
    if (storedNotifications && storedNotifications !== 'undefined') {
      const parsed = JSON.parse(storedNotifications);
      setNotificationsState(parsed);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    socket.on('teacherNotification', (notification: NotificationData) => {
      addNotification(notification);
    });

    socket.on(`teacher_${userId}`, (notification: NotificationData) => {
      addNotification(notification);
    });

    return () => {
      socket.off('teacherNotification');
      socket.off(`teacher_${userId}`);
    };
  }, [userId]);

  // Persist the notifications state to local storage when it changes.
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (notification: NotificationData) => {
    setNotificationsState((prevNotifications) => ({
      ...prevNotifications,
      notifications: [
        ...(prevNotifications?.notifications || []),
        ...(notification?.notifications || [])
      ],
      totalNotifications: (
        parseInt(prevNotifications.totalNotifications) + parseInt(notification.totalNotifications)
      ).toString(),
      totalPages: notification.totalPages,
      currentPage: notification.currentPage || prevNotifications.currentPage,
    }));
  };

  const removeNotification = (index: number) => {
    setNotificationsState((prevNotifications) => {
      const updatedNotifications = prevNotifications.notifications.filter((_, i) => i !== index);
      const updatedNotificationData = {
        ...prevNotifications,
        notifications: updatedNotifications,
        totalNotifications: (
          parseInt(prevNotifications.totalNotifications) - 1
        ).toString(),
      };

      // Write the update into local storage
      localStorage.setItem('notifications', JSON.stringify(updatedNotificationData));

      // Emit removal event via socket if applicable
      const removedNotification = prevNotifications.notifications[index];
      if (removedNotification) {
        socket.emit('removeNotification', { _id: removedNotification._id });
      }

      return updatedNotificationData;
    });
  };

  const setNotifications = (newNotifications: NotificationData) => {
    setNotificationsState(newNotifications);
    localStorage.setItem('notifications', JSON.stringify(newNotifications));
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, removeNotification, setNotifications }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
