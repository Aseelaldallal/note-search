/**
 * Inversify Dependency Injection Container
 *
 * TOKENS (from injection-tokens.ts) are unique Symbols used as lookup keys.
 * Think of the container as a dictionary mapping tokens to implementations.
 *
 * How it works:
 *   1. Here we register: bind(TOKENS.Database).to(Database)
 *      This says: "When someone asks for TOKENS.Database, create/return a Database instance"
 *
 *   2. In classes we request: @inject(TOKENS.Database) db: Database
 *      This says: "Give me whatever is registered for TOKENS.Database"
 *
 *   3. Inversify looks up the token, finds the bound instance/class, and injects it
 *
 * Binding methods:
 *   | Method                      | Who creates instance? | @injectable() needed? |
 *   |-----------------------------|----------------------|----------------------|
 *   | .to(Class)                  | Inversify            | Yes                  |
 *   | .toConstantValue(instance)  | You                  | No                   |
 *
 * When to use each:
 *   - Our classes: use .to(Class) - Inversify creates and manages them
 *   - Third-party (OpenAI, Cohere, PgBoss): use .toConstantValue() - they don't have
 *     @injectable() decorators and often need special initialization (e.g., await boss.start())
 *   - Config values (env vars): use .toConstantValue() for simple strings
 *
 * Scopes (only applies to .to() bindings):
 *   - inSingletonScope(): One instance shared across the entire app
 *   - inTransientScope(): New instance every time (default if not specified)
 */

import 'reflect-metadata';
import { Container } from 'inversify';
import { PgBoss } from 'pg-boss';
import OpenAI from 'openai';
import { CohereClientV2 } from 'cohere-ai';

import { TOKENS } from './injection-tokens';
import { Database } from '../database/db';
import { ChunkRepository } from '../repositories/chunk.repository';
import { ChunkerService } from '../services/chunker.service';
import { SearchService } from '../services/search.service';
import { UploadService } from '../services/upload.service';
import { PgBossQueue } from '../queue/pgboss-queue';
import { SearchController } from '../controllers/search.controller';
import { UploadController } from '../controllers/upload.controller';
import type { IJobQueue } from '../interfaces/queue/job-queue.interface';

let container: Container | null = null;

export async function initializeContainer(): Promise<Container> {
  container = new Container();

  // Config values - simple strings from environment
  container.bind<string>(TOKENS.DatabaseUrl).toConstantValue(process.env.DATABASE_URL!);
  container.bind<string>(TOKENS.OpenAIKey).toConstantValue(process.env.OPENAI_API_KEY!);
  container.bind<string>(TOKENS.CohereKey).toConstantValue(process.env.COHERE_API_KEY!);

  // Our classes - Inversify creates and manages these
  container.bind<Database>(TOKENS.Database).to(Database).inSingletonScope();
  container.bind<ChunkRepository>(TOKENS.ChunkRepository).to(ChunkRepository).inSingletonScope();
  container.bind<IJobQueue>(TOKENS.JobQueue).to(PgBossQueue).inSingletonScope();
  container.bind<ChunkerService>(TOKENS.ChunkerService).to(ChunkerService).inSingletonScope();
  container.bind<SearchService>(TOKENS.SearchService).to(SearchService).inSingletonScope();
  container.bind<UploadService>(TOKENS.UploadService).to(UploadService).inSingletonScope();
  container.bind<SearchController>(TOKENS.SearchController).to(SearchController).inSingletonScope();
  container.bind<UploadController>(TOKENS.UploadController).to(UploadController).inSingletonScope();

  // Third-party clients - we create these ourselves because they don't have @injectable()
  // decorators and require special initialization
  const boss = new PgBoss(process.env.DATABASE_URL!);
  await boss.start();
  container.bind<PgBoss>(TOKENS.PgBoss).toConstantValue(boss);

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  container.bind<OpenAI>(TOKENS.OpenAI).toConstantValue(openai);

  const cohere = new CohereClientV2({ token: process.env.COHERE_API_KEY });
  container.bind<CohereClientV2>(TOKENS.Cohere).toConstantValue(cohere);

  return container;
}

export function getContainer(): Container {
  if (!container) {
    throw new Error('Container not initialized. Call initializeContainer() first.');
  }
  return container;
}
