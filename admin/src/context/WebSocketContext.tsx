import { createContext, useState, useEffect, useRef } from "react";

export const WebsocketContext = createContext<[
  boolean,
  any
]>([false, null]);

export const WebsocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const [val, setVal] = useState(null);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    const connectWebSocket = () => {
      const socket = new WebSocket("ws://localhost:8080/socket/players");

      socket.onopen = () => setIsReady(true);
      socket.onclose = () => {
        setIsReady(false);
        // Retry connection after 1 second
        setTimeout(connectWebSocket, 1000);
      };
      socket.onmessage = (event) => {
        console.log("Received message:", event.data); // Log received messages
        setVal(event.data);
      };

      ws.current = socket;
    };

    connectWebSocket();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  return (
    <WebsocketContext.Provider value={[isReady, val]}>
      {children}
    </WebsocketContext.Provider>
  );
};