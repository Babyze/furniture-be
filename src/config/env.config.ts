import 'dotenv/config';

const requiredEnvVars = [
  'PORT',
  'DATABASE_HOST',
  'DATABASE_PORT',
  'DATABASE_USER',
  'DATABASE_PASSWORD',
  'DATABASE_NAME',
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export const env = {
  PORT: process.env.PORT || 5000,
  DATABASE_HOST: process.env.DATABASE_HOST,
  DATABASE_PORT: Number(process.env.DATABASE_PORT ?? 3306),
  DATABASE_USER: process.env.DATABASE_USER,
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
  DATABASE_NAME: process.env.DATABASE_NAME,
  JWT_CUSTOMER_SECRET: process.env.JWT_CUSTOMER_SECRET ?? '',
  JWT_CUSTOMER_REFRESH_SECRET: process.env.JWT_CUSTOMER_REFRESH_SECRET ?? '',
  JWT_CUSTOMER_EXPIRES_IN: process.env.JWT_CUSTOMER_EXPIRES_IN ?? '1h',
  JWT_CUSTOMER_REFRESH_EXPIRES_IN: process.env.JWT_CUSTOMER_REFRESH_EXPIRES_IN ?? '7d',
  JWT_SELLER_SECRET: process.env.JWT_SELLER_SECRET ?? '',
  JWT_SELLER_REFRESH_SECRET: process.env.JWT_SELLER_REFRESH_SECRET ?? '',
  JWT_SELLER_EXPIRES_IN: process.env.JWT_SELLER_EXPIRES_IN ?? '1h',
  JWT_SELLER_REFRESH_EXPIRES_IN: process.env.JWT_SELLER_REFRESH_EXPIRES_IN ?? '7d',
};
