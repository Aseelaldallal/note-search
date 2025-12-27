import { Router } from 'express';
import { getContainer, TOKENS } from '../container';
import { SearchController } from '../controllers/search.controller';

export function createSearchRouter(): Router {
  const router = Router();
  const searchController = getContainer().get<SearchController>(TOKENS.SearchController);

  router.post('/', (req, res) => searchController.handleSearch(req, res));

  return router;
}
