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

- **User:** authentication identity and basic profile data.
- **WorkoutRoutine:** owner, name, optional notes, and timestamps.
- **RoutineExercise:** routine reference, exercise name, planned sets, repetitions, optional weight, and display order.
- **WorkoutSession:** owner, optional routine reference, completion date, and optional notes.
- **CompletedSet:** session reference, exercise name, sets, repetitions, and optional weight recorded at completion.

All routine and session requests must confirm that the signed-in user owns the requested data. Editing or deleting a routine must not change an already saved session.

## Pages, Components & Design System

### Required views

1. Sign-in / sign-up view.
2. Dashboard view.
3. Workout-routine list and editor/detail view.
4. Workout-history view.
5. Profile view.

### Reusable components

Use at least five shared components across pages: `AppHeader`, `PageTitle`, `PrimaryButton`, `FormField`, `EmptyState`, `WorkoutCard`, and `ExerciseForm`.

### Brand and visual rules

- **Palette:** dark charcoal/slate backgrounds, white and light-gray text, and a single green accent for primary actions and positive progress.
- **Type scale:** a clear page title, section heading, body, and small supporting-text scale using the project font tokens.
- **Component style:** consistent rounded cards, form controls, spacing, and button states.
- **Accessibility:** visible labels, keyboard-operable controls, sufficient color contrast, and readable validation/error messages.

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

## Definition of Done

The MVP is done when the P0 workflows work in a deployed app, the database-backed API route is consumed by a client component, the app is responsive, TypeScript/lint/format checks pass, the README is complete, and the work has been reviewed through the team's pull-request process.
