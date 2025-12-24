import OpenAI from 'openai';
import { ChunkerService } from './chunker.service';

export class SearchService {
  constructor(
    private readonly chunkerService: ChunkerService,
    private readonly openai: OpenAI
  ) {}

  public async search(query: string): Promise<void> {
    console.log('TODO: implement search');
  }
}
