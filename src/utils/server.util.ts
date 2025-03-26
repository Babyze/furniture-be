/* eslint-disable @typescript-eslint/no-explicit-any */
import { Application } from 'express';

// Function to list all routes
export const listRoutes = (app: Application) => {
  const getRoutes = (stack: any[], prefix = ''): { method: string; path: string }[] => {
    return stack
      .filter((layer) => layer.route || layer.name === 'router')
      .flatMap((layer) => {
        if (layer.route) {
          return Object.keys(layer.route.methods).map((method) => ({
            method: method.toUpperCase(),
            path: prefix + layer.route.path,
          }));
        } else if (layer.handle.stack) {
          // Lấy path từ regex pattern
          const path = layer.regexp
            .toString()
            .replace(/^\/\^/, '')
            .replace(/\?\(\?=\/\|\$\)\/i$/, '')
            .replace(/\\\//g, '/')
            .replace(/\\\?/g, '?')
            .replace(/\/\?\(\?=\/\|\$\)\/i/g, '');

          return getRoutes(layer.handle.stack, prefix + path);
        }
        return [];
      });
  };

  return getRoutes(app._router.stack);
};
