-- MuscleMAX foundational schema.
-- Apply this file in Supabase Dashboard > SQL Editor before starting the app.

create extension if not exists "pgcrypto";

create table if not exists public.users (
  id text primary key,
  email text not null unique,
  name text,
  image_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint users_id_not_empty check (char_length(trim(id)) > 0)
);

create table if not exists public.workout_routines (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references public.users(id) on delete cascade,
  name text not null,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint workout_routines_name_not_empty check (char_length(trim(name)) > 0)
);

create table if not exists public.routine_exercises (
  id uuid primary key default gen_random_uuid(),
  routine_id uuid not null references public.workout_routines(id) on delete cascade,
  name text not null,
  planned_sets integer not null check (planned_sets > 0),
  planned_reps integer not null check (planned_reps > 0),
  planned_weight numeric(8, 2) check (planned_weight is null or planned_weight >= 0),
  display_order integer not null default 0 check (display_order >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint routine_exercises_name_not_empty check (char_length(trim(name)) > 0)
);

create table if not exists public.workout_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references public.users(id) on delete cascade,
  routine_id uuid references public.workout_routines(id) on delete set null,
  completed_at timestamptz not null default timezone('utc', now()),
  notes text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.completed_sets (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.workout_sessions(id) on delete cascade,
  exercise_name text not null,
  actual_sets integer not null check (actual_sets > 0),
  actual_reps integer not null check (actual_reps > 0),
  actual_weight numeric(8, 2) check (actual_weight is null or actual_weight >= 0),
  display_order integer not null default 0 check (display_order >= 0),
  constraint completed_sets_exercise_name_not_empty check (char_length(trim(exercise_name)) > 0)
);

create index if not exists workout_routines_user_id_updated_at_idx
  on public.workout_routines (user_id, updated_at desc);
create index if not exists routine_exercises_routine_id_display_order_idx
  on public.routine_exercises (routine_id, display_order);
create index if not exists workout_sessions_user_id_completed_at_idx
  on public.workout_sessions (user_id, completed_at desc);
create index if not exists completed_sets_session_id_display_order_idx
  on public.completed_sets (session_id, display_order);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists users_set_updated_at on public.users;
create trigger users_set_updated_at
before update on public.users
for each row execute procedure public.set_updated_at();

drop trigger if exists workout_routines_set_updated_at on public.workout_routines;
create trigger workout_routines_set_updated_at
before update on public.workout_routines
for each row execute procedure public.set_updated_at();

drop trigger if exists routine_exercises_set_updated_at on public.routine_exercises;
create trigger routine_exercises_set_updated_at
before update on public.routine_exercises
for each row execute procedure public.set_updated_at();

-- Google identities are established by Auth.js, not Supabase Auth. Browser access
-- is therefore denied by default; all data access goes through server-side Route
-- Handlers, which verify the Auth.js session and enforce user_id ownership.
alter table public.users enable row level security;
alter table public.workout_routines enable row level security;
alter table public.routine_exercises enable row level security;
alter table public.workout_sessions enable row level security;
alter table public.completed_sets enable row level security;

revoke all on public.users, public.workout_routines, public.routine_exercises,
  public.workout_sessions, public.completed_sets from anon, authenticated;
grant all on public.users, public.workout_routines, public.routine_exercises,
  public.workout_sessions, public.completed_sets to service_role;
