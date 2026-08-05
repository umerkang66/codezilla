-- ====================================================================
-- CODZILLA TECHNOLOGIES — SUPABASE POSTGRES SCHEMA & RLS POLICIES
-- Execute this SQL in your Supabase Dashboard SQL Editor
-- ====================================================================

-- 1. Create Profiles Table for Role-Based Access Control (RBAC)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  role text not null default 'user',
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ensure full_name and avatar_url columns exist if table was previously created without them
alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists avatar_url text;

-- Enable RLS
alter table public.profiles enable row level security;

-- Helper function to check if current user is admin without triggering RLS recursion
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- 2. Row Level Security Policies
-- Policy A: Users can view their own profile
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles
  for select
  to authenticated
  using ( (select auth.uid()) = id );

-- Policy B: Admins can view all profiles for user management
drop policy if exists "Admins can view all profiles" on public.profiles;
create policy "Admins can view all profiles"
  on public.profiles
  for select
  to authenticated
  using ( public.is_admin() );

-- Policy C: Users can insert their own profile
drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles
  for insert
  to authenticated
  with check ( (select auth.uid()) = id );

-- Policy D: Users can update their own profile
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles
  for update
  to authenticated
  using ( (select auth.uid()) = id )
  with check ( (select auth.uid()) = id );

-- Policy E: Admins can update all profiles
drop policy if exists "Admins can update profiles" on public.profiles;
create policy "Admins can update profiles"
  on public.profiles
  for update
  to authenticated
  using ( public.is_admin() );

-- 3. Trigger Function for Automatic Profile Creation on New User Registration
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public, pg_temp
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', new.raw_user_meta_data->>'avatar', ''),
    'user'
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(nullif(excluded.full_name, ''), public.profiles.full_name),
    avatar_url = coalesce(nullif(excluded.avatar_url, ''), public.profiles.avatar_url);
  return new;
exception
  when others then
    return new;
end;
$$;

-- 4. Attach Trigger to auth.users
drop trigger if exists on_auth_user_created on auth.users;
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 5. Create Blogs Table for Dynamic Content Management
create table if not exists public.blogs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'Engineering',
  excerpt text not null default '',
  content text not null default '',
  author text not null default 'Codzilla Team',
  author_role text not null default 'Engineering Team',
  read_time text not null default '5 min read',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on blogs table
alter table public.blogs enable row level security;

-- Policy 1: Anyone (anon and authenticated) can view blogs
drop policy if exists "Blogs are viewable by everyone" on public.blogs;
create policy "Blogs are viewable by everyone"
  on public.blogs
  for select
  using ( true );

-- Policy 2: Authenticated admins can insert blogs
drop policy if exists "Admins can insert blogs" on public.blogs;
create policy "Admins can insert blogs"
  on public.blogs
  for insert
  to authenticated
  with check ( public.is_admin() );

-- Policy 3: Authenticated admins can update blogs
drop policy if exists "Admins can update blogs" on public.blogs;
create policy "Admins can update blogs"
  on public.blogs
  for update
  to authenticated
  using ( public.is_admin() )
  with check ( public.is_admin() );

-- Policy 4: Authenticated admins can delete blogs
drop policy if exists "Admins can delete blogs" on public.blogs;
create policy "Admins can delete blogs"
  on public.blogs
  for delete
  to authenticated
  using ( public.is_admin() );

-- 6. Create Contact Messages Table
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  service text not null default 'AI & Automation',
  message text not null,
  is_read boolean not null default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  read_at timestamp with time zone
);

-- Create performance indexes for querying contact messages
create index if not exists contact_messages_created_at_idx on public.contact_messages (created_at desc);
create index if not exists contact_messages_unread_idx on public.contact_messages (is_read) where is_read = false;

-- Enable RLS on contact_messages table
alter table public.contact_messages enable row level security;

-- Policy 1: Anyone (anon and authenticated) can insert contact messages
drop policy if exists "Anyone can insert contact messages" on public.contact_messages;
create policy "Anyone can insert contact messages"
  on public.contact_messages
  for insert
  with check ( true );

-- Policy 2: Authenticated admins can view contact messages
drop policy if exists "Admins can view contact messages" on public.contact_messages;
create policy "Admins can view contact messages"
  on public.contact_messages
  for select
  to authenticated
  using ( public.is_admin() );

