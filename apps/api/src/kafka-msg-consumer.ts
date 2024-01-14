import { Consumer, Kafka, KafkaConfig, Producer, Admin } from "kafkajs";
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
export class KafkaHandler {
  private kafkaClient: Kafka;
  private producer: Producer;
  private consumer: Consumer;
  private admin: Admin;
  private static instance: KafkaHandler;
  private config = {
    brokers: ["host.docker.internal:29092"]
  };
  private consumerGroup = "userId1";
  private constructor() {
    this.kafkaClient = new Kafka(this.config);
    this.producer = this.kafkaClient.producer();
    this.consumer = this.kafkaClient.consumer({ groupId: this.consumerGroup });
    this.admin = this.kafkaClient.admin();
  }
  public static getInstance() {
    if (!this.instance) {
      this.instance = new KafkaHandler();
    }
    return this.instance;
  }

  public async addTopic() {
    await this.admin.connect();
    await this.admin.createTopics({
      topics: [
        {
          topic: "chat_messages",
          numPartitions: 1,
        },
      ],
    });
    await this.admin.disconnect();
  }

  public async produceMessage(messageToSend: string) {
    await this.producer.connect();
    await this.producer.send({
      topic: "chat_messages",
      messages: [
        {
          key: "chat_msg",
          value: messageToSend,
        },
      ],
    });
    await this.producer.disconnect();
  }

  public async consumeMessage() {
    await this.consumer.connect();
    const data = await this.consumer.subscribe({
      topics: ["chat_messages"],
      fromBeginning: true,
    });
    console.log("consuming data = true or not ", data);
    await this.consumer.run({
      eachMessage: async ({ message }) => {
        const consumedData: consumedMessage = JSON.parse(
          message.value?.toString() || ""
        );
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
        console.log("im at the end");
      },
    });
  }
}
