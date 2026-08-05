"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

interface Option {
  label: string;
  value: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export default function CustomSelect({
  options,
  value,
  onChange,
  label,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-1.5 text-left relative" ref={containerRef}>
      {label && <label className="text-xs font-mono text-[#E1E6EB]">{label}</label>}

      {/* Select Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 bg-[#111111] border text-sm text-[#E1E6EB] flex items-center justify-between transition-colors rounded-none focus:outline-none ${
          isOpen
            ? "border-[#81D607] bg-[#161616]"
            : "border-[#E1E6EB]/15 hover:border-[#81D607]/60"
        }`}
      >
        <span className="truncate">{selectedOption?.label}</span>
        <ChevronDown
          className={`w-4 h-4 text-[#81D607] shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Options Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-[#1A1A1A] border border-[#81D607]/60 shadow-2xl z-50 rounded-none max-h-60 overflow-y-auto divide-y divide-[#E1E6EB]/5">
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <div
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`px-4 py-3 text-sm cursor-pointer flex items-center justify-between transition-colors rounded-none ${
                  isSelected
                    ? "bg-[#81D607]/15 text-[#81D607] font-semibold"
                    : "text-[#E1E6EB] hover:bg-[#81D607] hover:text-[#111111]"
                }`}
              >
                <span>{option.label}</span>
                {isSelected && <Check className="w-4 h-4 text-[#81D607] shrink-0" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
