"use client";

import { useState, useEffect } from "react";
import {
  ArrowUpRight,
  Cpu,
  Globe,
  Brain,
  Layers,
  Smartphone,
  CheckCircle,
  Code,
  Server,
  Database,
  Zap,
  Loader2,
  FolderGit2,
} from "lucide-react";

export interface PortfolioProjectItem {
  id: string;
  title: string;
  category: string;
  impact?: string;
  description?: string;
  tags?: string[];
  icon?: string;
  project_url?: string;
  display_order?: number;
  status?: string;
}

const ICON_MAP: Record<string, any> = {
  Brain,
  Cpu,
  Globe,
  Smartphone,
  Layers,
  Code,
  Server,
  Database,
  Zap,
};

export default function Portfolio() {
  const [projects, setProjects] = useState<PortfolioProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  useEffect(() => {
    async function fetchPortfolio() {
      try {
        const res = await fetch("/api/portfolio");
        const data = await res.json();
        if (Array.isArray(data.projects)) {
          setProjects(data.projects);
        }
      } catch (err) {
        console.error("Failed to fetch portfolio projects:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPortfolio();
  }, []);

  // Dynamically extract categories from loaded projects
  const availableCategories = [
    "All",
    ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean))),
  ];

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  const getIconComponent = (iconName?: string) => {
    if (iconName && ICON_MAP[iconName]) {
      return ICON_MAP[iconName];
    }
    return Globe;
  };

  return (
    <section id="portfolio" className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 space-y-3 sm:space-y-4">
        <div className="inline-block px-3 py-1 bg-[#1A1A1A] border border-[#81D607]/40 text-[#81D607] text-xs font-semibold uppercase tracking-wider rounded-none">
          Proof of Work
        </div>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#E1E6EB] tracking-tight leading-tight">
          Selected Portfolio & Case Studies
        </h2>
        <p className="text-xs sm:text-sm text-[#9DA4B0]">
          Explore representative engineering projects delivered across software engineering, machine learning, dynamic web apps, and KiCad PCB hardware.
        </p>

        {/* Filter Category Tabs */}
        {!loading && availableCategories.length > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 pt-3 sm:pt-4">
            {availableCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-mono tracking-wide transition-colors rounded-none ${
                  activeCategory === cat
                    ? "bg-[#81D607] text-[#111111] font-bold"
                    : "bg-[#1A1A1A] text-[#E1E6EB] border border-[#E1E6EB]/15 hover:border-[#81D607]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="py-16 text-center flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#81D607] animate-spin" />
          <span className="text-xs font-mono text-[#9DA4B0]">
            Loading engineering portfolio...
          </span>
        </div>
      ) : filteredProjects.length === 0 ? (
        /* Empty State */
        <div className="p-8 sm:p-12 text-center bg-[#1A1A1A] border border-[#E1E6EB]/10 space-y-3 rounded-none max-w-xl mx-auto">
          <FolderGit2 className="w-8 h-8 text-[#81D607]/40 mx-auto" />
          <h3 className="text-sm font-mono font-bold text-[#E1E6EB]">
            No projects available
          </h3>
          <p className="text-xs text-[#9DA4B0]">
            {activeCategory !== "All"
              ? `No projects found under the "${activeCategory}" category.`
              : "Portfolio projects are currently being updated."}
          </p>
        </div>
      ) : (
        /* Projects Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredProjects.map((project) => {
            const IconComponent = getIconComponent(project.icon);

            const CardContent = (
              <div className="p-5 sm:p-6 bg-[#1A1A1A] border border-[#E1E6EB]/10 hover:border-[#81D607] transition-all duration-200 flex flex-col justify-between group rounded-none text-left h-full">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#81D607] uppercase tracking-wider px-2 py-0.5 bg-[#111111] border border-[#81D607]/30">
                      {project.category}
                    </span>
                    <IconComponent className="w-5 h-5 text-[#81D607]" />
                  </div>

                  <h3 className="text-lg font-bold text-[#E1E6EB] group-hover:text-[#81D607] transition-colors leading-snug">
                    {project.title}
                  </h3>

                  {project.description && (
                    <p className="text-xs text-[#9DA4B0] leading-relaxed font-sans">
                      {project.description}
                    </p>
                  )}

                  {/* Impact Callout */}
                  {project.impact && (
                    <div className="p-3 bg-[#111111] border-l-2 border-[#81D607] flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-[#81D607] shrink-0" />
                      <span className="text-xs font-semibold text-[#E1E6EB]">
                        {project.impact}
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-6 mt-6 border-t border-[#E1E6EB]/10 space-y-4">
                  {/* Tech Tags */}
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-mono px-2 py-0.5 bg-[#111111] text-[#9DA4B0] border border-[#E1E6EB]/10"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs font-bold text-[#81D607]">
                    <span>View Engineering Details</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </div>
            );

            if (project.project_url) {
              return (
                <a
                  key={project.id}
                  href={project.project_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full focus:outline-none"
                >
                  {CardContent}
                </a>
              );
            }

            return <div key={project.id}>{CardContent}</div>;
          })}
        </div>
      )}
    </section>
  );
}
