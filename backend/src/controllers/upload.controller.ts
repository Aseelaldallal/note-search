import { Request, Response } from 'express';
import fs from 'fs/promises';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

interface Chunk {
  text: string;
  filename: string;
  chunkIndex: number;
  embedding?: number[];
}

export const uploadFiles = async (req: Request, res: Response): Promise<void> => {
  try {
    // Multer adds files to req.files when using .array()
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      res.status(400).json({ error: 'No files uploaded' });
      return;
    }

    // Log uploaded file details
    console.log(`Received ${files.length} file(s):`);
    files.forEach(file => {
      console.log(`- ${file.originalname} (${file.size} bytes) -> ${file.path}`);
    });

    // Process files and create chunks
    const allChunks: Chunk[] = [];

    for (const file of files) {
      // Read file content
      const content = await fs.readFile(file.path, 'utf-8');

      // Split by double newline (paragraphs)
      const paragraphs = content
        .split('\n\n')
        .map(p => p.trim())
        .filter(p => p.length > 0); // Remove empty chunks

      // Create chunks with metadata
      const fileChunks: Chunk[] = paragraphs.map((text, index) => ({
        text,
        filename: file.originalname,
        chunkIndex: index
      }));

      allChunks.push(...fileChunks);

      console.log(`- ${file.originalname}: Created ${fileChunks.length} chunks`);
    }

    console.log(`Total chunks created: ${allChunks.length}`);

    // Generate embeddings for all chunks
    console.log('Generating embeddings...');
    for (const chunk of allChunks) {
      const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: chunk.text
      });
      chunk.embedding = response.data[0].embedding;
      console.log(`- Generated embedding for chunk ${chunk.chunkIndex} from ${chunk.filename}`);
    }

    console.log('All embeddings generated successfully!');

    // Return success response with chunks and embeddings
    res.json({
      message: 'Files uploaded, chunked, and embedded successfully',
      totalChunks: allChunks.length,
      chunks: allChunks
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({ error: 'Failed to upload files' });
  }
};
