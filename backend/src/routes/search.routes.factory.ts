import { Router } from 'express';
import OpenAI from 'openai';
import { ChunkerService } from '../services/chunker.service';
import { SearchService } from '../services/search.service';
import { SearchController } from '../controllers/search.controller';

export function createSearchRouter(chunkerService: ChunkerService, openai: OpenAI): Router {
  const router = Router();

  // Wire up dependencies
  const searchService = new SearchService(chunkerService, openai);
  const searchController = new SearchController(searchService);

  // Routes
  router.post('/', (req, res) => searchController.handleSearch(req, res));

  return router;
}
