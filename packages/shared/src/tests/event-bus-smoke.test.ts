import assert from 'assert';
import { GenericContainer } from 'testcontainers';
import { PubSub } from '../events/pubsub';
import { EventType } from '../events';

function withTimeout<T>(p: Promise<T>, ms = 5000, msg = 'timeout') {
  return Promise.race([p, new Promise<T>((_, rej) => setTimeout(() => rej(new Error(msg)), ms))]);
}

export async function runEventBusSmokeTests() {
  // Start a Redis container
  const container = await new GenericContainer('redis:7-alpine').withExposedPorts(6379).start();
  const host = container.getHost();
  const port = container.getMappedPort(6379);
  const redisUrl = `redis://${host}:${port}`;

  const svcA = new PubSub({ redisUrl });
  const svcB = new PubSub({ redisUrl });
  await svcA.init();
  await svcB.init();

  // subscribe on svcB for USER_CREATED
  const userCreated = new Promise<void>((res) => {
    svcB.subscribe(EventType.USER_CREATED, (p: any) => {
      try {
        assert.ok(p.data && p.type === EventType.USER_CREATED);
        res();
      } catch (e) {
        // ignore
      }
    });
  });

  // subscribe on svcA for ORDER_CREATED
  const orderCreated = new Promise<void>((res) => {
    svcA.subscribe(EventType.ORDER_CREATED, (p: any) => {
      try {
        assert.ok(p.data && p.type === EventType.ORDER_CREATED);
        res();
      } catch (e) {
        // ignore
      }
    });
  });

  // publish from opposite sides
  await svcA.publish({ type: EventType.USER_CREATED, data: { id: 'u1', email: 'a@b.test', phone: '+628000', addresses: [], taste_profile: {} } as any });
  await svcB.publish({ type: EventType.ORDER_CREATED, data: { id: 'o1', user_id: 'u1' } as any });

  // wait for deliveries with timeout
  await withTimeout(userCreated, 5000, 'USER_CREATED not received');
  await withTimeout(orderCreated, 5000, 'ORDER_CREATED not received');

  await svcA.close();
  await svcB.close();
  await container.stop();

  console.log('event bus smoke tests passed');
}

if (require.main === module) runEventBusSmokeTests();
