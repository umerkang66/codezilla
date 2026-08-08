-- ====================================================================
-- CODZILLA TECHNOLOGIES — DATABASE SEED SCRIPT (SQL)
-- Inserts 2 realistic sample/fake records for each database table.
-- Can be executed directly in the Supabase Dashboard SQL Editor.
-- ====================================================================

-- 1. Seed Blogs (2 records)
INSERT INTO public.blogs (id, title, category, excerpt, content, author, author_role, read_time)
VALUES
(
  'a1111111-1111-4111-8111-111111111111',
  'Architecting Next-Gen AI Applications with Next.js 16 & Supabase',
  'Engineering',
  'Discover how modern full-stack architectures leverage vector embeddings, server components, and realtime edge functions to power intelligent web apps.',
  '## Introduction\n\nArtificial Intelligence is transforming modern web development. By integrating vector storage directly into Postgres via `pgvector` alongside Supabase Edge Functions, developers can build responsive, intelligent applications in record time.\n\n### Key Concepts Covered:\n- **Server-Side Rendering**: Streamlining initial page render times.\n- **Vector Embeddings**: Indexing data efficiently for semantic search.\n- **Real-time Synchronization**: Pushing live updates to users.\n\n## Conclusion\n\nAdopting these paradigms yields responsive, scalable AI solutions.',
  'Alex Rivera',
  'Principal AI Architect',
  '6 min read'
),
(
  'a2222222-2222-4222-8222-222222222222',
  'Scaling Modern Web Applications: Performance Patterns & Best Practices',
  'Performance',
  'An in-depth look into micro-frontend architectures, automated CI/CD pipelines, and caching strategies for high-traffic enterprise platforms.',
  '## Performance First\n\nSpeed is a feature. In this article, we analyze high-concurrency database connection pooling, image optimization strategies, and serverless compute scaling.\n\n### Core Strategies:\n1. Edge-side page caching\n2. Optimistic UI updates\n3. Lazy loaded interactive widgets\n\n## Summary\n\nEngineered performance foundation leads to higher conversion rates and lower cloud infrastructure costs.',
  'Sophia Chen',
  'Lead Systems Engineer',
  '4 min read'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  author = EXCLUDED.author,
  author_role = EXCLUDED.author_role,
  read_time = EXCLUDED.read_time;


-- 2. Seed Contact Messages (2 records)
INSERT INTO public.contact_messages (id, name, email, service, message, is_read)
VALUES
(
  'b1111111-1111-4111-8111-111111111111',
  'Marcus Vance',
  'marcus.vance@nexuscorp.io',
  'AI & Automation',
  'Hello Codzilla Team! We are looking to build a custom LLM-powered knowledge base for our customer success team. Would love to schedule a discovery call.',
  false
),
(
  'b2222222-2222-4222-8222-222222222222',
  'Elena Rostova',
  'elena@fintechplus.com',
  'Full Stack Development',
  'We require a high-throughput dashboard redesign using Next.js and Supabase. Please let us know your team availability for Q3.',
  true
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  service = EXCLUDED.service,
  message = EXCLUDED.message,
  is_read = EXCLUDED.is_read;


-- 3. Seed Job Postings (2 records)
INSERT INTO public.job_postings (id, title, domain, type, description, skills, requirements, status)
VALUES
(
  'c1111111-1111-4111-8111-111111111111',
  'Senior Full-Stack AI Engineer',
  'Engineering',
  'Remote / Full-Time',
  'We are seeking an experienced Full-Stack AI Engineer to design and implement generative AI features, web applications, and autonomous agent workflows.',
  ARRAY['TypeScript', 'Next.js', 'Supabase', 'Python', 'OpenAI API', 'TailwindCSS'],
  '5+ years experience in software development. Strong background with React/Next.js and backend database architecture.',
  'active'
),
(
  'c2222222-2222-4222-8222-222222222222',
  'Lead UI/UX & Frontend Developer',
  'Design & Engineering',
  'Remote / Contract',
  'Looking for a creative UI/UX specialist who translates complex SaaS workflows into sleek, hyper-performing glassmorphic web interfaces.',
  ARRAY['Figma', 'React', 'Framer Motion', 'CSS3', 'Accessibility'],
  '3+ years experience designing & building modern SaaS dashboards with high aesthetic standards.',
  'active'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  domain = EXCLUDED.domain,
  type = EXCLUDED.type,
  description = EXCLUDED.description,
  skills = EXCLUDED.skills,
  requirements = EXCLUDED.requirements,
  status = EXCLUDED.status;


-- 4. Seed Job Applications (2 records)
INSERT INTO public.job_applications (id, job_id, full_name, email, phone, portfolio_url, linkedin_url, cover_letter, resume_url, resume_file_name, resume_file_type, status)
VALUES
(
  'd1111111-1111-4111-8111-111111111111',
  'c1111111-1111-4111-8111-111111111111',
  'Jordan Blake',
  'jordan.blake@example.com',
  '+1 (555) 234-5678',
  'https://jordanblake.dev',
  'https://linkedin.com/in/jordanblake-dev',
  'I am thrilled to apply for the Senior Full-Stack AI Engineer role. I have extensive hands-on experience building AI workflows with Supabase and Next.js.',
  'https://example.com/resumes/jordan_blake_resume.pdf',
  'Jordan_Blake_Resume.pdf',
  'application/pdf',
  'pending'
),
(
  'd2222222-2222-4222-8222-222222222222',
  'c2222222-2222-4222-8222-222222222222',
  'Samantha Miller',
  'samantha.m@example.com',
  '+1 (555) 876-5432',
  'https://samanthamiller.design',
  'https://linkedin.com/in/samanthamiller-design',
  'Hi Codzilla team, I specialize in Framer Motion micro-interactions and sleek dark-mode UI systems.',
  'https://example.com/resumes/samantha_miller_resume.pdf',
  'Samantha_Miller_Resume.pdf',
  'application/pdf',
  'reviewed'
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  portfolio_url = EXCLUDED.portfolio_url,
  linkedin_url = EXCLUDED.linkedin_url,
  cover_letter = EXCLUDED.cover_letter,
  resume_url = EXCLUDED.resume_url,
  resume_file_name = EXCLUDED.resume_file_name,
  resume_file_type = EXCLUDED.resume_file_type,
  status = EXCLUDED.status;


-- 5. Seed Team Members (2 records)
INSERT INTO public.team_members (id, name, role, specialty, bio, avatar_url, initials, is_founder, linkedin_url, github_url, x_url, display_order, status)
VALUES
(
  'e1111111-1111-4111-8111-111111111111',
  'Daniel Sterling',
  'Founder & CEO',
  'AI Strategy & System Architecture',
  'Tech visionary with 10+ years driving scalable web applications and enterprise AI automation solutions.',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'DS',
  true,
  'https://linkedin.com/in/danielsterling',
  'https://github.com/danielsterling',
  'https://x.com/danielsterling',
  1,
  'active'
),
(
  'e2222222-2222-4222-8222-222222222222',
  'Aria Montgomery',
  'Co-Founder & VP of Engineering',
  'Distributed Systems & Cloud Architecture',
  'Ex-BigTech engineering leader specialized in high-performance cloud databases and reactive web frontend infrastructure.',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
  'AM',
  true,
  'https://linkedin.com/in/ariamontgomery',
  'https://github.com/ariamontgomery',
  'https://x.com/ariamontgomery',
  2,
  'active'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  specialty = EXCLUDED.specialty,
  bio = EXCLUDED.bio,
  avatar_url = EXCLUDED.avatar_url,
  initials = EXCLUDED.initials,
  is_founder = EXCLUDED.is_founder,
  linkedin_url = EXCLUDED.linkedin_url,
  github_url = EXCLUDED.github_url,
  x_url = EXCLUDED.x_url,
  display_order = EXCLUDED.display_order,
  status = EXCLUDED.status;


-- 6. Seed Packages (2 records)
INSERT INTO public.packages (id, name, subtitle, price, period, featured, features, cta_text, display_order, status)
VALUES
(
  'f1111111-1111-4111-8111-111111111111',
  'MVP Growth Accelerator',
  'Ideal for startups launching high-impact AI web apps fast.',
  '$4,999',
  'One-time execution',
  true,
  ARRAY[
    'Full Next.js 16 + Supabase Backend Setup',
    'Custom AI Agent & Vector Search Integration',
    'Responsive Dark/Light UI Design System',
    'Production Deployment & CI/CD Setup',
    '30 Days Post-Launch Support'
  ],
  'Launch Your MVP',
  1,
  'active'
),
(
  'f2222222-2222-4222-8222-222222222222',
  'Enterprise Scale & Transformation',
  'Dedicated engineering team for complex digital transformations.',
  '$12,500',
  'Starting / Month',
  false,
  ARRAY[
    'Dedicated Full-Stack & AI Squad',
    'Custom Database Optimization & Migration',
    'Custom LLM Integration & Fine-Tuning',
    '24/7 SLA & Dedicated Solutions Architect',
    'Security Audit & RLS Hardening'
  ],
  'Contact Enterprise Team',
  2,
  'active'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  subtitle = EXCLUDED.subtitle,
  price = EXCLUDED.price,
  period = EXCLUDED.period,
  featured = EXCLUDED.featured,
  features = EXCLUDED.features,
  cta_text = EXCLUDED.cta_text,
  display_order = EXCLUDED.display_order,
  status = EXCLUDED.status;


-- 7. Seed Testimonials (2 records)
INSERT INTO public.testimonials (id, quote, author, role, rating, platform, avatar_url, display_order, status)
VALUES
(
  'fa111111-1111-4111-8111-111111111111',
  'Codzilla delivered our full AI SaaS platform 2 weeks ahead of schedule. The design aesthetics and backend architecture were top tier!',
  'David Kim',
  'CTO at Synthetix Labs',
  5,
  'Clutch Verified Review',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  1,
  'active'
),
(
  'fa222222-2222-4222-8222-222222222222',
  'Working with the Codzilla engineering squad was seamless. Their Supabase and Next.js expertise turned our idea into an enterprise revenue driver.',
  'Claire Dupont',
  'VP Product at Horizon Cloud',
  5,
  'Google Business Review',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
  2,
  'active'
)
ON CONFLICT (id) DO UPDATE SET
  quote = EXCLUDED.quote,
  author = EXCLUDED.author,
  role = EXCLUDED.role,
  rating = EXCLUDED.rating,
  platform = EXCLUDED.platform,
  avatar_url = EXCLUDED.avatar_url,
  display_order = EXCLUDED.display_order,
  status = EXCLUDED.status;


-- 8. Seed Portfolio Projects (2 records)
INSERT INTO public.portfolio_projects (id, title, category, impact, description, tags, icon, project_url, display_order, status)
VALUES
(
  'fb111111-1111-4111-8111-111111111111',
  'Aura Intelligence: Autonomous Customer Insights Platform',
  'AI / ML',
  '+250% User Engagement',
  'An enterprise sentiment analysis engine that aggregates customer signals across multi-channel support tickets in real-time.',
  ARRAY['Next.js', 'Supabase Vector', 'OpenAI', 'TailwindCSS'],
  'BrainCircuit',
  'https://aura-demo.codzilla.io',
  1,
  'active'
),
(
  'fb222222-2222-4222-8222-222222222222',
  'Pulse Cloud: High-Throughput Realtime Analytics Dashboard',
  'Full Stack Development',
  '10M+ Events Processed / Day',
  'A sleek, dark-mode real-time telemetry dashboard offering sub-second metric visualisations and automated alert dispatching.',
  ARRAY['React', 'PostgreSQL', 'WebSockets', 'Chart.js'],
  'Activity',
  'https://pulse-demo.codzilla.io',
  2,
  'active'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  impact = EXCLUDED.impact,
  description = EXCLUDED.description,
  tags = EXCLUDED.tags,
  icon = EXCLUDED.icon,
  project_url = EXCLUDED.project_url,
  display_order = EXCLUDED.display_order,
  status = EXCLUDED.status;
