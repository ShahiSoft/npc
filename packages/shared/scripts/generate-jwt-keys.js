const { generateKeyPairSync } = require('crypto');
const fs = require('fs');
const path = require('path');

const outDir = path.resolve(__dirname, '..', 'scripts', 'keys');
fs.mkdirSync(outDir, { recursive: true });

const { publicKey, privateKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});

fs.writeFileSync(path.join(outDir, 'jwt_public.pem'), publicKey);
fs.writeFileSync(path.join(outDir, 'jwt_private.pem'), privateKey);

console.log('JWT keypair generated in', outDir);
