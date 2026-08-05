export interface BlogPost {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  author: string;
  authorRole: string;
  date?: string;
  created_at?: string;
  readTime: string;
}

// Static blogs have been completely removed in favor of dynamic Supabase DB blogs.
export const staticBlogs: BlogPost[] = [];
