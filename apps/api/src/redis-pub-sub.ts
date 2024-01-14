import { RedisClientType } from "redis";
import { createClient } from "redis";
const Redis = require("ioredis");
const redisUri = "rediss://default:AVNS_g3BWXhFIbfNmsNr-o9K@redis-1e99ff70-aneeshseth2018-fa67.a.aivencloud.com:24981"
const redis = new Redis(redisUri);
redis
export class RedisHandler {
  private static instance: RedisHandler;
  private generalClient: RedisClientType;
  private subscriber: RedisClientType;
  private publisher: RedisClientType;
  private subscriptions: Map<string, string[]>;
  private reverseSubscriptions: Map<string, { userId: string; ws: any }[]>;
  private constructor() {
    this.subscriber = createClient({
      url: "redis://redis_db:6379",
    }
    );
    this.publisher = createClient({
      url: "redis://redis_db:6379",
    }
    );
    this.generalClient = createClient({
      url: "redis://redis_db:6379",
    }
    );
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
    if (currentSubscriberNumber != null) {
      await this.generalClient.set(roomId, Number(currentSubscriberNumber) + 1);
    } else if (currentSubscriberNumber == null) {
      await this.generalClient.set(roomId, 1);
    }
    const finaldata = await this.generalClient.get(roomId);
  }

  public async removeASubscription(roomId: string) {
    const currentSubscriberNumber = await this.generalClient.get(roomId);
    if (currentSubscriberNumber != null) {
      await this.generalClient.set(roomId, Number(currentSubscriberNumber) - 1);
    }
    const finaldata = await this.generalClient.get(roomId);
  }

  public async getNumberOfSubscriptions(roomId: string) {
    const currentSubscriberNumber = await this.generalClient.get(roomId);
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
      console.log("RUNNING SUBSCRIBED SERVICE NOW");
      console.log(this.reverseSubscriptions);
      this.reverseSubscriptions
        .get(roomId)
        ?.map((user: { userId: string; ws: any }) => {
          if (user.userId === userId) {
            ws.send(payload);
          }
        });
    });
    console.log("number of subs ", await this.generalClient.pubSubNumSub("15"))
  }
  public async unsubscribe(userId: string, roomId: string, ws: any) {
    console.log("unsubscribe function activated.")
    this.subscriptions.set(
      userId,
      this.subscriptions.get(userId)?.filter((id) => id != roomId) || []
    );
    this.reverseSubscriptions.set(
      roomId,
      this.reverseSubscriptions
        .get(roomId)
        ?.filter((user) => user.userId != userId) || []
    );
    console.log("unsubscribing from ");
    console.log("CURRENT REVERSE SUBSCRIPTIONS");
    console.log(this.reverseSubscriptions);
   //await this.subscriber.unsubscribe(roomId);
  }

  public async unsubscribeAllRooms(userId: string, ws: any) {
    const currentdata = this.subscriptions.get(userId);
    if (currentdata) {
      this.subscriptions.set(userId, []);
      console.log("number of subscribers to this event at the moment")
      console.log(await this.generalClient.pubSubNumSub("15"))
      const mapThrough = currentdata?.map(async (data) => {
        this.reverseSubscriptions.set(
          data,
          this.reverseSubscriptions
            .get(data)
            ?.filter((user) => user.userId != userId) || []
        );
        console.log("data")
        console.log(data)
        console.log(this.reverseSubscriptions)
        await this.removeASubscription(data);
       // await this.subscriber.unsubscribe(data);
        console.log("number of subscribers to this event at the moment")
        console.log(await this.generalClient.pubSubNumSub(data))
      });
      await Promise.all(mapThrough!);
      console.log(await this.generalClient.pubSubNumSub("15"))
    }
    return;
  }
  public sendMessage(
    roomId: string,
    message: string,
    senderId: string,
    type: string
  ) {
    console.log(this.reverseSubscriptions)
    this.publisher.publish(
      roomId,
      JSON.stringify({
        message: message,
        senderId: senderId,
        type: type,
      })
    );
  }
}
