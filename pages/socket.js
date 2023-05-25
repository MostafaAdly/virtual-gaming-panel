import io from "socket.io-client";

const socket = io(
    `http://localhost:${process.env.NEXT_PUBLIC_CONSOLE_MANAGER_PORT}`,
    {
        transports: ["websocket"],
    }
);

export default socket;
