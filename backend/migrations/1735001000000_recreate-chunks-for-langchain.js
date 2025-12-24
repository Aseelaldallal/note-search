exports.up = (pgm) => {
  pgm.dropTable('chunks');

  pgm.createTable('chunks', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    content: { type: 'text' },
    metadata: { type: 'jsonb' },
    embedding: { type: 'vector(1536)' }
  });

  pgm.sql('CREATE INDEX ON chunks USING hnsw (embedding vector_cosine_ops)');
};

exports.down = (pgm) => {
  pgm.dropTable('chunks');

  // Restore original schema
  pgm.createTable('chunks', {
    id: 'id',
    source_filename: { type: 'text' },
    content: { type: 'text' },
    embedding: { type: 'vector(1536)' }
  });

  pgm.sql('CREATE INDEX ON chunks USING hnsw (embedding vector_cosine_ops)');
};
