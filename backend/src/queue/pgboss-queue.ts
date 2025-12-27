import { injectable, inject } from 'inversify';
import { PgBoss } from 'pg-boss';
import { TOKENS } from '../container';
import type { IJobQueue } from '../interfaces/queue/job-queue.interface';

@injectable()
export class PgBossQueue implements IJobQueue {
  constructor(@inject(TOKENS.PgBoss) private readonly boss: PgBoss) {}

  async send(jobName: string, data: Record<string, unknown>): Promise<void> {
    await this.boss.send(jobName, data);
  }
}
