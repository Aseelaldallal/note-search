import 'reflect-metadata';
import dotenv from 'dotenv';

// Load environment variables from .env file FIRST
// Must be before any other imports that use env vars
dotenv.config();

import { PgBoss } from 'pg-boss';
import { initializeContainer, getContainer, TOKENS } from './container';
import { Database } from './database/db';
import { createApp } from './app';

const PORT: number = parseInt(process.env.PORT || '5001', 10);

async function startServer() {
  try {
    await initializeContainer();
    const app = createApp();

    console.log('Starting server');

    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server', error);
    process.exit(1);
  }
}

async function shutdown(): Promise<void> {
  try {
    const container = getContainer();

    // Stop pg-boss first (it depends on the database)
    const boss = container.get<PgBoss>(TOKENS.PgBoss);
    await boss.stop();
    console.log('Stopped pg-boss');

    const db = container.get<Database>(TOKENS.Database);
    await db.getPool().end();
    console.log('Disconnected from Postgres');
  } catch (error) {
    console.error('Error during shutdown:', error);
  }
}

process.on('SIGTERM', async () => {
  console.log('Received SIGTERM');
  await shutdown();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('Received SIGINT');
  await shutdown();
  process.exit(0);
});

startServer();
