// Reflect Metadata for class-transformer
import 'reflect-metadata';

// Other imports
import { env } from '@src/config/env.config';
import { errorHandler, responseHandler } from '@src/middlewares/response-handler.middleware';
import customerRoute from '@src/routes/customer/route';
import sellerRoute from '@src/routes/seller/route';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { listRoutes } from './utils/server.util';

// Express Initialize
const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Response handler
app.use(responseHandler);

// Routes
app.use('/api/customer', customerRoute);
app.use('/api/seller', sellerRoute);

// Error handler
app.use(errorHandler);

// Start server
app.listen(env.PORT, () => {
  console.log(`Server are running at: ${env.PORT}`);
  console.log('\nAvailable Routes:');
  const routes = listRoutes(app);
  routes.forEach((route) => {
    console.log(`${route.method.padEnd(7)} ${route.path}`);
  });
});

export default app;
