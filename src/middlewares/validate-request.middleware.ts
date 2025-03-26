/* eslint-disable @typescript-eslint/no-explicit-any */
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';

export const validateRequest = (dtoClass: any) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const dtoObject = plainToInstance(dtoClass, req.body);
    const errors = await validate(dtoObject);

    if (errors.length > 0) {
      res.status(400).json({ message: 'Validation failed', errors });
      return;
    }

    req.body = dtoObject;
    next();
  };
};
