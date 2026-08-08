"use client";

import { useMemo } from "react";
import { Marked } from "marked";
import hljs from "highlight.js";
import katex from "katex";
import "katex/dist/katex.min.css";
import "highlight.js/styles/github-dark.css";

import { sanitizeHtmlContent, escapeHtml } from "@/utils/security/sanitize";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// Known standard HTML tags to preserve during angle bracket escaping
const VALID_HTML_TAGS = new Set([
  "a", "b", "i", "strong", "em", "code", "pre", "span", "div", "p",
  "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li", "blockquote",
  "table", "thead", "tbody", "tr", "th", "td", "img", "br", "hr",
  "sub", "sup", "del", "mark", "ins", "details", "summary", "section", "article",
  "script", "style", "iframe", "object", "embed", "applet", "form", "input", "button"
]);

/**
 * Escapes non-standard HTML angle brackets (e.g. <something_bold> or <user_name>)
 * so they render as literal text rather than invalid DOM elements.
 */
function escapeNonHtmlAngleBrackets(text: string): string {
  if (!text) return "";
  return text.replace(/<\/?([a-zA-Z0-9_-]+)(?:\s+[^>]*|\s*)>/g, (fullMatch, tagName) => {
    const lowerName = tagName.toLowerCase();
    if (VALID_HTML_TAGS.has(lowerName)) {
      return fullMatch; // Keep valid HTML tags intact
    }
    // Escape non-standard tags so <something_bold> becomes &lt;something_bold&gt;
    return fullMatch.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  });
}

/**
 * Extracts LaTeX math formulas ($...$, $$...$$, \(...\), \[...\]) and pre-renders
 * them with KaTeX to protect them from markdown parsing mangling.
 */
function preprocessAndRenderMath(rawText: string): { text: string; mathMap: Record<string, string> } {
  const mathMap: Record<string, string> = {};
  let mathCounter = 0;

  // Replace block math $$ ... $$ or \[ ... \]
  let text = rawText
    .replace(/\$\$\s*([\s\S]+?)\s*\$\$/g, (_, mathExpr) => {
      const key = `KATEXBLOCKMATH${mathCounter++}KATEX`;
      try {
        mathMap[key] = katex.renderToString(mathExpr.trim(), { displayMode: true, throwOnError: false });
      } catch {
        mathMap[key] = `<div class="katex-error">${escapeHtml(mathExpr)}</div>`;
      }
      return key;
    })
    .replace(/\\\[\s*([\s\S]+?)\s*\\\]/g, (_, mathExpr) => {
      const key = `KATEXBLOCKMATH${mathCounter++}KATEX`;
      try {
        mathMap[key] = katex.renderToString(mathExpr.trim(), { displayMode: true, throwOnError: false });
      } catch {
        mathMap[key] = `<div class="katex-error">${escapeHtml(mathExpr)}</div>`;
      }
      return key;
    });

  // Replace inline math \( ... \) or $ ... $
  text = text
    .replace(/\\\(\s*([\s\S]+?)\s*\\\)/g, (_, mathExpr) => {
      const key = `KATEXINLINEMATH${mathCounter++}KATEX`;
      try {
        mathMap[key] = katex.renderToString(mathExpr.trim(), { displayMode: false, throwOnError: false });
      } catch {
        mathMap[key] = `<span class="katex-error">${escapeHtml(mathExpr)}</span>`;
      }
      return key;
    })
    .replace(/(^|[^\\])\$([^\$\n]+?)\$/g, (match, prefix, mathExpr) => {
      // Don't treat standalone currency like $10 or $100 as math
      if (/^\s*\d+(\.\d+)?\s*$/.test(mathExpr)) {
        return match;
      }
      const key = `KATEXINLINEMATH${mathCounter++}KATEX`;
      try {
        mathMap[key] = katex.renderToString(mathExpr.trim(), { displayMode: false, throwOnError: false });
      } catch {
        mathMap[key] = `<span class="katex-error">${escapeHtml(mathExpr)}</span>`;
      }
      return prefix + key;
    });

  return { text, mathMap };
}

