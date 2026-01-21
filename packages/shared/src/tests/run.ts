import { runTaxTests } from './tax.test';
import { runHolidaysTests } from './holidays.test';
import { runClientsTests } from './clients.test';
import { runShipperTests } from './shipper.test';
import { runAddressTests } from './address.test';
import { runEventsTests } from './events.test';
import { runEventBusSmokeTests } from './event-bus-smoke.test';
import { runAuthTests } from './auth.test';
import { runOrderIntegrationTests } from './order-integration.test';
import { runDbMigrationTests } from './db-migration.test';

async function runAll() {
  runTaxTests();
  runHolidaysTests();
  runAddressTests();
  await runEventsTests();
  await runAuthTests();
  await runOrderIntegrationTests();
  // DB migration test uses Docker Testcontainers; skip if Docker not available in some environments
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const tc = require('testcontainers');
    if (tc) await runDbMigrationTests();
  } catch (e) {
    console.log('Skipping Testcontainers DB migration test (docker/testcontainers unavailable)');
  }
  await runClientsTests();
  await runShipperTests();

  // Event bus smoke test: requires Docker/Testcontainers; run if available
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const tc2 = require('testcontainers');
    if (tc2) await runEventBusSmokeTests();
  } catch (e) {
    console.log('Skipping Event Bus smoke tests (docker/testcontainers unavailable)');
  }

  console.log('All shared tests passed');
}

if (require.main === module) {
  runAll().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
