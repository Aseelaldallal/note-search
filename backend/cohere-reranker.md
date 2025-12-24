# Cohere Reranker

## What is Cohere?

Cohere is an AI company that provides NLP APIs. Their main offerings include:

- **Embed** — Generate embeddings (similar to OpenAI's embedding API)
- **Generate** — Text generation (similar to GPT)
- **Rerank** — Re-score search results for relevance

We're using their **Rerank API** specifically.

---

## What is Reranking?

Reranking is a second-pass relevance scoring step that happens after initial retrieval.

### The problem with vector search alone

Vector search finds semantically similar chunks, but "similar" doesn't always mean "best answer."

**Example query:** "What's the refund policy?"

Vector search might return:

| Rank | Chunk | Score |
|------|-------|-------|
| 1 | Chunk about refunds | 0.82 |
| 2 | Chunk about billing | 0.80 |
| 3 | Chunk about payment methods | 0.79 |

All three are "related" to money/payments, but only #1 actually answers the question.

### What a reranker does

A reranker takes the query + each chunk and asks: *"Does this chunk actually answer this question?"*

It's more expensive (one inference per chunk), but more accurate. That's why we use it as a **second pass** on a smaller candidate set, not as the primary search.

---

## Two-Stage Retrieval Pattern

```
User Query
    ↓
┌─────────────────────────────────┐
│ Stage 1: Vector Search          │
│ - Fast, cheap                   │
│ - Fetch 20 candidates           │
│ - Based on semantic similarity  │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│ Stage 2: Reranker               │
│ - Slower, more expensive        │
│ - Score each candidate          │
│ - Return top 10                 │
└─────────────────────────────────┘
    ↓
Final 10 chunks → LLM
```

### Why not just use the reranker for everything?

| Method | Speed |
|--------|-------|
| Vector search | ~10ms for millions of documents |
| Reranker | ~200ms for 20 documents |

You can't run a reranker on your entire database. It doesn't scale. Vector search narrows down candidates, reranker picks the best ones.
