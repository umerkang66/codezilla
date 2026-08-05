import { MetadataRoute } from "next";
import { createAdminClient } from "@/utils/supabase/admin";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://codzilla.com";

  let blogRoutes: MetadataRoute.Sitemap = [];

  try {
    const adminDb = createAdminClient();
    if (adminDb) {
      const { data: blogs } = await adminDb
        .from("blogs")
        .select("id, updated_at");

      if (blogs && blogs.length > 0) {
        blogRoutes = blogs.map((post) => ({
          url: `${baseUrl}/blog/${post.id}`,
          lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
          changeFrequency: "monthly",
          priority: 0.7,
        }));
      }
    }
  } catch (err) {
    console.error("Sitemap dynamic blog fetch error:", err);
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/talent-acquisition`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/careers`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    ...blogRoutes,
  ];
}
