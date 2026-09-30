# MuscleMAX — MVP Project Specification

## Project Title & Description

MuscleMAX is a workout builder and tracker for people who want one simple place to organize routines, record gym sessions, and review recent progress. It addresses the common problem of relying on scattered notes or memory to stay consistent with workouts.

## Purpose & Target Audience

- **Purpose:** Make it quick and clear to plan a workout, record what was completed, and review recent activity.
- **Audience:** Gym-goers and fitness beginners who want a lightweight personal workout planner and log.
- **Value:** A private, organized record of routines and completed workouts instead of disconnected notes.

## MVP Scope

The MVP delivers the course-required full-stack workflow while covering MuscleMAX's essential user value.

1. **Accounts:** Sign up, sign in, sign out, and view a basic profile.
2. **Workout routines:** Create, read, update, and delete a user's routines.
3. **Routine exercises:** Create, read, update, and delete exercises within a routine, including planned sets, repetitions, and optional weight.
4. **Workout sessions:** Record a completed routine and view completed-session history.
5. **Dashboard:** Show recent completed workouts and a simple activity summary, such as total completed sessions.

This provides CRUD for two distinct data models—workout routines and routine exercises—and an end-to-end client → server → database workflow.

### Not part of the MVP

- Social sharing, group workouts, coaching, payments, nutrition tracking, wearables, AI workout generation, advanced charts, and notifications.
- Personal-record calculations and rest timers.

These are Phase 2 ideas only and will not be scheduled until the MVP is stable and deployed.

## User Stories & Acceptance Criteria

### 1. Account access

**Story:** As a user, I want to create an account and sign in so that my workout data is private.

- Given valid registration information, when a new user submits the sign-up form, then an account is created and the user is signed in.
- Given invalid, incomplete, or duplicate registration data, when the form is submitted, then the user receives a clear validation message and no account is created.
- Given an unauthenticated visitor, when they request a protected page or API resource, then they are redirected to sign in or receive an unauthorized response.
- Given a signed-in user, when they sign out, then their private pages are no longer available without signing in again.

### 2. Workout routine CRUD

**Story:** As a user, I want to create and manage workout routines so that I can organize my planned workouts.

- Given a signed-in user, when they submit a valid routine name, then the routine is saved and appears in their routine list.
- Given an existing routine, when the user edits its name or notes, then the saved changes appear in the list and detail view.
- Given an existing routine, when the user confirms deletion, then it is removed from their routine list.
- Given a routine owned by another user, when a user attempts to read or modify it, then access is denied.

### 3. Routine exercise CRUD

**Story:** As a user, I want to manage exercises within a routine so that each workout has clear instructions.

- Given an open routine, when the user adds an exercise with a name, sets, repetitions, and optional weight, then it is saved in that routine.
- Given a saved exercise, when the user edits or removes it, then the routine displays the current exercise list.
- Given invalid numeric values, such as zero or negative sets or repetitions, when the form is submitted, then the system prevents saving and explains the problem.

### 4. Session tracking and history

**Story:** As a user, I want to record completed workouts and review them later so that I can see my consistency.

- Given a routine, when the user records a completed workout, then a session with its completion date and exercise details is saved.
- Given a completed session, when the user changes the actual sets, repetitions, or weight, then the session retains those actual values without changing the planned routine.
- Given a signed-in user, when they open history, then they see only their own sessions ordered newest first.
- Given no completed sessions, when history or the dashboard loads, then a helpful empty state is displayed.

### 5. Dashboard and responsive experience

**Story:** As a user, I want a responsive dashboard so that I can quickly see recent activity on desktop or mobile.

- Given a signed-in user, when the dashboard loads, then it shows recent completed workouts and a basic total-session summary.
- Given a mobile or desktop viewport, when the user navigates the app, then forms and navigation remain usable without horizontal scrolling.
- Given a form submission or data request, when it is loading, succeeds, or fails, then the user receives appropriate feedback.

## Required Technical Decisions

