"use client";

import { useState, useRef, ChangeEvent } from "react";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  Link,
  Code,
  FileCode,
  List,
  ListOrdered,
  Quote,
  Eye,
  Edit3,
  Columns,
  Minus,
} from "lucide-react";
import MarkdownRenderer from "@/components/MarkdownRenderer";

interface MarkdownEditorProps {
  value: string;
  onChange: (val: string) => void;
  minHeight?: string;
}

export default function MarkdownEditor({
  value,
  onChange,
  minHeight = "350px",
}: MarkdownEditorProps) {
  const [mode, setMode] = useState<"write" | "preview" | "split">("split");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Helper to insert formatting at cursor position
  const insertFormatting = (prefix: string, suffix: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const replacement = `${prefix}${selectedText || "text"}${suffix}`;

    const newValue =
      value.substring(0, start) + replacement + value.substring(end);
    onChange(newValue);

    // Set cursor position back inside formatting
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + (selectedText.length || 4)
      );
    }, 10);
  };

  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="border border-[#81D607]/40 bg-[#111111] flex flex-col rounded-2xl overflow-hidden text-left">
      {/* Editor Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-[#1A1A1A] border-b border-[#E1E6EB]/10">
        {/* Formatting Tools */}
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => insertFormatting("**", "**")}
            className="p-1.5 text-[#9DA4B0] hover:text-[#81D607] hover:bg-[#111111] border border-transparent hover:border-[#81D607]/30 transition-colors rounded-lg cursor-pointer"
            title="Bold (**bold**)"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting("*", "*")}
            className="p-1.5 text-[#9DA4B0] hover:text-[#81D607] hover:bg-[#111111] border border-transparent hover:border-[#81D607]/30 transition-colors rounded-lg cursor-pointer"
            title="Italic (*italic*)"
          >
            <Italic className="w-4 h-4" />
          </button>
          <div className="w-[1px] h-4 bg-[#E1E6EB]/15 mx-1" />
          <button
            type="button"
            onClick={() => insertFormatting("# ")}
            className="p-1.5 text-[#9DA4B0] hover:text-[#81D607] hover:bg-[#111111] border border-transparent hover:border-[#81D607]/30 transition-colors rounded-lg cursor-pointer"
            title="Heading 1 (# Heading)"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting("## ")}
            className="p-1.5 text-[#9DA4B0] hover:text-[#81D607] hover:bg-[#111111] border border-transparent hover:border-[#81D607]/30 transition-colors rounded-lg cursor-pointer"
            title="Heading 2 (## Heading)"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting("### ")}
            className="p-1.5 text-[#9DA4B0] hover:text-[#81D607] hover:bg-[#111111] border border-transparent hover:border-[#81D607]/30 transition-colors rounded-lg cursor-pointer"
            title="Heading 3 (### Heading)"
          >
            <Heading3 className="w-4 h-4" />
          </button>
          <div className="w-[1px] h-4 bg-[#E1E6EB]/15 mx-1" />
          <button
            type="button"
            onClick={() => insertFormatting("[", "](https://example.com)")}
            className="p-1.5 text-[#9DA4B0] hover:text-[#81D607] hover:bg-[#111111] border border-transparent hover:border-[#81D607]/30 transition-colors rounded-lg cursor-pointer"
            title="Insert Link [title](url)"
          >
            <Link className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting("`", "`")}
            className="p-1.5 text-[#9DA4B0] hover:text-[#81D607] hover:bg-[#111111] border border-transparent hover:border-[#81D607]/30 transition-colors rounded-lg cursor-pointer"
            title="Inline Code (`code`)"
          >
            <Code className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting("```javascript\n", "\n```")}
            className="p-1.5 text-[#9DA4B0] hover:text-[#81D607] hover:bg-[#111111] border border-transparent hover:border-[#81D607]/30 transition-colors rounded-lg cursor-pointer"
            title="Code Block (```js ... ```)"
          >
            <FileCode className="w-4 h-4" />
          </button>
          <div className="w-[1px] h-4 bg-[#E1E6EB]/15 mx-1" />
          <button
            type="button"
            onClick={() => insertFormatting("- ")}
            className="p-1.5 text-[#9DA4B0] hover:text-[#81D607] hover:bg-[#111111] border border-transparent hover:border-[#81D607]/30 transition-colors rounded-lg cursor-pointer"
            title="Bullet List (- item)"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting("1. ")}
            className="p-1.5 text-[#9DA4B0] hover:text-[#81D607] hover:bg-[#111111] border border-transparent hover:border-[#81D607]/30 transition-colors rounded-lg cursor-pointer"
            title="Numbered List (1. item)"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting("> ")}
            className="p-1.5 text-[#9DA4B0] hover:text-[#81D607] hover:bg-[#111111] border border-transparent hover:border-[#81D607]/30 transition-colors rounded-lg cursor-pointer"
            title="Quote (> text)"
          >
            <Quote className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting("\n---\n")}
            className="p-1.5 text-[#9DA4B0] hover:text-[#81D607] hover:bg-[#111111] border border-transparent hover:border-[#81D607]/30 transition-colors rounded-lg cursor-pointer"
            title="Horizontal Divider (---)"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* View Mode Mode Toggles */}
        <div className="flex items-center gap-1 bg-[#111111] p-1 border border-[#E1E6EB]/10 font-mono text-[11px] rounded-xl">
          <button
            type="button"
            onClick={() => setMode("write")}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg cursor-pointer ${
              mode === "write"
                ? "bg-[#81D607] text-[#111111] font-bold"
                : "text-[#9DA4B0] hover:text-[#E1E6EB]"
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Write</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("split")}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg cursor-pointer ${
              mode === "split"
                ? "bg-[#81D607] text-[#111111] font-bold"
                : "text-[#9DA4B0] hover:text-[#E1E6EB]"
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Split</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("preview")}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg cursor-pointer ${
              mode === "preview"
                ? "bg-[#81D607] text-[#111111] font-bold"
                : "text-[#9DA4B0] hover:text-[#E1E6EB]"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="flex-1 flex flex-col md:flex-row min-h-[350px]">
        {/* Write Textarea Mode */}
        {(mode === "write" || mode === "split") && (
          <div
            className={`flex-1 p-4 bg-[#111111] flex flex-col ${
              mode === "split" ? "border-b md:border-b-0 md:border-r border-[#E1E6EB]/10" : ""
            }`}
          >
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
              placeholder="Write your blog content here using Markdown syntax..."
              className="w-full h-full min-h-[320px] bg-transparent text-[#E1E6EB] font-mono text-sm leading-relaxed focus:outline-none resize-y"
              style={{ minHeight }}
            />
          </div>
        )}

        {/* Live Preview Mode */}
        {(mode === "preview" || mode === "split") && (
          <div className="flex-1 p-6 bg-[#0D0D0D] overflow-y-auto max-h-[550px]">
            {value.trim() ? (
              <MarkdownRenderer content={value} />
            ) : (
              <div className="h-full flex items-center justify-center text-xs font-mono text-[#9DA4B0] italic py-12">
                Markdown preview will appear here as you write...
              </div>
            )}
          </div>
        )}
      </div>

      {/* Editor Footer Stats */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#1A1A1A] border-t border-[#E1E6EB]/10 font-mono text-[11px] text-[#9DA4B0]">
        <div className="flex items-center gap-4">
          <span>
            Words: <strong className="text-[#81D607]">{wordCount}</strong>
          </span>
          <span>
            Characters: <strong className="text-[#E1E6EB]">{value.length}</strong>
          </span>
        </div>
        <div>
          Est. Read Time: <strong className="text-[#81D607]">{readTimeMinutes} min read</strong>
        </div>
      </div>
    </div>
  );
}
