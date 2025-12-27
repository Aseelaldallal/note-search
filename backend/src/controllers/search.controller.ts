import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { TOKENS } from '../container';
import { SearchService } from '../services/search.service';

@injectable()
export class SearchController {
  constructor(@inject(TOKENS.SearchService) private readonly searchService: SearchService) {}

  async handleSearch(req: Request, res: Response): Promise<void> {
    const { query, useReranker = false } = req.body ?? {};
    console.log('Received search request:', query, 'useReranker:', useReranker);

    try {
      const result = await this.searchService.search(query, useReranker);
      res.json(result);
    } catch (error) {
      console.error('Error handling search request:', error);
      res.status(500).json({ error: 'Failed to handle search request' });
    }
  }
}
