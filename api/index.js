const { NestFactory } = require('@nestjs/core');
const { ExpressAdapter } = require('@nestjs/platform-express');
const { ValidationPipe } = require('@nestjs/common');
const { AppModule } = require('../dist/app.module');
const express = require('express');
const { join } = require('path');
const { existsSync } = require('fs');

const server = express();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  const origins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',')
    : ['http://localhost:5173', 'http://localhost:3001'];

  app.enableCors({ origin: origins, credentials: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.init();

  const frontendPath = join(__dirname, '..', 'frontend', 'dist');
  if (existsSync(frontendPath)) {
    server.use(express.static(frontendPath));
    server.get('*', (req, res, next) => {
      if (req.path.startsWith('/auth') || req.path.startsWith('/spaces') ||
          req.path.startsWith('/reservations') || req.path.startsWith('/reviews') ||
          req.path.startsWith('/favorites') || req.path.startsWith('/amenities') ||
          req.path.startsWith('/notifications') || req.path.startsWith('/users')) {
        return next();
      }
      res.sendFile(join(frontendPath, 'index.html'));
    });
  }

  return server;
}

let cachedServer;

module.exports = async (req, res) => {
  if (!cachedServer) {
    try {
      cachedServer = await bootstrap();
    } catch (err) {
      console.error('Bootstrap error:', err);
      res.status(500).json({ error: 'Internal server error', message: err.message });
      return;
    }
  }
  cachedServer(req, res);
};
