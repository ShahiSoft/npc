import { PubSub } from '../events/pubsub';
import { EventType } from '../events';

export async function runEventsTests() {
  console.log('Running events tests (using in-memory fallback)');
  const ps = new PubSub();
  await ps.init();

  let received = false;

  const unsubscribe = ps.subscribe(EventType.USER_CREATED, (payload) => {
    // basic shape check
    if (payload && payload.type === EventType.USER_CREATED && payload.data && payload.data.id) {
      received = true;
    }
  });

  await ps.publish({ type: EventType.USER_CREATED, data: { id: 'u-test', email: 't@example.com', phone: '+6281', addresses: [], taste_profile: {} } as any });

  // wait briefly for in-memory delivery
  await new Promise((res) => setTimeout(res, 50));

  unsubscribe();
  await ps.close();

  if (!received) throw new Error('events test failed: did not receive published USER_CREATED');
  console.log('events tests passed');
}
