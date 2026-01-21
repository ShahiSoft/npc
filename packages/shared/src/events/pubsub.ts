import { EventEmitter } from 'events';
import type { EventPayload } from './index';
import { EventType } from './index';

// Use lazy import for ioredis to avoid hard runtime dependency when not needed
type RedisClient = any;

export type EventHandler<T extends EventPayload> = (payload: T) => void | Promise<void>;

export interface PubSubOptions {
  /** Redis connection string; when omitted, an in-memory fallback is used (suitable for local dev/tests) */
  redisUrl?: string;
}

/**
 * A small typed Pub/Sub abstraction. Uses Redis Pub/Sub when `redisUrl` is provided,
 * otherwise falls back to an in-memory EventEmitter for local development and tests.
 */
export class PubSub {
  private redisPub: RedisClient | null = null;
  private redisSub: RedisClient | null = null;
  private emitter = new EventEmitter();
  private usingRedis = false;

  constructor(private opts: PubSubOptions = {}) {}

  async init(): Promise<void> {
    if (this.opts.redisUrl) {
      try {
        // dynamic import to avoid adding runtime penalty where not required
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const IORedis = require('ioredis');
        this.redisPub = new IORedis(this.opts.redisUrl);
        this.redisSub = new IORedis(this.opts.redisUrl);
        this.usingRedis = true;

        this.redisSub.on('message', (_channel: string, message: string) => {
          try {
            const parsed = JSON.parse(message) as EventPayload;
            this.emitter.emit(parsed.type, parsed);
          } catch (err) {
            // ignore parse errors
          }
        });
      } catch (err) {
        // If Redis client cannot be loaded, continue with in-memory fallback
        this.usingRedis = false;
      }
    }
  }

  async publish<T extends EventPayload>(payload: T): Promise<void> {
    const channel = payload.type;
    const message = JSON.stringify(payload);
    if (this.usingRedis && this.redisPub) {
      await this.redisPub.publish(channel, message);
    } else {
      // in-memory emit
      // emit asynchronously to mimic network behaviour
      setImmediate(() => this.emitter.emit(channel, payload));
    }
  }

  subscribe<T extends EventPayload>(eventType: T['type'], handler: EventHandler<T>): () => void {
    const wrapped = (payload: EventPayload) => {
      // TS: narrow and call
      void handler(payload as T);
    };

    this.emitter.on(eventType, wrapped);
    if (this.usingRedis && this.redisSub) {
      this.redisSub.subscribe(eventType).catch(() => {});
    }

    return () => {
      this.emitter.off(eventType, wrapped);
      if (this.usingRedis && this.redisSub) {
        // ignore Promise result
        this.redisSub.unsubscribe(eventType).catch(() => {});
      }
    };
  }

  async close(): Promise<void> {
    if (this.usingRedis) {
      try {
        await Promise.all([
          this.redisPub?.quit?.(),
          this.redisSub?.quit?.(),
        ]);
      } catch {
        // ignore
      }
    }
    this.emitter.removeAllListeners();
  }
}
