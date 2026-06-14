import { io } from "socket.io-client";
const SOCKET_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:4003";
const socket = io(SOCKET_URL);
export default socket;