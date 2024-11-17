import React from 'react';
import { useNotification } from '@/app/contexts/notificationContext';

const NotificationComponent = () => {
  const { notifications, removeNotification } = useNotification();
  console.log('Current notifications:', notifications);

  return (
    <div className="absolute right-16 top-12 mt-2 w-64 bg-white border border-gray-200 shadow-lg z-50">
      {notifications.length === 0 ? (
        <div className="p-4 text-gray-500">No notifications</div>
      ) : (
        notifications.map((notification, index) => (
          <div key={index} className="p-4 border-b border-gray-200 flex justify-between items-center">
            <span>{notification.sender}: {notification.message}</span>
            <button className="text-red-500 hover:text-red-700" onClick={() => removeNotification(index)}>
              Dismiss
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default NotificationComponent;

