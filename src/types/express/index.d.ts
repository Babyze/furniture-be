/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
declare module 'express-serve-static-core' {
  interface Router {
    put: <P = object, ResBody = object, ReqBody = object, ReqQuery = object>(
      path: string,
      ...handlers: any[]
    ) => Router;

    post: <P = object, ResBody = object, ReqBody = object, ReqQuery = object>(
      path: string,
      ...handlers: any[]
    ) => Router;
  }
}
