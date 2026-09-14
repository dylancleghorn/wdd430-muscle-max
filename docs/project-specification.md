# MuscleMAX — Workout Builder & Tracker

## Project Title & Description

MuscleMAX is a web application that helps people build personalized workout routines, record completed exercise sessions, and review their progress over time. It replaces scattered notes and memory-based tracking with a simple, organized record of what a user plans and completes at the gym.

The initial release focuses on essential personal workout workflows: account access, workout-routine management, exercise details, session logging, workout history, and a progress dashboard.

## Purpose & Target Audience

- **Purpose:** Help users stay consistent by making workout planning and completion tracking quick, clear, and easy to revisit.
- **Primary audience:** Gym-goers and fitness beginners who want a straightforward personal workout planner and log.
- **Secondary audience:** Experienced lifters who want a lightweight way to track sets, repetitions, and weight without a complex training platform.

## Product Scope

### In scope

- User registration, sign-in, sign-out, and profile management.
- Creating, viewing, editing, and deleting personal workout routines.
- Adding, editing, reordering, and removing exercises within a routine.
- Recording sets, repetitions, and weight for exercises.
- Logging completed workout sessions from a routine.
- Viewing workout history and recent activity.
- Displaying basic progress information, such as recent sessions, total sessions, and recent volume.

### Out of scope for the initial release

- Social feeds, public workout sharing, and direct messaging.
- Meal planning, nutrition tracking, and wearable-device integrations.
- Payments, subscriptions, and coaching marketplaces.
- Advanced analytics or AI-generated training plans.

## User Stories

1. **Create an account:** As a new user, I want to create an account so that my workouts and history are private and available when I return.
2. **Sign in and manage my profile:** As a returning user, I want to sign in and update my profile so that I can access and manage my personal data.
3. **Create a workout routine:** As a user, I want to create a named workout routine so that I can organize a planned workout.
4. **Manage routines:** As a user, I want to view, edit, and delete my routines so that my workout plan stays current.
5. **Manage exercises:** As a user, I want to add exercises with sets, repetitions, and weight to a routine so that each workout has actionable details.
6. **Log a completed workout:** As a user, I want to record a completed session so that I retain an accurate history of what I performed.
7. **Review history:** As a user, I want to review completed sessions so that I can see my workout consistency and past performance.
8. **View progress:** As a user, I want a dashboard with recent workout activity and basic progress information so that I can quickly understand my recent effort.

## Acceptance Criteria

### Story 1: Create an account

- Given a new visitor, when they submit a valid name, email address, and password, then an account is created and they are signed in.
- Given an invalid email address, duplicate email address, or missing required field, when registration is submitted, then the system shows a clear validation message and does not create an account.
- Given a password, when it is stored, then it is never stored or returned as plain text.

### Story 2: Sign in and manage my profile

- Given a registered user, when they submit valid credentials, then they are signed in and sent to their dashboard.
- Given invalid credentials, when sign-in is attempted, then the system shows an error without revealing whether the email address is registered.
- Given a signed-in user, when they update permitted profile fields with valid values, then the changes are saved and displayed on their next visit.
- Given an unauthenticated visitor, when they request a private page or API resource, then they are redirected to sign in or receive an unauthorized response.

### Story 3: Create a workout routine

- Given a signed-in user, when they submit a valid routine name, then a new routine is saved to their account.
- Given a routine name that is empty or exceeds the allowed length, when the form is submitted, then the routine is not saved and the field is identified.
- Given a newly created routine, when the user opens it, then they can begin adding exercises.

### Story 4: Manage routines

- Given a signed-in user, when they open the routines page, then they see only their own routines.
- Given an existing routine, when the user edits its name or notes and saves, then the updated values appear in the routine list and detail page.
- Given an existing routine, when the user confirms deletion, then it is removed from their routine list and cannot be selected for a new session.
- Given a routine owned by another user, when a user attempts to access or modify it, then the system denies the request.

### Story 5: Manage exercises

- Given a routine, when the user adds an exercise with a name, planned sets, repetitions, and optional weight, then the exercise appears in that routine.
- Given an exercise in a routine, when the user edits its details or changes its order, then the saved routine reflects those changes.
- Given an exercise, when required numeric values are zero, negative, or invalid, then the system prevents saving and explains the correction needed.
- Given an exercise in a routine, when the user removes it, then it no longer appears in future workout plans while historical session records remain unchanged.

### Story 6: Log a completed workout

- Given a user starts a session from one of their routines, when they record completed sets, repetitions, and weight and save the session, then a completed workout entry is created with its completion date.
- Given a session entry, when the user records values that differ from the plan, then the actual completed values are retained for that session without changing the underlying routine.
- Given a session has no completed exercises, when the user attempts to save it as completed, then the system asks them to add a completed exercise or discard the session.

### Story 7: Review history

- Given a signed-in user with completed sessions, when they open workout history, then they see their sessions ordered from newest to oldest.
- Given a history entry, when the user opens it, then they can view the exercises and completed set details recorded for that session.
- Given a user has no completed sessions, when they open history, then they see a helpful empty-state message and a path to create or start a workout.

