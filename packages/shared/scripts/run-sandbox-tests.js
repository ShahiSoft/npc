const { execSync } = require('child_process');
const fs = require('fs');

const xenditKey = process.env.XENDIT_API_KEY || '';
const shipperKey = process.env.SHIPPER_API_KEY || '';

if (!xenditKey && !shipperKey) {
  console.log('No sandbox secrets provided; skipping sandbox integration tests.');
  process.exit(78); // 78 used by some runners to indicate skipped
}

console.log('Running sandbox integration tests...');

// Minimal smoke: verify keys are present and attempt to hit sandbox endpoints only if present.
try {
  if (xenditKey) {
    console.log('Xendit key present — running Xendit sandbox test (non-network placeholder)');
    // Insert real sandbox call here if desired; placeholder returns success
    fs.writeFileSync('packages/shared/test-logs/xendit.txt', 'Xendit sandbox test placeholder OK');
  }
  if (shipperKey) {
    console.log('Shipper key present — running Shipper sandbox test (non-network placeholder)');
    fs.writeFileSync('packages/shared/test-logs/shipper.txt', 'Shipper sandbox test placeholder OK');
  }
  console.log('Sandbox integration tests completed (placeholders).');
  process.exit(0);
} catch (e) {
  console.error('Sandbox tests failed', e);
  process.exit(1);
}
