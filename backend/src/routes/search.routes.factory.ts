import { Router } from 'express';
import OpenAI from 'openai';
import { CohereClientV2 } from 'cohere-ai';
import { ChunkerService } from '../services/chunker.service';
import { SearchService } from '../services/search.service';
import { SearchController } from '../controllers/search.controller';

export function createSearchRouter(
  chunkerService: ChunkerService,
  openai: OpenAI,
  cohere: CohereClientV2
): Router {
  const router = Router();

  // Wire up dependencies
  const searchService = new SearchService(chunkerService, openai, cohere);
  const searchController = new SearchController(searchService);

  // Routes
  router.post('/', (req, res) => searchController.handleSearch(req, res));

  return router;
}
