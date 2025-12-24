import { PgBoss } from 'pg-boss';

let bossInstance: PgBoss | null = null;

export async function getBossInstance(): Promise<PgBoss> {
  if (!bossInstance) {
    bossInstance = new PgBoss(process.env.DATABASE_URL!);
    // boss.start() creates the `pgboss` schema and tables if they don't exist,
    // then starts polling for jobs
    await bossInstance.start();
  }
  return bossInstance;
}

// For shutdown - doesn't need async since we're just returning the cached instance
export function getBossInstanceSync(): PgBoss | null {
  return bossInstance;
}
