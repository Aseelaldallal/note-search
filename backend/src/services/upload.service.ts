import { IJobQueue } from '../interfaces/queue/job-queue.interface';

export class UploadService {
  constructor(private readonly jobQueue: IJobQueue) {}

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
