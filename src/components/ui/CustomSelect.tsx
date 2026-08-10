"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface CustomSelectOption {
  label: string;
  value: string;
  badgeClass?: string;
}

interface CustomSelectProps {
  options: CustomSelectOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  align?: "left" | "right";
}

export default function CustomSelect({
  options,
  value,
  onChange,
  label,
  placeholder = "Select an option",
  className = "",
  buttonClassName = "",
  menuClassName = "",
  disabled = false,
  size = "md",
  align = "left",
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value) || (value ? { label: value, value } : options[0]);

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

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs font-mono",
    md: "px-3.5 py-2 text-xs font-mono",
    lg: "px-4 py-3 text-sm font-sans",
  }[size];

  const optionSizeClasses = {
    sm: "px-3 py-2 text-xs font-mono",
    md: "px-3.5 py-2.5 text-xs font-mono",
    lg: "px-4 py-3 text-sm font-sans",
  }[size];

  return (
    <div className={`space-y-1.5 text-left relative ${className}`} ref={containerRef}>
      {label && <label className="text-xs font-mono text-[#E1E6EB] block">{label}</label>}

      {/* Select Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-[#111111] border text-[#E1E6EB] flex items-center justify-between gap-2 transition-all rounded-xl cursor-pointer focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses} ${
          isOpen
            ? "border-[#81D607] bg-[#161616] ring-1 ring-[#81D607]/50 shadow-[0_0_15px_rgba(129,214,7,0.15)]"
            : "border-[#E1E6EB]/15 hover:border-[#81D607]/60"
        } ${buttonClassName}`}
      >
        <span className="truncate flex items-center gap-2">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-[#81D607] shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Floating Options Menu */}
      {isOpen && !disabled && (
        <div
          className={`absolute ${
            align === "right" ? "right-0" : "left-0"
          } min-w-full top-full mt-1 bg-[#1A1A1A] border border-[#81D607]/60 shadow-2xl z-50 rounded-xl max-h-60 overflow-y-auto divide-y divide-[#E1E6EB]/5 overflow-hidden backdrop-blur-md ${menuClassName}`}
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <div
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`${optionSizeClasses} cursor-pointer flex items-center justify-between gap-3 transition-colors ${
                  isSelected
                    ? "bg-[#81D607]/15 text-[#81D607] font-bold"
                    : "text-[#E1E6EB] hover:bg-[#81D607] hover:text-[#111111]"
                }`}
              >
                <span className="truncate">{option.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#81D607] shrink-0" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