| Area            | MVP decision                              |
| --------------- | ----------------------------------------- |
| Framework       | Next.js using the App Router              |
| Language        | TypeScript with `strict` mode; no `any`   |
| Styling         | Tailwind CSS utility classes              |
| Database        | Supabase PostgreSQL                       |
| Authentication  | Auth.js v5 (NextAuth.js)                  |
| Hosting         | Vercel                                    |
| Version control | GitHub feature branches and pull requests |

## Data Models

**Database solution:** Supabase PostgreSQL. It supplies a managed relational database that fits the ownership and one-to-many relationships below, and works with the selected authentication and deployment stack.

| Entity              | Key fields                                                                                                                                 |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **User**            | `id` (Auth.js user ID), `email` (unique), `name`, `imageUrl` (nullable), `createdAt`, `updatedAt`                                          |
| **WorkoutRoutine**  | `id`, `userId` (FK), `name`, `notes` (nullable), `createdAt`, `updatedAt`                                                                  |
| **RoutineExercise** | `id`, `routineId` (FK), `name`, `plannedSets`, `plannedReps`, `plannedWeight` (nullable decimal), `displayOrder`, `createdAt`, `updatedAt` |
| **WorkoutSession**  | `id`, `userId` (FK), `routineId` (nullable FK), `completedAt`, `notes` (nullable), `createdAt`                                             |
| **CompletedSet**    | `id`, `sessionId` (FK), `exerciseName`, `actualSets`, `actualReps`, `actualWeight` (nullable decimal), `displayOrder`                      |

```text
User
 ├── 1 : many ── WorkoutRoutine
 │                  └── 1 : many ── RoutineExercise
 └── 1 : many ── WorkoutSession
                     └── 1 : many ── CompletedSet

WorkoutRoutine ── 1 : many (optional historical reference) ── WorkoutSession
```

`WorkoutSession.routineId` is nullable so a completed session can remain valid if its source routine is later deleted. `CompletedSet` stores its own exercise name and actual values as a snapshot; editing a routine must never alter historical workout data.

All routine and session requests must confirm that the signed-in user owns the requested data. Editing or deleting a routine must not change an already saved session.

## Pages, Components & Design System

### Required views

1. Sign-in / sign-up view.
2. Dashboard view.
3. Workout-routine list and editor/detail view.
4. Workout-history view.
5. Profile view.

### MVP routes

| Route            | Purpose                                                                     | Access        |
| ---------------- | --------------------------------------------------------------------------- | ------------- |
| `/`              | Public landing page; directs signed-in users to the dashboard.              | Public        |
| `/login`         | Sign-in form.                                                               | Public        |
| `/signup`        | Account-registration form.                                                  | Public        |
| `/dashboard`     | Recent sessions and total-session summary.                                  | Signed in     |
| `/workouts`      | List, create, and manage workout routines.                                  | Signed in     |
| `/workouts/[id]` | Routine detail and editor, including routine exercises and session logging. | Routine owner |
| `/history`       | Completed workout-session history, newest first.                            | Signed in     |
| `/profile`       | Basic account profile and sign-out action.                                  | Signed in     |

### Component architecture

The app uses a shared authenticated layout for all private views. Server Components fetch page data and enforce access by default; interactive forms and controls are Client Components only where needed.

```text
App
├── PublicLayout
│   ├── AppHeader
│   └── LandingPage / AuthPage
│       ├── PageTitle
│       ├── FormField
│       └── PrimaryButton
└── AuthenticatedLayout
    ├── AppHeader
    │   └── NavigationLinks / UserMenu
    ├── MainContent
    │   ├── DashboardPage
    │   │   ├── PageTitle
    │   │   ├── ActivitySummaryCard
    │   │   ├── RecentSessionsList
    │   │   └── EmptyState
    │   ├── WorkoutsPage
    │   │   ├── PageTitle
    │   │   ├── WorkoutForm
    │   │   └── WorkoutCard[]
    │   ├── WorkoutDetailPage
    │   │   ├── RoutineEditor
    │   │   ├── ExerciseForm
    │   │   ├── ExerciseList
    │   │   ├── SessionLogger
    │   │   └── ConfirmDialog
    │   ├── HistoryPage
    │   │   ├── SessionCard[]
    │   │   └── EmptyState
    │   └── ProfilePage
    │       ├── ProfileForm
    │       └── SignOutButton
    └── AppFooter
```

