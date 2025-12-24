export interface IJobQueue {
  send(jobName: string, data: Record<string, unknown>): Promise<void>;
}
