const { NestFactory } = require('@nestjs/core');
const { ExpressAdapter } = require('@nestjs/platform-express');
const { ValidationPipe } = require('@nestjs/common');
const { AppModule } = require('../dist/src/app.module');
const express = require('express');

const server = express();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  const origins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',')
    : ['http://localhost:5173', 'http://localhost:3001'];

  app.enableCors({ origin: origins, credentials: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));


  await app.init();
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
