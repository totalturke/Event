import { useEffect, useRef } from 'react';

export function useWebSocket() {
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = process.env.NODE_ENV === 'production' 
      ? window.location.host
      : 'localhost:3000';

    ws.current = new WebSocket(`${protocol}//${host}/ws`);

    ws.current.onopen = () => {
      console.log('WebSocket Connected');
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  return ws.current;
}
