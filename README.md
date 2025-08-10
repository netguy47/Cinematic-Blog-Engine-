# Cinematic Blog Engine v5

Multimedia blog generator with images, narration, storyboard, WordPress/Notion publish, library, admin, and scheduler.

## Quickstart
```bash
npm i
cp .env.example .env.local
npm run dev
# http://localhost:3000
```

### Supabase DB Schema (SQL)
```sql
create extension if not exists "uuid-ossp";
create table if not exists posts (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  excerpt text,
  tags text[] default '{}',
  markdown text not null,
  image_prompts jsonb not null,
  image_urls text[],
  audio_url text,
  published_url text,
  notion_url text,
  created_at timestamp with time zone default now()
);
create table if not exists settings (
  key text primary key,
  value text not null,
  updated_at timestamp with time zone default now()
);
create table if not exists queue (
  id uuid primary key default uuid_generate_v4(),
  payload jsonb not null,
  status text not null default 'queued',
  result_url text,
  error text,
  created_at timestamp with time zone default now()
);
```

### Routes
- `/` — generator UI (generate → optional auto-render → publish)
- `/library` — grid list with search/tag filters + Fork
- `/admin` — SSR dashboard (set env & queue via APIs)
- `/api/generate` — article + prompts + SSML (+ optional media)
- `/api/publish` — WordPress publish
- `/api/publish-notion` — Notion publish
- `/api/render/image` — render image (OpenAI/Stability)
- `/api/render/tts` — render audio (ElevenLabs/PlayHT)
- `/api/og` — dynamic social card
- `/api/cron` — Vercel Cron target (Supabase queue)
- `/api/admin/setting`, `/api/admin/enqueue` — Basic-auth admin APIs

### Ken Burns Storyboard
Use `components/StoryboardPlayer.tsx` to preview images (or prompts) + audio.

### Production Notes
- Use Supabase Storage for media (`ENABLE_SUPABASE=true`).
- Add Vercel Cron (Settings → Cron Jobs → `/api/cron` with `Authorization: Bearer CRON_SECRET`).
- Replace Basic Auth with real auth (NextAuth) for production.


## v6 Upgrades
- **Dual Publish**: `POST /api/publish-dual` pushes to WordPress and Notion, and records both URLs.
- **Admin Actions (UI)**: `/admin` now includes credential fields and buttons to call admin APIs directly with Basic Auth.
- **Fork & Compare**: `/compare?slug=A&alt=B` shows two posts side-by-side. Use from Library by clicking **Compare…** next to a post, then paste the other slug in the URL.
