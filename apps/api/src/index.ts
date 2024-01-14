import express, { Request, Response } from "express";
import cors from "cors";
import { WebSocket, WebSocketServer } from "ws";
import http from "http";
import { RedisHandler } from "./redis-pub-sub";
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const port = 3004;
import chatRouter from "./routes/chat-routes";

import { createClient } from "@supabase/supabase-js";
import { QueueHandler } from "./queue-handler";

const supabase = createClient(
  "https://xyzcompany.supabase.co",
  "public-anon-key"
);

app.use(express.json());
app.use(cors());
app.use("/", chatRouter);

interface parsedData {
  type: string;
  payload: {
    type: string;
    message?: string;
    roomId: string;
    userId: string;
    senderId: string;
  };
}

wss.on("connection", function connection(ws) {
  ws.on("message", async function message(data) {
    const parsedData: parsedData = JSON.parse(data.toString());
    if (parsedData.type == "join") {
      const roomId = parsedData.payload.roomId;
      const userId = parsedData.payload.userId;
      await RedisHandler.getInstance().addASubscription(roomId);
      await RedisHandler.getInstance().subscribe(userId, roomId, ws);
    }
    if (parsedData.type == "leave") {
      const roomId = parsedData.payload.roomId;
      const userId = parsedData.payload.userId;
      console.log("leaving room 1")
      await RedisHandler.getInstance().removeASubscription(roomId);
      console.log("leaving room 2.")
      await RedisHandler.getInstance().unsubscribe(userId, roomId, ws);
      console.log("left room.")
    }
    if (parsedData.type == "leaveAllRooms") {
      const userId = parsedData.payload.userId;
      if (userId)
       await RedisHandler.getInstance().unsubscribeAllRooms(userId, ws);
    }
    if (parsedData.type == "message") {
      console.log("RECIEVING MESSAGE");
      const roomId = parsedData.payload.roomId;
      const message = parsedData.payload.message;
      const senderId = parsedData.payload.senderId;
      const messageType = parsedData.payload.type;
      const numberOfSubs =
        await RedisHandler.getInstance().getNumberOfSubscriptions(roomId);
      console.log("THIS IS A MESSAGE SENDING SERVICE")
      await RedisHandler.getInstance().sendMessage(
        roomId,
        message || "",
        senderId,
        messageType
      );
      if (Number(numberOfSubs) > 1) {
        await QueueHandler.getInstance().produceMessage(
          JSON.stringify({
            roomId: roomId,
            message: message,
            senderId: senderId,
            messageType: messageType,
            status: "read",
          })
        );
      } else {
        await QueueHandler.getInstance().produceMessage(
          JSON.stringify({
            roomId: roomId,
            message: message,
            senderId: senderId,
            messageType: messageType,
            status: "unread",
          })
        );
      }
    }
  });
  ws.send(
    JSON.stringify({
      type: "message",
      data: "mymessgae",
    })
  );
});




server.listen(3004, () => {
  console.log(`server running`);
});


/*
redis_db:
    image: "redis:alpine"
    ports:
      - 6379:6379
  api:
    restart: always
    ports:
      - 3004:3004
    build:
      context: .
      dockerfile: Dockerfile
    depends_on:
      - kafka1
      - redis_db  

*/
