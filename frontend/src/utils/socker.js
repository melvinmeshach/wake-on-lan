import { io } from "socket.io-client";

export const socket = io(`${import.meta.env.VITE_BACKEND_HOST}/wol-connection`, {
  transports: ["websocket"],
});
