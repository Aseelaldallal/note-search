import { getDatabaseInstance } from './database/db.factory';
import { getBossInstanceSync } from './queue/boss.factory';

export async function shutdown(): Promise<void> {
  try {
    // Stop pg-boss first (it depends on the database)
    const boss = getBossInstanceSync();
    if (boss) {
      await boss.stop();
      console.log('✅ Stopped pg-boss');
    }

    const db = getDatabaseInstance();
    await db.getPool().end();
    console.log('✅ Disconnected from Postgres');
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
  }
}
