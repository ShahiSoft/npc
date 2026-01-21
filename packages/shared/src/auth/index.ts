import { exportPKCS8, exportSPKI, generateKeyPair, importPKCS8, importSPKI, SignJWT, jwtVerify } from 'jose';
export * from './middleware';

export type JwtClaims = {
  sub: string; // user id
  roles?: string[];
  [key: string]: unknown;
};

export type JwtOptions = {
  issuer?: string;
  audience?: string;
  expiresIn?: string | number; // e.g. '1h' or seconds
};

export async function generateRsaKeyPair(): Promise<{ publicKey: string; privateKey: string }> {
  const { publicKey, privateKey } = await generateKeyPair('RS256');
  const spki = await exportSPKI(publicKey);
  const pkcs8 = await exportPKCS8(privateKey);
  return { publicKey: spki, privateKey: pkcs8 };
}

export async function signJwt(claims: JwtClaims, privateKeyPem: string, opts?: JwtOptions): Promise<string> {
  const alg = 'RS256';
  const key = await importPKCS8(privateKeyPem, alg);
  const jwt = await new SignJWT(claims)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setIssuer(opts?.issuer ?? 'nusantara')
    .setAudience(opts?.audience ?? 'nusantara')
    .setExpirationTime(opts?.expiresIn ?? '1h')
    .sign(key);
  return jwt;
}

export async function verifyJwt(token: string, publicKeyPem: string, opts?: { issuer?: string; audience?: string }) {
  const alg = 'RS256';
  const key = await importSPKI(publicKeyPem, alg);
  const { payload } = await jwtVerify(token, key, {
    issuer: opts?.issuer ?? 'nusantara',
    audience: opts?.audience ?? 'nusantara',
  });
  return payload as JwtClaims & { iat?: number; exp?: number };
}

export default {
  generateRsaKeyPair,
  signJwt,
  verifyJwt,
};
