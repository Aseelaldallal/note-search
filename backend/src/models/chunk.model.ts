import { Exclude, Expose } from 'class-transformer';

export class Chunk {
  @Expose({ name: 'id' })
  id!: number;

  @Expose({ name: 'source_filename' })
  sourceFilename!: string;

  @Expose({ name: 'content' })
  content!: string;

  @Exclude()
  embedding!: number[];
}
