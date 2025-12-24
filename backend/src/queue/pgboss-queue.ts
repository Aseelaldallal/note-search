import { PgBoss } from 'pg-boss';
import { IJobQueue } from '../interfaces/queue/job-queue.interface';

export class PgBossQueue implements IJobQueue {
  constructor(private readonly boss: PgBoss) {}

  async send(jobName: string, data: Record<string, unknown>): Promise<void> {
    await this.boss.send(jobName, data);
  }
}
