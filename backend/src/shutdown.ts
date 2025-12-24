import { getDatabaseInstance } from './database/db.factory';

export async function shutdownDB(): Promise<void> {
  try {
    const db = getDatabaseInstance();
    await db.getPool().end();
    console.log('✅ Disconnected from Postgres');
  } catch (error) {
    console.error('❌ Error disconnecting from Postgres:', error);
  }
}
