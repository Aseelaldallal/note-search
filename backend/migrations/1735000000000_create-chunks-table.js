exports.up = (pgm) => {
  pgm.createTable('chunks', {
    id: 'id',
    source_filename: { type: 'text' },
    content: { type: 'text' },
    embedding: { type: 'vector(1536)' }
  });

  pgm.sql('CREATE INDEX ON chunks USING hnsw (embedding vector_cosine_ops)');
};

exports.down = (pgm) => {
  pgm.dropTable('chunks');
};
