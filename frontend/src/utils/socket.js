import { io } from "socket.io-client";

export class SocketConnection{
  constructor() {
    this.socket = io(`${import.meta.env.VITE_BACKEND_HOST}`, {
      transports: ["websocket"],
    });
  }
  subscribeToChannel(socket, channel){
    socket.emit("subscribe", channel);
  }
  unsubscribeFromChannel (socket, channel){
    socket.emit("unsubscribe", channel);
  }
  listenToStatusUpdates(socket, callback){
    socket.on("status", (data) => {
      callback(data);
    });
  }
  stopListeningToStatusUpdates(socket){
    socket.off("status");
  }
}