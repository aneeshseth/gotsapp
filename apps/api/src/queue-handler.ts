import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  "https://ilsphosyotjetmkjcsnf.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsc3Bob3N5b3RqZXRta2pjc25mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ1MTQ5MzUsImV4cCI6MjAyMDA5MDkzNX0.Pv0x6T00bUOqeFeK32_8yvWTQAw0zzSibAi7XO4V6_E"
);

interface consumedMessage {
  roomId: number;
  message: string;
  senderId: string;
  messageType: string;
  status: string;
}

import {Worker, Queue} from 'bullmq'


export class QueueHandler {
  private worker: Worker;
  private queue: Queue;
  private static instance: QueueHandler;
  private constructor() {
    this.worker = new Worker('message_queue', async (job) => {
      const message = job.data;
      console.log(message)
      const consumedData: consumedMessage = JSON.parse(
        message.message
      );
      console.log(consumedData)
      const sender_id = consumedData.senderId;
      const chat_id = consumedData.roomId;
      const type = consumedData.messageType;
      const content = consumedData.message;
      const status = consumedData.status;
      await supabase
        .from("MESSAGES")
        .insert({
          sender_id: sender_id,
          chat_id: chat_id,
          type: type,
          content: content,
        })
        .select();
      const { error } = await supabase
        .from("CHATS")
        .update({
          updated_at: new Date().toISOString().toLocaleString(),
          m_r_m: content,
          latest_message_status: status,
          latest_message_user: sender_id
        })
        .eq("id", chat_id);
      console.log(error);
  }, {
    connection: {
      host: "redis-1e99ff70-aneeshseth2018-fa67.a.aivencloud.com", 
      port: 24980,
      username: "default",
      password: 'AVNS_g3BWXhFIbfNmsNr-o9K'
    }
  })
    this.queue = new Queue('message_queue', {
      connection: {
        host: "redis-1e99ff70-aneeshseth2018-fa67.a.aivencloud.com", 
        port: 24980,
        username: "default",
        password: 'AVNS_g3BWXhFIbfNmsNr-o9K'
      }
    })
  }
  public static getInstance() {
    if (!this.instance) {
      this.instance = new QueueHandler();
    }
    return this.instance;
  }

  public async produceMessage(messageToSend: string) {
    await this.queue.add('sendMessage', { message: messageToSend });
  }
}
