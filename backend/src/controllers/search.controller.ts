import { Request, Response } from 'express';
import { SearchService } from '../services/search.service';

export class SearchController {
  constructor(private readonly searchService: SearchService) {}

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
