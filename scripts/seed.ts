import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

// 1. Load environment variables manually from .env file
function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf-8");
    content.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const equalsIdx = trimmed.indexOf("=");
      if (equalsIdx !== -1) {
        const key = trimmed.slice(0, equalsIdx).trim();
        let val = trimmed.slice(equalsIdx + 1).trim();
        if (
          (val.startsWith('"') && val.endsWith('"')) ||
          (val.startsWith("'") && val.endsWith("'"))
        ) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    });
  }
}

loadEnv();

const supabaseUrl =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "❌ Error: Missing SUPABASE_URL or SUPABASE_SECRET_KEY / PUBLISHABLE_KEY in .env file."
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

const mockData = {
  blogs: [
    {
      id: "a1111111-1111-4111-8111-111111111111",
      title: "Architecting Next-Gen AI Applications with Next.js 16 & Supabase",
      category: "Engineering",
      excerpt:
        "Discover how modern full-stack architectures leverage vector embeddings, server components, and realtime edge functions to power intelligent web apps.",
      content:
        "## Introduction\n\nArtificial Intelligence is transforming modern web development. By integrating vector storage directly into Postgres via `pgvector` alongside Supabase Edge Functions, developers can build responsive, intelligent applications in record time.\n\n### Key Concepts Covered:\n- **Server-Side Rendering**: Streamlining initial page render times.\n- **Vector Embeddings**: Indexing data efficiently for semantic search.\n- **Real-time Synchronization**: Pushing live updates to users.\n\n## Conclusion\n\nAdopting these paradigms yields responsive, scalable AI solutions.",
      author: "Alex Rivera",
      author_role: "Principal AI Architect",
      read_time: "6 min read",
    },
    {
      id: "a2222222-2222-4222-8222-222222222222",
      title:
        "Scaling Modern Web Applications: Performance Patterns & Best Practices",
      category: "Performance",
      excerpt:
        "An in-depth look into micro-frontend architectures, automated CI/CD pipelines, and caching strategies for high-traffic enterprise platforms.",
      content:
        "## Performance First\n\nSpeed is a feature. In this article, we analyze high-concurrency database connection pooling, image optimization strategies, and serverless compute scaling.\n\n### Core Strategies:\n1. Edge-side page caching\n2. Optimistic UI updates\n3. Lazy loaded interactive widgets\n\n## Summary\n\nEngineered performance foundation leads to higher conversion rates and lower cloud infrastructure costs.",
      author: "Sophia Chen",
      author_role: "Lead Systems Engineer",
      read_time: "4 min read",
    },
  ],
  contact_messages: [
    {
      id: "b1111111-1111-4111-8111-111111111111",
      name: "Marcus Vance",
      email: "marcus.vance@nexuscorp.io",
      service: "AI & Automation",
      message:
        "Hello Codzilla Team! We are looking to build a custom LLM-powered knowledge base for our customer success team. Would love to schedule a discovery call.",
      is_read: false,
    },
    {
      id: "b2222222-2222-4222-8222-222222222222",
      name: "Elena Rostova",
      email: "elena@fintechplus.com",
      service: "Full Stack Development",
      message:
        "We require a high-throughput dashboard redesign using Next.js and Supabase. Please let us know your team availability for Q3.",
      is_read: true,
    },
  ],
  job_postings: [
    {
      id: "c1111111-1111-4111-8111-111111111111",
      title: "Senior Full-Stack AI Engineer",
      domain: "Engineering",
      type: "Remote / Full-Time",
      description:
        "We are seeking an experienced Full-Stack AI Engineer to design and implement generative AI features, web applications, and autonomous agent workflows.",
      skills: [
        "TypeScript",
        "Next.js",
        "Supabase",
        "Python",
        "OpenAI API",
        "TailwindCSS",
      ],
      requirements:
        "5+ years experience in software development. Strong background with React/Next.js and backend database architecture.",
      status: "active",
    },
    {
      id: "c2222222-2222-4222-8222-222222222222",
      title: "Lead UI/UX & Frontend Developer",
      domain: "Design & Engineering",
      type: "Remote / Contract",
      description:
        "Looking for a creative UI/UX specialist who translates complex SaaS workflows into sleek, hyper-performing glassmorphic web interfaces.",
      skills: ["Figma", "React", "Framer Motion", "CSS3", "Accessibility"],
      requirements:
        "3+ years experience designing & building modern SaaS dashboards with high aesthetic standards.",
      status: "active",
    },
  ],
  job_applications: [
    {
      id: "d1111111-1111-4111-8111-111111111111",
      job_id: "c1111111-1111-4111-8111-111111111111",
      full_name: "Jordan Blake",
      email: "jordan.blake@example.com",
      phone: "+1 (555) 234-5678",
      portfolio_url: "https://jordanblake.dev",
      linkedin_url: "https://linkedin.com/in/jordanblake-dev",
      cover_letter:
        "I am thrilled to apply for the Senior Full-Stack AI Engineer role. I have extensive hands-on experience building AI workflows with Supabase and Next.js.",
      resume_url: "https://example.com/resumes/jordan_blake_resume.pdf",
      resume_file_name: "Jordan_Blake_Resume.pdf",
      resume_file_type: "application/pdf",
      status: "pending",
    },
    {
      id: "d2222222-2222-4222-8222-222222222222",
      job_id: "c2222222-2222-4222-8222-222222222222",
      full_name: "Samantha Miller",
      email: "samantha.m@example.com",
      phone: "+1 (555) 876-5432",
      portfolio_url: "https://samanthamiller.design",
      linkedin_url: "https://linkedin.com/in/samanthamiller-design",
      cover_letter:
        "Hi Codzilla team, I specialize in Framer Motion micro-interactions and sleek dark-mode UI systems.",
      resume_url: "https://example.com/resumes/samantha_miller_resume.pdf",
      resume_file_name: "Samantha_Miller_Resume.pdf",
      resume_file_type: "application/pdf",
      status: "reviewed",
    },
  ],
  team_members: [
    {
      id: "e1111111-1111-4111-8111-111111111111",
      name: "Daniel Sterling",
      role: "Founder & CEO",
      specialty: "AI Strategy & System Architecture",
      bio: "Tech visionary with 10+ years driving scalable web applications and enterprise AI automation solutions.",
      avatar_url:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      initials: "DS",
      is_founder: true,
      linkedin_url: "https://linkedin.com/in/danielsterling",
      github_url: "https://github.com/danielsterling",
      x_url: "https://x.com/danielsterling",
      display_order: 1,
      status: "active",
    },
    {
      id: "e2222222-2222-4222-8222-222222222222",
      name: "Aria Montgomery",
      role: "Co-Founder & VP of Engineering",
      specialty: "Distributed Systems & Cloud Architecture",
      bio: "Ex-BigTech engineering leader specialized in high-performance cloud databases and reactive web frontend infrastructure.",
      avatar_url:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
      initials: "AM",
      is_founder: true,
      linkedin_url: "https://linkedin.com/in/ariamontgomery",
      github_url: "https://github.com/ariamontgomery",
      x_url: "https://x.com/ariamontgomery",
      display_order: 2,
      status: "active",
    },
  ],
  packages: [
    {
      id: "f1111111-1111-4111-8111-111111111111",
      name: "MVP Growth Accelerator",
      subtitle: "Ideal for startups launching high-impact AI web apps fast.",
      price: "$4,999",
      period: "One-time execution",
      featured: true,
      features: [
        "Full Next.js 16 + Supabase Backend Setup",
        "Custom AI Agent & Vector Search Integration",
        "Responsive Dark/Light UI Design System",
        "Production Deployment & CI/CD Setup",
        "30 Days Post-Launch Support",
      ],
      cta_text: "Launch Your MVP",
      display_order: 1,
      status: "active",
    },
    {
      id: "f2222222-2222-4222-8222-222222222222",
      name: "Enterprise Scale & Transformation",
      subtitle:
        "Dedicated engineering team for complex digital transformations.",
      price: "$12,500",
      period: "Starting / Month",
      featured: false,
      features: [
        "Dedicated Full-Stack & AI Squad",
        "Custom Database Optimization & Migration",
        "Custom LLM Integration & Fine-Tuning",
        "24/7 SLA & Dedicated Solutions Architect",
        "Security Audit & RLS Hardening",
      ],
      cta_text: "Contact Enterprise Team",
      display_order: 2,
      status: "active",
    },
  ],
  testimonials: [
    {
      id: "fa111111-1111-4111-8111-111111111111",
      quote:
        "Codzilla delivered our full AI SaaS platform 2 weeks ahead of schedule. The design aesthetics and backend architecture were top tier!",
      author: "David Kim",
      role: "CTO at Synthetix Labs",
      rating: 5,
      platform: "Clutch Verified Review",
      avatar_url:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      display_order: 1,
      status: "active",
    },
    {
      id: "fa222222-2222-4222-8222-222222222222",
      quote:
        "Working with the Codzilla engineering squad was seamless. Their Supabase and Next.js expertise turned our idea into an enterprise revenue driver.",
      author: "Claire Dupont",
      role: "VP Product at Horizon Cloud",
      rating: 5,
      platform: "Google Business Review",
      avatar_url:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
      display_order: 2,
      status: "active",
    },
  ],
  portfolio_projects: [
    {
      id: "fb111111-1111-4111-8111-111111111111",
      title: "Aura Intelligence: Autonomous Customer Insights Platform",
      category: "AI / ML",
      impact: "+250% User Engagement",
      description:
        "An enterprise sentiment analysis engine that aggregates customer signals across multi-channel support tickets in real-time.",
      tags: ["Next.js", "Supabase Vector", "OpenAI", "TailwindCSS"],
      icon: "BrainCircuit",
      project_url: "https://aura-demo.codzilla.io",
      display_order: 1,
      status: "active",
    },
    {
      id: "fb222222-2222-4222-8222-222222222222",
      title: "Pulse Cloud: High-Throughput Realtime Analytics Dashboard",
      category: "Full Stack Development",
      impact: "10M+ Events Processed / Day",
      description:
        "A sleek, dark-mode real-time telemetry dashboard offering sub-second metric visualisations and automated alert dispatching.",
      tags: ["React", "PostgreSQL", "WebSockets", "Chart.js"],
      icon: "Activity",
      project_url: "https://pulse-demo.codzilla.io",
      display_order: 2,
      status: "active",
    },
  ],
};

async function seedDatabase() {
  console.log("🌱 Starting Database Seed Process for Codzilla Website...\n");

  for (const [table, records] of Object.entries(mockData)) {
    console.log(`➡️  Seeding table: '${table}' (${records.length} items)...`);
    const { data, error } = await supabase
      .from(table)
      .upsert(records, { onConflict: "id" });

    if (error) {
      console.error(`❌ Error seeding table '${table}':`, error.message);
    } else {
      console.log(`✅ Successfully seeded '${table}'!`);
    }
  }

  console.log("\n🎉 Database seed completed successfully!");
}

seedDatabase().catch((err) => {
  console.error("💥 Seed process encountered fatal error:", err);
  process.exit(1);
});
