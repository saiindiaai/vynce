import { io } from "socket.io-client";

const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

const socket = io("http://localhost:5001", {
  auth: { token }
});

export default socket;