-- Policy 3: Authenticated admins can update contact messages
drop policy if exists "Admins can update contact messages" on public.contact_messages;
create policy "Admins can update contact messages"
  on public.contact_messages
  for update
  to authenticated
  using ( public.is_admin() )
  with check ( public.is_admin() );

-- Policy 4: Authenticated admins can delete contact messages
drop policy if exists "Admins can delete contact messages" on public.contact_messages;
create policy "Admins can delete contact messages"
  on public.contact_messages
  for delete
  to authenticated
  using ( public.is_admin() );

-- 7. Create Job Postings Table for Talent Acquisition
create table if not exists public.job_postings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  domain text not null default 'Engineering',
  type text not null default 'Remote / Project-Based',
  description text not null,
  skills text[] default '{}'::text[],
  requirements text default '',
  status text not null default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on job_postings
alter table public.job_postings enable row level security;

-- Policy 1: Anyone can view job postings
drop policy if exists "Job postings are viewable by everyone" on public.job_postings;
create policy "Job postings are viewable by everyone"
  on public.job_postings
  for select
  using ( true );

-- Policy 2: Admins can insert job postings
drop policy if exists "Admins can insert job postings" on public.job_postings;
create policy "Admins can insert job postings"
  on public.job_postings
  for insert
  to authenticated
  with check ( public.is_admin() );

-- Policy 3: Admins can update job postings
drop policy if exists "Admins can update job postings" on public.job_postings;
create policy "Admins can update job postings"
  on public.job_postings
  for update
  to authenticated
  using ( public.is_admin() )
  with check ( public.is_admin() );

-- Policy 4: Admins can delete job postings
drop policy if exists "Admins can delete job postings" on public.job_postings;
create policy "Admins can delete job postings"
  on public.job_postings
  for delete
  to authenticated
  using ( public.is_admin() );

-- 8. Create Job Applications Table
create table if not exists public.job_applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references public.job_postings(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text default '',
  portfolio_url text default '',
  linkedin_url text default '',
  cover_letter text default '',
  resume_url text not null,
  resume_file_name text not null,
  resume_file_type text not null,
  status text not null default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Performance Indexes
create index if not exists job_applications_job_id_idx on public.job_applications (job_id);
create index if not exists job_applications_created_at_idx on public.job_applications (created_at desc);

-- Enable RLS on job_applications
alter table public.job_applications enable row level security;

-- Policy 1: Anyone can insert job applications
drop policy if exists "Anyone can insert job applications" on public.job_applications;
create policy "Anyone can insert job applications"
  on public.job_applications
  for insert
  with check ( true );

-- Policy 2: Admins can view job applications
drop policy if exists "Admins can view job applications" on public.job_applications;
create policy "Admins can view job applications"
  on public.job_applications
  for select
  to authenticated
  using ( public.is_admin() );

-- Policy 3: Admins can update job applications
drop policy if exists "Admins can update job applications" on public.job_applications;
create policy "Admins can update job applications"
  on public.job_applications
  for update
  to authenticated
  using ( public.is_admin() )
  with check ( public.is_admin() );

-- Policy 4: Admins can delete job applications
drop policy if exists "Admins can delete job applications" on public.job_applications;
create policy "Admins can delete job applications"
  on public.job_applications
  for delete
  to authenticated
  using ( public.is_admin() );

-- Seed default initial jobs if not existing
insert into public.job_postings (title, domain, type, description, skills, status)
select
  'AI & Computer Vision Researcher',
  'AI / ML Engineering',
  'Remote / Project-Based',
  'Train, fine-tune, and deploy computer vision models, object detection pipelines, and high-performance inference APIs.',
  ARRAY['PyTorch', 'OpenCV', 'YOLO', 'FastAPI'],
  'active'
where not exists (select 1 from public.job_postings where title = 'AI & Computer Vision Researcher');

insert into public.job_postings (title, domain, type, description, skills, status)
select
  'Full-Stack Next.js Developer',
  'Web Development',
  'Remote / Project-Based',
  'Architect dynamic, responsive web applications using Next.js, TypeScript, Tailwind CSS, and REST/GraphQL APIs.',
  ARRAY['Next.js', 'TypeScript', 'Tailwind CSS', 'REST APIs'],
  'active'
where not exists (select 1 from public.job_postings where title = 'Full-Stack Next.js Developer');



