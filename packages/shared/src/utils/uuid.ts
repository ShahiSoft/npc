export function generateUUID(): string {
  // Prefer Web Crypto or Node's crypto.randomUUID when available
  try {
    // @ts-ignore global crypto in newer Node versions
    if (typeof crypto !== 'undefined' && typeof (crypto as any).randomUUID === 'function') {
      // @ts-ignore
      return (crypto as any).randomUUID();
    }
  } catch {}

  // Fallback to Node's crypto module
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { randomUUID } = require('crypto');
  return randomUUID();
}

export default generateUUID;
