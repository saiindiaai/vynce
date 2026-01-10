import { io } from "socket.io-client";

const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

const socket = io("http://localhost:5001", {
  auth: { token }
});

// Add connection logging
socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});

socket.on("disconnect", () => {
  console.log("Socket disconnected");
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error);
});

export default socket;