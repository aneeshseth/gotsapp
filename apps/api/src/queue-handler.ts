import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.CLIENT_URL!, process.env.CLIENT_SECRET!)

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
      host: process.env.HOST!, 
      port: 24980,
      username: "default",
      password: process.env.PASSWORD!
    }
  })
    this.queue = new Queue('message_queue', {
      connection: {
        host: process.env.HOST!, 
        port: 24980,
        username: "default",
        password: process.env.PASSWORD!
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

