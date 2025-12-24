import { Pool, PoolClient } from 'pg';

export class Database {
  private pool: Pool;

  constructor(connectionString: string) {
    this.pool = new Pool({ connectionString });

    this.pool.on('connect', () => {
      console.log('✅ Connected to DB!');
    });

    this.pool.on('error', (error: Error) => {
      console.log('❌ Pool Error', error);
    });
  }

  public getPool(): Pool {
    return this.pool;
  }

  public async testConnection(): Promise<void> {
    let client: PoolClient | null = null;
    try {
      client = await this.pool.connect();
      console.log('✅ DB Connection works');
    } catch (error) {
      console.error('❌ DB connection failed', error);
      throw error;
    } finally {
      if (client) {
        client.release();
      }
    }
  }
}
