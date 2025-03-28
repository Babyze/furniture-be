/* eslint-disable @typescript-eslint/no-explicit-any */
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';

export interface ValidateRequestMiddlewareOptions {
  body?: any;
  query?: any;
  params?: any;
}

export const validateRequest = (options: ValidateRequestMiddlewareOptions) => {
  return async (
    req: Request<any, any, any, any>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      for (const [key, value] of Object.entries(options)) {
        const dtoObject = plainToInstance(value, req[key as keyof typeof req]);
        const errors = await validate(dtoObject);
        if (errors.length) {
          throw errors;
        }
        req[key as 'params' | 'body' | 'query'] = dtoObject;
      }
    } catch (errors: any) {
      if (errors.length > 0) {
        res.status(400).json({ message: 'Validation failed', errors });
        return;
      }
    }

    next();
  };
};
