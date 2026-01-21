import type { RequestHandler } from 'express';
import type Koa from 'koa';
import { jwtVerify, createRemoteJWKSet } from 'jose';

export type JwtMiddlewareOptions = {
  jwksUri?: string; // if provided, middleware will fetch keys from this URI
  issuer?: string;
  audience?: string;
};

export function expressJwtMiddleware(opts: JwtMiddlewareOptions): RequestHandler {
  if (!opts.jwksUri) throw new Error('jwksUri required for JWKS middleware');
  const jwks = createRemoteJWKSet(new URL(opts.jwksUri));
  const handler: RequestHandler = async (req, res, next) => {
    try {
      const auth = req.headers.authorization as string | undefined;
      if (!auth) {
        res.status(401).send('missing authorization');
        return;
      }
      const token = auth.split(' ')[1];
      const verified = await jwtVerify(token, jwks, { issuer: opts.issuer, audience: opts.audience });
      // attach payload to request (may require augmenting types in consuming apps)
      (req as any).user = verified.payload;
      next();
    } catch (err) {
      res.status(401).send('invalid token');
    }
  };
  return handler;
}

export function koaJwtMiddleware(opts: JwtMiddlewareOptions) {
  if (!opts.jwksUri) throw new Error('jwksUri required for JWKS middleware');
  const jwks = createRemoteJWKSet(new URL(opts.jwksUri));
  return async (ctx: Koa.Context, next: Koa.Next) => {
    try {
      const auth = ctx.headers.authorization as string | undefined;
      if (!auth) {
        ctx.status = 401;
        ctx.body = 'missing authorization';
        return;
      }
      const token = auth.split(' ')[1];
      const verified = await jwtVerify(token, jwks, { issuer: opts.issuer, audience: opts.audience });
      // attach payload
      ctx.state.user = verified.payload;
      await next();
    } catch (err) {
      ctx.status = 401;
      ctx.body = 'invalid token';
    }
  };
}