export default function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  const htmlContent = useMemo(() => {
    if (!content) return "";

    // 1. Pre-process Math formulas & extract them
    const { text: textWithMathKeys, mathMap } = preprocessAndRenderMath(content);

    // 2. Escape non-HTML angle brackets (e.g. <something_bold>)
    const safeContent = escapeNonHtmlAngleBrackets(textWithMathKeys);

    // 3. Configure isolated marked instance
    const markedInstance = new Marked({
      gfm: true,
      breaks: true,
    });

    // Custom renderer rules
    markedInstance.use({
      renderer: {
        strong(this: any, token: any) {
          const innerText = typeof token === "string" ? token : this.parser.parseInline(token.tokens || []);
          return `<strong class="font-bold text-[#E1E6EB]">${innerText}</strong>`;
        },

        em(this: any, token: any) {
          const innerText = typeof token === "string" ? token : this.parser.parseInline(token.tokens || []);
          return `<em class="italic text-[#E1E6EB]">${innerText}</em>`;
        },

        link(token: any, legacyTitle?: string, legacyText?: string) {
          const href = typeof token === "string" ? token : token?.href || "#";
          const title = typeof token === "string" ? legacyTitle : token?.title;
          const text = typeof token === "string" ? legacyText : token?.text || token?.raw || "";
          const titleAttr = title ? ` title="${title}"` : "";
          return `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer" class="text-[#81D607] hover:underline font-mono font-semibold transition-colors">${text}</a>`;
        },

        code({ text, lang }: { text: string; lang?: string }) {
          let highlighted = "";
          const cleanLang = (lang || "").trim().toLowerCase();

          if (cleanLang && hljs.getLanguage(cleanLang)) {
            try {
              highlighted = hljs.highlight(text, { language: cleanLang }).value;
            } catch {
              highlighted = escapeHtml(text);
            }
          } else {
            try {
              highlighted = hljs.highlightAuto(text).value;
            } catch {
              highlighted = escapeHtml(text);
            }
          }

          const displayLang = lang || "code";

          return `<div class="code-block-wrapper my-6 bg-[#0D0D0D] border border-[#81D607]/30 shadow-lg text-left select-text relative group rounded-none overflow-hidden">
            <div class="flex items-center justify-between px-4 py-2 bg-[#1A1A1A] border-b border-[#E1E6EB]/10 font-mono text-xs text-[#9DA4B0]">
              <span class="text-[#81D607] uppercase font-bold text-[11px]">${displayLang}</span>
            </div>
            <pre class="p-4 overflow-x-auto text-[#E1E6EB] font-mono text-xs leading-relaxed bg-[#0D0D0D]"><code class="hljs ${cleanLang ? `language-${cleanLang}` : ""}">${highlighted}</code></pre>
          </div>`;
        },

        codespan({ text }: { text: string }) {
          return `<code class="bg-[#1A1A1A] text-[#81D607] border border-[#81D607]/20 px-1.5 py-0.5 font-mono text-xs rounded-none">${text}</code>`;
        },

        blockquote({ text }: { text: string }) {
          return `<blockquote class="border-l-4 border-[#81D607] bg-[#1A1A1A] px-4 py-3 text-[#9DA4B0] italic my-5 font-sans">${text}</blockquote>`;
        },

        heading({ text, depth }: { text: string; depth: number }) {
          const levels: Record<number, string> = {
            1: "text-2xl sm:text-3xl font-mono font-extrabold text-[#E1E6EB] border-b border-[#81D607]/30 pb-3 mt-8 mb-4 tracking-tight",
            2: "text-xl sm:text-2xl font-mono font-bold text-[#E1E6EB] mt-7 mb-3 tracking-tight",
            3: "text-lg sm:text-xl font-mono font-bold text-[#81D607] mt-6 mb-2 tracking-tight",
            4: "text-base font-mono font-bold text-[#E1E6EB] mt-5 mb-2",
            5: "text-sm font-mono font-bold text-[#9DA4B0] mt-4 mb-2",
            6: "text-xs font-mono font-bold text-[#9DA4B0] mt-4 mb-2 uppercase",
          };
          const headingClass = levels[depth] || levels[2];
          return `<h${depth} class="${headingClass}">${text}</h${depth}>`;
        },

        paragraph(this: any, token: any) {
          const innerHtml = this.parser.parseInline(token.tokens || []);
          return `<p class="text-[#9DA4B0] leading-relaxed mb-4 text-base font-sans">${innerHtml}</p>`;
        },

        table({ header, rows }: { header: any[]; rows: any[][] }) {
          const headerHtml = header
            .map(
              (cell) =>
                `<th class="bg-[#1A1A1A] border border-[#E1E6EB]/20 p-2.5 text-[#81D607] font-bold uppercase text-left">${cell.text}</th>`
            )
            .join("");
          const rowsHtml = rows
            .map((row) => {
              const rowCells = row
                .map((cell) => `<td class="border border-[#E1E6EB]/10 p-2.5 text-[#9DA4B0]">${cell.text}</td>`)
                .join("");
              return `<tr>${rowCells}</tr>`;
            })
            .join("");

          return `<div class="overflow-x-auto my-6"><table class="w-full border-collapse border border-[#E1E6EB]/20 text-left font-mono text-xs"><thead><tr>${headerHtml}</tr></thead><tbody>${rowsHtml}</tbody></table></div>`;
        },

        hr() {
          return `<hr class="border-t border-[#E1E6EB]/10 my-8" />`;
        },
      },
    });

    // 4. Parse markdown to HTML
    let parsedHtml = markedInstance.parse(safeContent) as string;

    // 5. Restore KaTeX rendered math expressions
    for (const [key, renderedMath] of Object.entries(mathMap)) {
      parsedHtml = parsedHtml.replaceAll(key, renderedMath);
    }

    // 6. Sanitize HTML for security
    return sanitizeHtmlContent(parsedHtml);
  }, [content]);

  return (
    <div
      className={`prose-codzilla text-left max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}

