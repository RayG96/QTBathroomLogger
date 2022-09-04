import { createContext } from 'react';

import { io } from "socket.io-client";

export const socket = io();
// @ts-ignore
export const SocketContext = createContext();