### Story 8: View progress

- Given a signed-in user, when they open the dashboard, then they see recent completed workouts and a summary of basic activity.
- Given completed session data, when the dashboard calculates total workout volume, then it uses completed sets multiplied by repetitions and weight when a weight is recorded.
- Given no completed sessions, when the dashboard loads, then it shows an empty state rather than misleading progress values.

## Data Requirements

The data model must associate all private workout data with its owning user. The initial domain includes:

- **User:** account identity and profile information.
- **WorkoutRoutine:** name, optional notes, owner, and timestamps.
- **RoutineExercise:** exercise name, planned set count, planned repetitions, optional planned weight, and display order.
- **WorkoutSession:** routine reference when applicable, completion date, optional notes, and owner.
- **CompletedExercise / CompletedSet:** the exercise details and actual sets, repetitions, and weight captured at the time of a completed session.

Deleting or modifying a routine must not alter previously saved workout-session records.

## Technical Standards

### Required stack

- **Framework:** Next.js using the App Router.
- **Language:** TypeScript with `strict` mode enabled.
- **Styling:** Tailwind CSS.

### TypeScript and Next.js

- Do not use `any`. Model API payloads, component props, and domain data with explicit types or safe `unknown` narrowing.
- Use Server Components by default. Add `"use client"` only to components that require browser state, event handlers, or client-only APIs.
- Use file-based routing under `app/`, with route handlers placed in `app/api/**/route.ts`.
- Keep data access and authorization on the server. Every private query or mutation must verify the signed-in user owns the requested resource.
- Return meaningful HTTP status codes and structured error responses from API routes.

### Tailwind and UI

- Prefer Tailwind utility classes for styling.
- Avoid custom global CSS unless a utility-based approach is not appropriate; keep any necessary global rules in `app/globals.css`.
- Build accessible forms with visible labels, keyboard-operable controls, useful validation messages, and clear empty states.
- Use responsive layouts that remain usable on mobile screens.

### Testing and Quality

- Run `npm run lint` and `npm run format:check` before opening a pull request.
- Add tests for validation, authorization, CRUD behavior, and progress calculations as those features are implemented.
- Test critical user flows manually: registration/sign-in, routine CRUD, exercise editing, session logging, history, and dashboard empty states.

### Naming and Collaboration

- Use `PascalCase` for React components and TypeScript types, `camelCase` for variables and functions, and kebab-case for route segments and non-component filenames.
- Name feature branches by task, for example `feature/workout-builder` or `feature/auth`.
- Do not push directly to `main`. Open a pull request from a feature branch and obtain one approval from another team member before merging.
- Keep pull requests focused, describe user-facing behavior, and note the checks performed.

## Core API Endpoints

| Method                   | Endpoint                                  | Purpose                                            |
| ------------------------ | ----------------------------------------- | -------------------------------------------------- |
| `POST`                   | `/api/auth/register`                      | Create a user account.                             |
| `POST`                   | `/api/auth/login`                         | Sign in and start an authenticated session.        |
| `POST`                   | `/api/auth/logout`                        | End the current authenticated session.             |
| `GET`, `PATCH`           | `/api/profile`                            | Read or update the signed-in user's profile.       |
| `GET`, `POST`            | `/api/workouts`                           | List the user's routines or create a routine.      |
| `GET`, `PATCH`, `DELETE` | `/api/workouts/:id`                       | Read, update, or delete one owned routine.         |
| `POST`                   | `/api/workouts/:id/exercises`             | Add an exercise to a routine.                      |
| `PATCH`, `DELETE`        | `/api/workouts/:id/exercises/:exerciseId` | Update, reorder, or remove a routine exercise.     |
| `POST`                   | `/api/workouts/:id/sessions`              | Create a completed session from a routine.         |
| `GET`                    | `/api/sessions`                           | List the signed-in user's workout history.         |
| `GET`                    | `/api/sessions/:id`                       | Read one owned completed workout session.          |
| `GET`                    | `/api/dashboard`                          | Return recent workouts and basic progress metrics. |

API implementation may consolidate authentication endpoints when the selected authentication library provides its own route handlers, but the user-facing capabilities and authorization requirements remain the same.

## Implementation Priority

- **P0 — Core release:** Account registration and sign-in; protected dashboard shell; create, read, update, and delete workout routines; add and manage exercises; log completed sessions; view workout history.
- **P1 — Stronger daily use:** Profile editing; dashboard activity and volume summaries; routine exercise reordering; session notes; polished validation and empty states.
- **P2 — Future enhancements:** Personal records, advanced charts, workout templates, rest timers, workout sharing, notifications, wearable integrations, and nutrition features.

## Definition of Done

A feature is complete when its acceptance criteria pass, authorization protects user-owned data, TypeScript and lint checks pass, formatting passes, the relevant tests or manual checks are documented in the pull request, and the pull request receives the required review before merging to `main`.
