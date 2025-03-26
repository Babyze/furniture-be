import { HTTP_STATUS } from '@src/constant/http-status.constant';

export class HttpError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
  }
}

export class BadRequestError extends HttpError {
  constructor(message: string = 'Bad request') {
    super(HTTP_STATUS.BAD_REQUEST, message);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message: string = 'Unauthorized') {
    super(HTTP_STATUS.UNAUTHORIZED, message);
  }
}

export class ForbiddenError extends HttpError {
  constructor(message: string = 'Forbidden') {
    super(HTTP_STATUS.FORBIDDEN, message);
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string = 'Not found') {
    super(HTTP_STATUS.NOT_FOUND, message);
  }
}

export class ConflictError extends HttpError {
  constructor(message: string = 'Data is exist') {
    super(HTTP_STATUS.CONFLICT, message);
  }
}

export class InternalServerError extends HttpError {
  constructor(message: string = 'Internal server error') {
    super(HTTP_STATUS.INTERNAL_SERVER_ERROR, message);
  }
}
