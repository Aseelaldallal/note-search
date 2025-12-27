/**
 * Inversify Injection Tokens
 *
 * These Symbols act as unique identifiers for dependency injection. Unlike TypeScript
 * types (which are erased at runtime), Symbols persist and allow Inversify to know
 * which concrete implementation to inject when a class requests a dependency.
 */
export const TOKENS = {
  // Config (environment variables)
  DatabaseUrl: Symbol.for('DatabaseUrl'),
  OpenAIKey: Symbol.for('OpenAIKey'),
  CohereKey: Symbol.for('CohereKey'),

  // External clients
  Database: Symbol.for('Database'),
  PgBoss: Symbol.for('PgBoss'),
  OpenAI: Symbol.for('OpenAI'),
  Cohere: Symbol.for('Cohere'),

  // Repositories
  ChunkRepository: Symbol.for('ChunkRepository'),

  // Services
  ChunkerService: Symbol.for('ChunkerService'),
  SearchService: Symbol.for('SearchService'),
  UploadService: Symbol.for('UploadService'),

  // Queue
  JobQueue: Symbol.for('JobQueue'),

  // Controllers
  SearchController: Symbol.for('SearchController'),
  UploadController: Symbol.for('UploadController'),
};
