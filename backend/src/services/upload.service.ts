import { injectable, inject } from 'inversify';
import { TOKENS } from '../container';
import type { IJobQueue } from '../interfaces/queue/job-queue.interface';

@injectable()
export class UploadService {
  constructor(@inject(TOKENS.JobQueue) private readonly jobQueue: IJobQueue) {}

  public async queueFilesForProcessing(files: Express.Multer.File[]): Promise<number> {
    for (const file of files) {
      await this.jobQueue.send('process-file', {
        filePath: file.path,
        originalName: file.originalname
      });
      console.log(`Queued job for: ${file.originalname}`);
    }
    return files.length;
  }
}
