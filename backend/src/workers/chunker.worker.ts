import { ChunkerService } from '../services/chunker.service';

export interface ProcessFileJobData {
  filePath: string;
  originalName: string;
}

export function createProcessFileHandler(chunkerService: ChunkerService) {
  return async (jobs: { data: ProcessFileJobData }[]): Promise<void> => {
    for (const job of jobs) {
      await chunkerService.processFile(job.data.filePath, job.data.originalName);
    }
  };
}
