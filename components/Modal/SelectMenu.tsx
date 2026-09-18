"use client";

import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";

/**
 * A listbox in our own markup. The native <select> renders as an OS menu that
 * ignores the form's styling, sits outside the modal on mobile, and has no
 * room for a filter — this list has around thirty services.
 */
const FILTER_THRESHOLD = 10;

type SelectMenuProps = {
  label: string;
  options: string[] | null | undefined;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  breakpoint?: boolean;
  disabled?: boolean;
};

const SelectMenu: React.FC<SelectMenuProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder,
  breakpoint = false,
  disabled = false,
}) => {
  const items = useMemo(() => (options ?? []).filter(Boolean), [options]);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();

  const showFilter = items.length > FILTER_THRESHOLD;

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => item.toLowerCase().includes(q));
  }, [items, query]);

  // Close on a click anywhere outside the field.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  // Opening starts on the current value so Enter re-picks it rather than jumping.
  useEffect(() => {
    if (!open) {
      setQuery("");
      setActiveIndex(-1);
      return;
    }
    const current = items.indexOf(value);
    setActiveIndex(current);
    if (showFilter) {
      requestAnimationFrame(() => searchRef.current?.focus());
    }
  }, [open, items, value, showFilter]);

  // Keep the highlighted row in view while arrowing through a long list.
  useEffect(() => {
    if (!open || activeIndex < 0) return;
    const node = listRef.current?.children[activeIndex] as HTMLElement | undefined;
    node?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex]);

  const commit = (option: string) => {
    onChange(option);
    setOpen(false);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;

    if (!open) {
      if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(event.key)) {
        event.preventDefault();
        setOpen(true);
      }
      return;
    }

    switch (event.key) {
      case "Escape":
        event.preventDefault();
        setOpen(false);
        break;
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((i) => (visible.length === 0 ? -1 : (i + 1) % visible.length));
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((i) => (visible.length === 0 ? -1 : (i <= 0 ? visible.length : i) - 1));
        break;
      case "Home":
        event.preventDefault();
        setActiveIndex(visible.length ? 0 : -1);
        break;
      case "End":
        event.preventDefault();
        setActiveIndex(visible.length - 1);
        break;
      case "Enter":
        event.preventDefault();
        if (activeIndex >= 0 && visible[activeIndex]) commit(visible[activeIndex]);
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  };

  return (
    <div
      ref={containerRef}
      className={`flex flex-col items-start w-full ${breakpoint ? "md:w-1/2" : ""}`}
    >
      <label className="text-sm font-semibold text-[#19192C] font-poppins mb-1.5">
        {label}
      </label>

      <div className="relative w-full" onKeyDown={onKeyDown}>
        <button
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listboxId : undefined}
          onClick={() => setOpen((v) => !v)}
          className={`flex w-full h-11 items-center justify-between gap-2 rounded-xl border px-4 text-left text-sm shadow-sm outline-none transition-colors ${
            disabled
              ? "cursor-not-allowed border-gray-100 bg-gray-50 text-gray-400"
              : open
                ? "border-[#C1001F] bg-white text-[#19192C] ring-2 ring-[#C1001F]/20"
                : "border-gray-200 bg-white text-[#19192C] hover:border-[#C1001F]/40"
          }`}
        >
          <span className={`truncate ${value ? "" : "text-[#9CA3AF]"}`}>
            {value || placeholder || `Select ${label}`}
          </span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-[#6C7582] transition-transform ${open ? "rotate-180" : ""}`}
            aria-hidden
          />
        </button>

        {open && (
          <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
            {showFilter && (
              <div className="relative border-b border-gray-100">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]"
                  aria-hidden
                />
                <input
                  ref={searchRef}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActiveIndex(0);
                  }}
                  placeholder={`Search ${label.toLowerCase()}`}
                  className="w-full py-2.5 pl-9 pr-3 text-sm text-[#19192C] outline-none placeholder:text-[#9CA3AF]"
                />
              </div>
            )}

            {visible.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-[#6C7582]">No matches</p>
            ) : (
              <ul
                ref={listRef}
                id={listboxId}
                role="listbox"
                aria-label={label}
                className="max-h-60 overflow-y-auto py-1"
              >
                {visible.map((option, index) => {
                  const isSelected = option === value;
                  const isActive = index === activeIndex;
                  return (
                    <li
                      key={option}
                      role="option"
                      aria-selected={isSelected}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => commit(option)}
                      className={`flex cursor-pointer items-center justify-between gap-2 px-4 py-2.5 text-sm transition-colors ${
                        isActive ? "bg-[#F8F5F0]" : ""
                      } ${isSelected ? "font-semibold text-[#C1001F]" : "text-[#19192C]"}`}
                    >
                      <span className="truncate">{option}</span>
                      {isSelected && <Check className="h-4 w-4 shrink-0" aria-hidden />}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectMenu;
