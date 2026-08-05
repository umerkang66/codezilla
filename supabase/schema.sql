-- ====================================================================
-- CODZILLA TECHNOLOGIES — SUPABASE POSTGRES SCHEMA & RLS POLICIES
-- Execute this SQL in your Supabase Dashboard SQL Editor
-- ====================================================================

-- 1. Create Profiles Table for Role-Based Access Control (RBAC)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text not null default 'user',
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row-Level Security (RLS)
alter table public.profiles enable row level security;

-- 3. Row Level Security Policies
-- Policy A: Users can select their own profile
create policy "Users can view own profile"
  on public.profiles
  for select
  to authenticated
  using ( (select auth.uid()) = id );

-- Policy B: Admins can view all profiles
create policy "Admins can view all profiles"
  on public.profiles
  for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = (select auth.uid()) and role = 'admin'
    )
  );

-- Policy C: Users can update their own non-role profile attributes
create policy "Users can update own profile"
  on public.profiles
  for update
  to authenticated
  using ( (select auth.uid()) = id )
  with check ( (select auth.uid()) = id );

-- 4. Trigger Function for Automatic Profile Creation on New User Registration
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'user')
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

-- 5. Attach Trigger to auth.users
drop trigger if exists on_auth_user_created on auth.users;
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
