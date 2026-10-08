# MuscleMAX

MuscleMAX is a private workout builder and tracker. It helps gym-goers organize routines, record completed sessions, and review their consistency.

## Project links

- Repository: [github.com/dylancleghorn/wdd430-muscle-max](https://github.com/dylancleghorn/wdd430-muscle-max)
- Live deployment: [wdd430-muscle-max.vercel.app](https://wdd430-muscle-max.vercel.app)
- Product demo: to be added after the final deployed workflow is recorded.

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

## Account provisioning and access

MuscleMAX uses Google through Auth.js for both account creation and sign-in. A person's first successful Google sign-in automatically creates or updates their private application user record in Supabase; later sign-ins use that same account. There is intentionally no separate password-based registration form.

Private pages and API endpoints require an authenticated session. Signing out returns the user to the public landing page and prevents access to private routes until they sign in again.

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
| `POST`            | `/api/workouts/:id/sessions`              | Save a completed routine and set snapshots. |
| `GET`             | `/api/sessions`                           | List the signed-in user’s workout history.  |
| `GET`             | `/api/dashboard`                          | Return session count and recent workouts.   |

## Development workflow

- Work on a descriptive feature branch and open a pull request before merging to `main`.
- Run `npm run lint` and `npm run format:check` before opening a pull request.
- Run `npm run build` with internet access so Next.js can download the configured Geist font.
- Configure the same environment variables in Vercel before deploying.

## Deployment

1. Create a Vercel project from this repository and use the default Next.js build settings.
2. Add every variable listed in `.env.example` to the Vercel project's production environment.
3. In Google Cloud Console, add the production callback URI: `https://<your-domain>/api/auth/callback/google`.
4. Deploy, then verify the live sign-in, routine CRUD, exercise CRUD, session logging, history, dashboard, and sign-out workflows.
5. Add the verified production URL and product-demo link to the **Project links** section above.

## Release checklist

- Apply [`supabase/schema.sql`](supabase/schema.sql) to the production Supabase project.
- Add the values from `.env.example` to the Vercel project, including the production Auth.js URL and Google OAuth callback URI.
- Verify Google sign-in, routine and exercise CRUD, session logging, history, dashboard counts, empty states, and a narrow mobile layout before submitting.

## Lighthouse audit

Mobile Lighthouse 13.4.0 audits were run against the production deployment on October 8, 2026.

| Page                                                           | Performance | Accessibility | Best Practices | SEO |
| -------------------------------------------------------------- | ----------- | ------------- | -------------- | --- |
| [`/dashboard`](https://wdd430-muscle-max.vercel.app/dashboard) | 96          | 100           | 100            | 100 |
| Routine detail                                                 | 99          | 100           | 100            | 100 |

The reports found no critical issues. The remaining performance suggestions are minor JavaScript and browser-cache optimization opportunities and do not affect the rubric's accessibility, best-practices, or SEO criteria.

## Current scope and future work

The completed MVP provides Google authentication, private workout routines and exercises, completed-workout snapshots, session history, and a dashboard summary. Future improvements include profile editing, additional reporting, usability polish, a final Lighthouse audit, and a published product demo. See [`docs/project-specification.md`](docs/project-specification.md) for the full project plan.
