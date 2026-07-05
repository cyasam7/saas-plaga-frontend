import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Socket, io } from 'socket.io-client';

type SocketValue = Socket | null;

const Context = createContext<SocketValue>(null);

const SERVER_URL = 'http://localhost:81';

export function WebSocketProvider({ children }) {
	const [socket, setSocket] = useState<SocketValue>(null);

	useEffect(() => {
		const newSocket = io(SERVER_URL, { autoConnect: true });
		newSocket.on('connect', () => {
			setSocket(newSocket);
		});
		return () => {
			newSocket.close();
		};
	}, []);

	const value = useMemo(() => {
		return socket;
	}, [socket]);

	return <Context.Provider value={value}>{children}</Context.Provider>;
}

export const useWebSocket = (): SocketValue => {
	const context = useContext(Context);
	return context;
};
