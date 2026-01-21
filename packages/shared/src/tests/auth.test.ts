import { generateRsaKeyPair, signJwt, verifyJwt } from '../auth';

export async function runAuthTests() {
  console.log('Running auth tests...');
  const { publicKey, privateKey } = await generateRsaKeyPair();

  const claims = { sub: 'user-123', roles: ['user'] };
  const token = await signJwt(claims, privateKey, { expiresIn: '2h' });

  const verified = await verifyJwt(token, publicKey);

  if (verified.sub !== claims.sub) {
    throw new Error('Verified subject does not match');
  }

  if (!Array.isArray(verified.roles) || verified.roles[0] !== 'user') {
    throw new Error('Verified roles mismatch');
  }

  console.log('Auth tests passed');
}

if (require.main === module) {
  runAuthTests().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
