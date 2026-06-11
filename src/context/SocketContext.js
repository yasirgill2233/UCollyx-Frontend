import { io } from "socket.io-client";
const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:4003";
const socket = io(SOCKET_URL);
export default socket;