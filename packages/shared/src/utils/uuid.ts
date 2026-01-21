import { randomUUID as nodeRandomUUID } from 'crypto';

export function generateUUID(): string {
  const webCrypto = (globalThis as any).crypto;
  if (webCrypto && typeof webCrypto.randomUUID === 'function') {
    return webCrypto.randomUUID();
  }
  return nodeRandomUUID();
}

export default generateUUID;
