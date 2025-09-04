import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {useSelector} from 'react-redux';
import {SOCKET_URL} from '@/utilities/var';

const SocketContext = createContext(null);

export const SocketProvider = ({children}) => {
  const token = useSelector(state => state.auth?.token);
  const {store} = useSelector(state => state.selection);
  const wsRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [latestMessage, setLatestMessage] = useState(null);

  useEffect(() => {
    if (!token || !store?.id) return;

    const url = `${SOCKET_URL}chat/${store.id}/?token=${token}`;
    const socket = new WebSocket(url);

    wsRef.current = socket;

    socket.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    };

    socket.onclose = e => {
      console.log('WebSocket closed', e.reason || e);
      setIsConnected(false);
    };

    socket.onerror = e => {
      console.error('WebSocket error', e.message);
    };

    socket.onmessage = event => {
      console.log('WebSocket message:', event.data);
      try {
        const parsed = JSON.parse(event.data);
        setLatestMessage(parsed);
      } catch (err) {
        console.error('Failed to parse WebSocket message', err);
      }
    };

    return () => {
      if (wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current?.close();
      }
      wsRef.current = null;
      setIsConnected(false);
    };
  }, [token, store?.id]);

  return (
    <SocketContext.Provider
      value={{
        socket: wsRef.current,
        isConnected,
        latestMessage,
      }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);

  if (!context)
    throw new Error('useSocket must be used within a SocketProvider');

  return context;
};
