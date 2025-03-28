/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS } from '@src/constant/http-status.constant';
import dayjs from 'dayjs';
import { HttpError } from '@src/errors/http.error';

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: unknown[];
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response<ApiResponse>,
  _next: NextFunction,
): void => {
  console.error(
    `ERROR - ${dayjs().format('YYYY-MM-DD HH:mm:ss')} "${req.method} ${req.path}": \n ${err.message}`,
  );

  if (err instanceof HttpError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: 'Internal Server Error',
  });
};

export const responseHandler = (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction,
): void => {
  const originalJson = res.json;
  res.json = function (body: any): Response {
    if (res.statusCode >= HTTP_STATUS.BAD_REQUEST) {
      return originalJson.call(this, {
        success: false,
        message: body.message || 'Error occurred',
        errors: body.errors,
      });
    }

    return originalJson.call(this, {
      success: true,
      data: body ?? {
        message: 'success',
      },
    });
  };
  next();
};
