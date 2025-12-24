import { Database } from './db';

let databaseInstance: Database | null = null;

export function getDatabaseInstance(): Database {
  if (!databaseInstance) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    databaseInstance = new Database(connectionString);
  }

  return databaseInstance;
}
