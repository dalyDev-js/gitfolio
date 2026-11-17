# GitFolio

Type a GitHub username, get a clean, shareable developer portfolio at `/username`.

Day 3 of **Everyday App**.

## Features

- Profile hero with bio, location, links and join year
- Stats: public repos, stars earned, forks, followers
- Language breakdown and a 12-month activity chart
- Featured work (top repos by stars and forks)
- All projects with search, language filters, sorting and a forks toggle
- Per-user Open Graph image, so shared links get a rich preview
- Light and dark mode, mobile friendly

## Stack

Next.js 16 (App Router, Cache Components, Partial Prefetching), React 19, Tailwind CSS v4, `next/og`.

GitHub responses are cached for an hour per username with `"use cache"`.

## Run locally

```bash
npm install
npm run dev
```

### Environment variables (optional)

| Name | Why |
| --- | --- |
| `GITHUB_TOKEN` | Raises the GitHub API limit from 60 to 5,000 requests per hour. A fine-grained token with no scopes is enough. Recommended in production. |
| `GITHUB_API_URL` | Override the API base URL (useful for local mocks). |
