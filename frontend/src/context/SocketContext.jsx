import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const SocketContext = createContext(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { token, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && token) {
      const newSocket = io(SOCKET_URL, {
        auth: { token },
        transports: ['websocket', 'polling'],
      });

      newSocket.on('connect', () => {
        console.log('Socket connected');
        setConnected(true);
      });

      newSocket.on('connected', (data) => {
        console.log('Socket confirmation:', data);
      });

      newSocket.on('disconnect', () => {
        console.log('Socket disconnected');
        setConnected(false);
      });

      // Handle new donation notifications
      newSocket.on('new_donation', (data) => {
        toast.success('New donation available!');
        setNotifications((prev) => [...prev, { type: 'new_donation', data }]);
      });

      // Handle donation claimed notifications
      newSocket.on('donation_claimed', (data) => {
        toast.info('Your donation has been claimed!');
        setNotifications((prev) => [...prev, { type: 'donation_claimed', data }]);
      });

      // Handle new request notifications
      newSocket.on('new_request', (data) => {
        toast.info('New donation request received!');
        setNotifications((prev) => [...prev, { type: 'new_request', data }]);
      });

      // Handle request accepted notifications
      newSocket.on('request_accepted', (data) => {
        toast.success('Your request has been accepted!');
        setNotifications((prev) => [...prev, { type: 'request_accepted', data }]);
      });

      // Handle user online/offline
      newSocket.on('user_online', (data) => {
        console.log('User online:', data);
      });

      newSocket.on('user_offline', (data) => {
        console.log('User offline:', data);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
        setConnected(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, token]);

  const emitEvent = (event, data) => {
    if (socket && connected) {
      socket.emit(event, data);
    }
  };

  const value = {
    socket,
    connected,
    notifications,
    emitEvent,
    clearNotifications: () => setNotifications([]),
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};
