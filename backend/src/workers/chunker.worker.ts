import { ChunkerService } from '../services/chunker.service';
import type { ProcessFileJobData } from '../types';

export function createProcessFileHandler(chunkerService: ChunkerService) {
  return async (jobs: { data: ProcessFileJobData }[]): Promise<void> => {
    await Promise.all(
      jobs.map(job => chunkerService.processFile(job.data.filePath, job.data.originalName))
    );
  };
}
