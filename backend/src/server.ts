import dotenv from 'dotenv';

// Load environment variables from .env file FIRST
// Must be before any other imports that use env vars
dotenv.config();

import { app } from './app';
import { getDatabaseInstance } from './database/db.factory';
import { getBossInstance } from './queue/boss.factory';
import { shutdown } from './shutdown';

const PORT: number = parseInt(process.env.PORT || '5001', 10);

async function startServer() {
  try {
    const db = getDatabaseInstance();
    await db.testConnection();

    // Initialize pg-boss
    await getBossInstance();
    console.log('✅ pg-boss started');

    console.log('✅ Starting server');

    app.listen(PORT, () => {
      console.log(`✅ Listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error starting server', error);
    process.exit(1);
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
