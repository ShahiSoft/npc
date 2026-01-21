import { runTaxTests } from './tax.test';
import { runHolidaysTests } from './holidays.test';
import { runClientsTests } from './clients.test';
import { runAddressTests } from './address.test';
import { runEventsTests } from './events.test';

async function runAll() {
  runTaxTests();
  runHolidaysTests();
  runAddressTests();
  await runEventsTests();
  await runClientsTests();
  console.log('All shared tests passed');
}

if (require.main === module) {
  runAll().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
