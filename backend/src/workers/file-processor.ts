// Preserved chunking/embedding logic - will be wired up later as a worker
import fs from 'fs/promises';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

interface Chunk {
  text: string;
  filename: string;
  chunkIndex: number;
  embedding?: number[];
}

export interface ProcessFileJobData {
  filePath: string;
  originalName: string;
}

export async function processFile(data: ProcessFileJobData): Promise<void> {
  const { filePath, originalName } = data;

  console.log(`Processing file: ${originalName}`);

  // Read file content
  const content = await fs.readFile(filePath, 'utf-8');

  // Split by double newline (paragraphs)
  const paragraphs = content
    .split('\n\n')
    .map(p => p.trim())
    .filter(p => p.length > 0);

  // Create chunks with metadata
  const chunks: Chunk[] = paragraphs.map((text, index) => ({
    text,
    filename: originalName,
    chunkIndex: index
  }));

  console.log(`- ${originalName}: Created ${chunks.length} chunks`);

  // Generate embeddings for all chunks
  console.log('Generating embeddings...');
  for (const chunk of chunks) {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: chunk.text
    });
    chunk.embedding = response.data[0].embedding;
    console.log(`- Generated embedding for chunk ${chunk.chunkIndex} from ${chunk.filename}`);

    // TODO: Insert into database using ChunkRepository
    // await chunkRepository.insertChunk({
    //   source_filename: chunk.filename,
    //   content: chunk.text,
    //   embedding: chunk.embedding
    // });
  }

  // Delete file from disk after processing
  await fs.unlink(filePath);
  console.log(`- Deleted file: ${filePath}`);

  console.log(`✅ Finished processing: ${originalName}`);
}
