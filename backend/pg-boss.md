# pg-boss 101

pg-boss is a job queue that uses Postgres as its storage. Jobs go in a table, workers poll and process them.

## Schema

pg-boss creates its own `pgboss` schema, separate from your `public` schema. This keeps its internal tables organized and avoids naming conflicts with your app tables.

### Tables

| Table | Purpose |
|-------|---------|
| `job` | The main queue — pending, active, and recent jobs |
| `queue` | Metadata about job types (one row per job type, not per job) |
| `schedule` | For recurring/cron jobs |
| `subscription` | Tracks which workers are listening to which job types |
| `version` | Schema version for migrations |

## Job Lifecycle

1. You call `boss.send('process-file', { ... })` → row inserted into `job` table with state `created`
2. Worker calls `boss.work('process-file', handler)` → polls the table
3. Worker picks up job → state becomes `active`
4. Handler completes → state becomes `completed`
5. Handler throws → state becomes `failed` (can auto-retry)

## Key Job Columns

| Column | What it means |
|--------|---------------|
| `state` | `created` → `active` → `completed` or `failed` |
| `retry_limit` | How many times to retry on failure (default 2) |
| `retry_count` | How many times it's failed so far |
| `expire_seconds` | Job times out if worker doesn't finish in this time (default 900s / 15 min). Job returns to `created` for another worker to retry. |
| `keep_until` | Job row deleted after this date for cleanup (default ~2 weeks) |
| `dead_letter` | If set, failed jobs go to another queue instead of disappearing |

## Queue Table vs Job Table

- `queue` table = one row per job **type** (with stats like `queued_count`, `active_count`)
- `job` table = one row per actual **job**

The `queue` table also contains an internal pg-boss housekeeping queue called `__pgboss__send-it`.

## Polling Delay

pg-boss workers don't get notified instantly when a job is added. They poll the database on an interval — default is every 2 seconds.

This means there's a small delay (up to 2 seconds) between `boss.send()` and the worker picking up the job.

For background tasks like file processing, this is fine. For real-time requirements (chat, instant notifications), consider Redis/BullMQ which uses pub/sub instead of polling.

## Overriding Defaults

```typescript
await boss.send('process-file', data, {
  expireInSeconds: 3600,    // 1 hour timeout instead of 15 min
  retentionDays: 30         // keep job record for 30 days instead of 2 weeks
});
```
