import { io } from "socket.io-client";

console.log("🚨 sockets/index.ts script loaded");

const socket = io();
console.log("🚨 socket created:", socket);

export { socket };