**Essential reusable components:** `AppHeader`, `AppFooter`, `PageTitle`, `PrimaryButton`, `FormField`, `EmptyState`, `WorkoutCard`, `ExerciseForm`, `ActivitySummaryCard`, `SessionCard`, and `ConfirmDialog`.

### Week 04 implementation priority

**P0:** `AppHeader`, auth pages and protected layout, the workout list and routine-detail editor, `WorkoutCard`, `WorkoutForm`, `ExerciseForm`, `EmptyState`, and the database/API foundation that supports them. These establish private access and the two required CRUD workflows.

**P1:** dashboard summary, session logger/history, profile editing, footer, and visual polish. They remain MVP requirements but follow the foundational workflow when scheduling Week 04 work.

### Reusable components

Use at least five shared components across pages: `AppHeader`, `PageTitle`, `PrimaryButton`, `FormField`, `EmptyState`, `WorkoutCard`, and `ExerciseForm`.

### Brand and visual rules

- **Palette:** dark charcoal/slate backgrounds, white and light-gray text, and a single green accent for primary actions and positive progress.
- **Type scale:** a clear page title, section heading, body, and small supporting-text scale using the project font tokens.
- **Component style:** consistent rounded cards, form controls, spacing, and button states.
- **Accessibility:** visible labels, keyboard-operable controls, sufficient color contrast, and readable validation/error messages.

### Design tokens and layout conventions

| Token                   | Decision                                                                                                                                            |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Primary background      | `#0F172A` (slate 950)                                                                                                                               |
| Surface / card          | `#1E293B` (slate 800)                                                                                                                               |
| Primary text            | `#F8FAFC` (slate 50)                                                                                                                                |
| Secondary text          | `#CBD5E1` (slate 300)                                                                                                                               |
| Accent / primary action | `#22C55E` (green 500)                                                                                                                               |
| Accent hover            | `#16A34A` (green 600)                                                                                                                               |
| Error                   | `#F87171` (red 400)                                                                                                                                 |
| Typography              | Geist Sans for interface text, using Next.js font optimization; a system sans-serif fallback.                                                       |
| Spacing                 | Tailwind's 4px base scale. Use `gap-4` for compact groups, `gap-6` within cards, and `py-8`/`py-12` between page sections.                          |
| Layout                  | Mobile-first single column; centered `max-w-6xl` page container; cards use `rounded-xl`, `border-slate-700`, and consistent `p-4` or `p-6` padding. |
| UI library              | Tailwind CSS utilities and small project-owned components; do not introduce a second component library for the MVP.                                 |

## Next.js, API & Code Standards

- Use Server Components by default. Add `"use client"` only for event handlers, form state, or browser-only behavior.
- Keep database access and authorization on the server. Route handlers belong in `app/api/**/route.ts`.
- Use explicit TypeScript types for props, state, API payloads, and database results. Safely narrow `unknown` values rather than using `any`.
- Use Tailwind first; add custom global CSS only when utilities are not appropriate.
- Return meaningful HTTP status codes and structured validation/error responses.
- Use `PascalCase` for components/types, `camelCase` for functions and variables, and kebab-case for route segments and non-component filenames.

## Core API Endpoints

| Method                   | Endpoint                                  | Purpose                                                   |
| ------------------------ | ----------------------------------------- | --------------------------------------------------------- |
| `GET`, `POST`            | `/api/workouts`                           | List the current user's routines or create one.           |
| `GET`, `PATCH`, `DELETE` | `/api/workouts/:id`                       | Read, update, or delete one owned routine.                |
| `POST`                   | `/api/workouts/:id/exercises`             | Add an exercise to a routine.                             |
| `PATCH`, `DELETE`        | `/api/workouts/:id/exercises/:exerciseId` | Update or remove a routine exercise.                      |
| `POST`                   | `/api/workouts/:id/sessions`              | Save a completed session from a routine.                  |
| `GET`                    | `/api/sessions`                           | List the current user's completed workouts.               |
| `GET`                    | `/api/dashboard`                          | Return recent workouts and total completed-session count. |

