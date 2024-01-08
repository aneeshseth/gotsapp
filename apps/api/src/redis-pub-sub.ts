import { RedisClientType } from "redis";
import { createClient } from "redis";



export class RedisHandler {
  private static instance: RedisHandler;
  private generalClient: RedisClientType;
  private subscriber: RedisClientType;
  private publisher: RedisClientType;
  private subscriptions: Map<string, string[]>;
  private reverseSubscriptions: Map<string, { userId: string; ws: any }[]>;

  private constructor() {
    this.subscriber = createClient();
    this.publisher = createClient();
    this.generalClient = createClient();
    this.publisher.connect();
    this.subscriber.connect();
    this.generalClient.connect();
    this.subscriptions = new Map<string, string[]>();
    this.reverseSubscriptions = new Map<
      string,
      { userId: string; ws: any }[]
    >();
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new RedisHandler();
    }
    return this.instance;
  }

  public async setOnlineStatus(userId: string, ws: any) {
    await this.publisher.set(userId, "online");
  }

  public async getOnlineStatus(userId: string) {
    return await this.publisher.get(userId);
  }

  public async addASubscription(roomId: string) {
    const currentSubscriberNumber = await this.generalClient.get(roomId);
    console.log(currentSubscriberNumber);
    if (
      currentSubscriberNumber != null &&
      Number(currentSubscriberNumber) < 2
    ) {
      await this.generalClient.set(roomId, Number(currentSubscriberNumber) + 1);
    } else if (currentSubscriberNumber == null) {
      await this.generalClient.set(roomId, 1);
    }
    const finaldata = await this.generalClient.get(roomId);
    console.log("finally: ");
    console.log(finaldata);
  }

  public async getNumberOfSubscriptions(roomId: string) {
    console.log("before of s");
    const currentSubscriberNumber = await this.generalClient.get(roomId);
    console.log("current s");
    console.log(currentSubscriberNumber);
    return currentSubscriberNumber;
  }

  public async subscribe(userId: string, roomId: string, ws: any) {
    this.subscriptions.set(userId, [
      ...(this.subscriptions.get(userId) || []),
      roomId,
    ]);
    this.reverseSubscriptions.set(roomId, [
      ...(this.reverseSubscriptions.get(roomId) || []),
      { userId, ws },
    ]);
    await this.subscriber.subscribe(roomId, async (payload: any) => {
      console.log(this.reverseSubscriptions);
      this.reverseSubscriptions
        .get(roomId)
        ?.map((user: { userId: string; ws: any }) => {
          console.log(payload);
          if (JSON.parse(payload).senderId != userId)
            ws.send(JSON.parse(payload).message);
        });
    });
  }

  public sendMessage(roomId: string, message: string, senderId: string) {
    this.publisher.publish(
      roomId,
      JSON.stringify({
        message: message,
        senderId: senderId,
      })
    );
  }
}
