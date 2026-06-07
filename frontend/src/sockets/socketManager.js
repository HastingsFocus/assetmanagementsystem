import { io } from "socket.io-client";

let socket = null;

export const connectSocket = (token) => {
    if (socket && socket.connected) return socket;

    socket = io("http://localhost:5000", {
        auth: { token },
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 2000
    });

    socket.on("connect", () => {
        console.log("🟢 Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
        console.log("🔴 Socket disconnected");
    });

    socket.on("connect_error", (err) => {
        console.log("⚠️ Socket error:", err.message);
    });

    return socket;
};

export const getSocket = () => {
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

export const isSocketConnected = () => {
    return socket?.connected || false;
};