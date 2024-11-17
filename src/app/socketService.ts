import { io, Socket } from 'socket.io-client';

let socket: Socket | undefined;

export const connectSocket = (userType: string, userId: string) => {
  socket = io(process.env.NEXT_PUBLIC_API_URL as string);

  socket.on('connect', () => {
    console.log('Connected to socket server');
    socket?.emit('joinRoom', `${userType}-${userId}`);
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from socket server');
  });
};

export const onReceiveNotification = (userType: string, callback: (data: string) => void) => {
  if (!socket) return;

  const event = 'teacherNotification';
  console.log(`Listening for ${event}`);
  socket.on(event, callback);
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = undefined; // Clear the socket instance after disconnecting
  }
};
