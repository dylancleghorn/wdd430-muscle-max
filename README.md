# MuscleMAX

MuscleMAX is a private workout builder and tracker. It helps gym-goers organize routines, record completed sessions, and review their consistency.

## Team

- Dylan Cleghorn

## Technology

- Next.js 16 and TypeScript
- Tailwind CSS
- Auth.js v5 with Google sign-in
- Supabase PostgreSQL
- Vercel deployment

## Local setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` and fill in every value.
3. In Supabase Dashboard, open **SQL Editor** and run [`supabase/schema.sql`](supabase/schema.sql).
4. In Google Cloud Console, configure this OAuth callback URI for local development:

   ```text
   http://localhost:3000/api/auth/callback/google
   ```

5. Start the app with `npm run dev` and open [http://localhost:3000](http://localhost:3000).

Never commit `.env.local`, and never expose `SUPABASE_SECRET_KEY` in client-side code.

## Available API endpoints

All workout endpoints require a valid Auth.js session and enforce ownership on the server.

| Method            | Endpoint                                  | Purpose                                     |
| ----------------- | ----------------------------------------- | ------------------------------------------- |
| `GET`             | `/api/workouts`                           | List the signed-in user’s routines.         |
| `POST`            | `/api/workouts`                           | Create a routine.                           |
| `GET`             | `/api/workouts/:id`                       | Read one owned routine.                     |
| `PATCH`           | `/api/workouts/:id`                       | Update one owned routine.                   |
| `DELETE`          | `/api/workouts/:id`                       | Delete one owned routine.                   |
| `GET`, `POST`     | `/api/workouts/:id/exercises`             | List or add exercises to one owned routine. |
| `PATCH`, `DELETE` | `/api/workouts/:id/exercises/:exerciseId` | Update or remove one owned exercise.        |

## Development workflow

- Work on a descriptive feature branch and open a pull request before merging to `main`.
- Run `npm run lint` and `npm run format:check` before opening a pull request.
- Configure the same environment variables in Vercel before deploying.

## Current scope and future work

Week 4 establishes Google authentication, Supabase data access, protected routes, shared UI, and the workout-routine API. Routine/exercise editor screens, session history, the dashboard summary, and additional polish remain planned for later weeks. See [`docs/project-specification.md`](docs/project-specification.md) for the full project plan.
