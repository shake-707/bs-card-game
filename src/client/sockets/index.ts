import { io } from "socket.io-client";

const socket = io();
console.log("socket created:", socket);

export { socket };