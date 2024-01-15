"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

const WebSocketContext = createContext(null);

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};

export const WebSocketProvider = ({ children }: any) => {
  const [webSocket, setWebSocket] = useState<any>(null);

  useEffect(() => {
    const socket = new WebSocket("wss://https://aneesh.pro");
    console.log("socket");
    console.log(socket);
    setWebSocket(socket);

    return () => {
      socket.close();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={webSocket}>
      {children}
    </WebSocketContext.Provider>
  );
};
