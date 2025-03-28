import { BadRequestError } from '@src/errors/http.error';
import multer from 'multer';
import path from 'path';
import { Request, Express } from 'express';
import fs from 'fs';
import { generateUUID } from '@src/utils/uuid.util';
import { env } from '@src/config/env.config';

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    const uploadDir = path.join(env.FILE_UPLOAD_DIR, 'products');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, `${env.FILE_UPLOAD_DIR}/products`);
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, generateUUID() + path.extname(file.originalname));
  },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(null, false);
    throw new BadRequestError('Allowed file types: jpg, jpeg, png');
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: env.FILE_UPLOAD_LIMIT_SIZE * 1024 * 1024,
  },
});
