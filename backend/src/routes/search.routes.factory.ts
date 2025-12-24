import { Router } from 'express';
import { SearchService } from '../services/search.service';
import { SearchController } from '../controllers/search.controller';

export function createSearchRouter(): Router {
  const router = Router();

  // Wire up dependencies
  const searchService = new SearchService();
  const searchController = new SearchController(searchService);

  // Routes
  router.post('/', (req, res) => searchController.handleSearch(req, res));

  return router;
}
