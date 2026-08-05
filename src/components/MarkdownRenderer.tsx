"use client";

import { useEffect, useState, useMemo } from "react";
import { marked } from "marked";
import { Copy, Check } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  const htmlContent = useMemo(() => {
    if (!content) return "";
    
    // Configure marked to open links in new tab and format code
    const renderer = new marked.Renderer();

    renderer.link = ({ href, title, text }) => {
      const titleAttr = title ? ` title="${title}"` : "";
      return `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer" class="text-[#81D607] hover:underline font-mono font-semibold transition-colors">${text}</a>`;
    };

    renderer.code = ({ text, lang }) => {
      const languageClass = lang ? ` language-${lang}` : "";
      return `<div class="code-block-wrapper my-6 bg-[#0D0D0D] border border-[#81D607]/30 shadow-lg text-left select-text relative group rounded-none">
        <div class="flex items-center justify-between px-4 py-2 bg-[#1A1A1A] border-b border-[#E1E6EB]/10 font-mono text-xs text-[#9DA4B0]">
          <span class="text-[#81D607] uppercase font-bold text-[11px]">${lang || "code"}</span>
        </div>
        <pre class="p-4 overflow-x-auto text-[#E1E6EB] font-mono text-xs leading-relaxed"><code class="${languageClass}">${text.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>
      </div>`;
    };

    renderer.codespan = ({ text }) => {
      return `<code class="bg-[#1A1A1A] text-[#81D607] border border-[#81D607]/20 px-1.5 py-0.5 font-mono text-xs rounded-none">${text}</code>`;
    };

    renderer.blockquote = ({ text }) => {
      return `<blockquote class="border-l-4 border-[#81D607] bg-[#1A1A1A] px-4 py-3 text-[#9DA4B0] italic my-5 font-sans">${text}</blockquote>`;
    };

    renderer.heading = ({ text, depth }) => {
      const levels: Record<number, string> = {
        1: "text-2xl sm:text-3xl font-mono font-extrabold text-[#E1E6EB] border-b border-[#81D607]/30 pb-3 mt-8 mb-4 tracking-tight",
        2: "text-xl sm:text-2xl font-mono font-bold text-[#E1E6EB] mt-7 mb-3 tracking-tight",
        3: "text-lg sm:text-xl font-mono font-bold text-[#81D607] mt-6 mb-2 tracking-tight",
        4: "text-base font-mono font-bold text-[#E1E6EB] mt-5 mb-2",
        5: "text-sm font-mono font-bold text-[#9DA4B0] mt-4 mb-2",
        6: "text-xs font-mono font-bold text-[#9DA4B0] mt-4 mb-2 uppercase",
      };
      const className = levels[depth] || levels[2];
      return `<h${depth} class="${className}">${text}</h${depth}>`;
    };

    renderer.paragraph = ({ text }) => {
      return `<p class="text-[#9DA4B0] leading-relaxed mb-4 text-base font-sans">${text}</p>`;
    };

    renderer.list = ({ items, ordered }) => {
      const tag = ordered ? "ol" : "ul";
      const listClass = ordered
        ? "list-decimal list-inside space-y-2 mb-4 text-[#9DA4B0] pl-2 font-sans"
        : "list-disc list-inside space-y-2 mb-4 text-[#9DA4B0] pl-2 font-sans";
      
      const body = items.map((item) => `<li class="leading-relaxed">${item.text}</li>`).join("");
      return `<${tag} class="${listClass}">${body}</${tag}>`;
    };

    renderer.table = ({ header, rows }) => {
      const headerHtml = header.map(cell => `<th class="bg-[#1A1A1A] border border-[#E1E6EB]/20 p-2.5 text-[#81D607] font-bold uppercase text-left">${cell.text}</th>`).join("");
      const rowsHtml = rows.map(row => {
        const rowCells = row.map(cell => `<td class="border border-[#E1E6EB]/10 p-2.5 text-[#9DA4B0]">${cell.text}</td>`).join("");
        return `<tr>${rowCells}</tr>`;
      }).join("");

      return `<div class="overflow-x-auto my-6"><table class="w-full border-collapse border border-[#E1E6EB]/20 text-left font-mono text-xs"><thead><tr>${headerHtml}</tr></thead><tbody>${rowsHtml}</tbody></table></div>`;
    };

    renderer.hr = () => {
      return `<hr class="border-t border-[#E1E6EB]/10 my-8" />`;
    };

    marked.setOptions({
      gfm: true,
      breaks: true,
      renderer,
    });

    return marked.parse(content) as string;
  }, [content]);

  return (
    <div
      className={`prose-codzilla text-left max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