Auth.js route handlers provide sign-in and sign-out capabilities; no custom password-handling endpoint will be created unless required by the selected provider.

## Implementation Priority

- **P0 — MVP:** Auth.js setup; database connection; the five required views; workout-routine CRUD; routine-exercise CRUD; session logging/history; dashboard summary; responsive UI; deployment to Vercel.
- **P1 — Only after P0 is working:** Minor usability polish and bug fixes identified during testing.
- **Phase 2:** All features listed as out of scope above.

## Quality, Documentation & Team Workflow

- Run `npm run lint` and `npm run format:check` before each pull request.
- Test the key paths manually: auth, routine CRUD, exercise CRUD, session logging, unauthorized access, empty states, and mobile layout.
- The README must document the project, Dylan Cleghorn as the current team member, local setup, deployment, API endpoints, and known limitations or future improvements.
- Use GitHub Projects/Boards to track 4–8 hour issues. Use feature branches, focused pull requests, and code review before merging to `main`.
- Hold a weekly project check-in; if new team members join, rotate the meeting lead.

## GitHub Project Board Plan

Use a milestone for each remaining delivery week. Dylan Cleghorn is the current sole team member, so each issue is initially assigned to Dylan; redistribute these by frontend, backend, or QA interest when teammates join.

| Milestone   | Goal                                                                                                            |
| ----------- | --------------------------------------------------------------------------------------------------------------- |
| **Week 04** | Establish the secure foundation: database connection, authentication, protected shell, and workout-routine API. |
| **Week 05** | Complete routine and exercise CRUD through the routine-list, detail, and exercise-editor interfaces.            |
| **Week 06** | Deliver session history, dashboard, testing, deployment readiness, and final fixes before project submission.   |
| **Week 07** | Post-submission reflection and optional improvements only; no required MVP work is scheduled.                   |

| Issue                                                  | Scope                                                                                                         | Owner          | Milestone |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- | -------------- | --------- |
| Set up Auth.js and protected-route access              | Configure sign-in, sign-up, sign-out, session handling, and redirects for private views.                      | Dylan Cleghorn | Week 04   |
| Create Supabase schema and ownership policies          | Create the five tables, foreign keys, indexes, and row-level ownership rules.                                 | Dylan Cleghorn | Week 04   |
| Build workout-routine API routes                       | Implement validated, authorized `GET`/`POST` and `GET`/`PATCH`/`DELETE` routine endpoints.                    | Dylan Cleghorn | Week 04   |
| Build authenticated app shell and shared UI            | Implement protected layout, navigation, heading, form, button, card, dialog, and empty-state components.      | Dylan Cleghorn | Week 04   |
| Build routine-exercise API routes                      | Implement validated, authorized exercise create, update, and delete endpoints.                                | Dylan Cleghorn | Week 05   |
| Build workout list and create/edit routine flow        | Implement `/workouts`, `WorkoutCard`, routine form, loading, error, and empty states.                         | Dylan Cleghorn | Week 05   |
| Build routine-detail exercise editor                   | Implement `/workouts/[id]`, exercise list, exercise form, ordering, and deletion confirmation.                | Dylan Cleghorn | Week 05   |
| Apply MuscleMAX responsive design system               | Add the documented color tokens, typography, responsive container, card, and form patterns.                   | Dylan Cleghorn | Week 05   |
| Build workout-session logging API and snapshot storage | Create session and completed-set writes that preserve actual completed values.                                | Dylan Cleghorn | Week 06   |
| Build dashboard and session-history views              | Implement `/dashboard` and `/history`, including recent sessions, total count, and testing/release readiness. | Dylan Cleghorn | Week 06   |

## Definition of Done

The MVP is done when the P0 workflows work in a deployed app, the database-backed API route is consumed by a client component, the app is responsive, TypeScript/lint/format checks pass, the README is complete, and the work has been reviewed through the team's pull-request process.
