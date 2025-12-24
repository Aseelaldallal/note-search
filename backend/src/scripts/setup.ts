import dotenv from 'dotenv';
dotenv.config();

import { PgBoss } from 'pg-boss';

async function setup() {
  console.log('Running setup...');

  // Create pg-boss instance and queues
  const boss = new PgBoss(process.env.DATABASE_URL!);
  await boss.start();

  await boss.createQueue('process-file');
  console.log('✅ Created queue: process-file');

  await boss.stop();
  console.log('✅ Setup complete');
  process.exit(0);
}

setup().catch(err => {
  console.error('❌ Setup failed:', err);
  process.exit(1);
});
