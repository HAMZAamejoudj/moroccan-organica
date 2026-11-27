'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import type { JSONContent } from '@tiptap/core';

export interface TimelineItem {
  id: string;
  text: string;
  level: number;
}

export interface BlogPostTimelineProps {
  content: string | null;
  className?: string;
  recommendedTitle?: string;
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(Number(dec)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}

function generateId(text: string, fallbackIndex: number): string {
  const slug = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');

  return slug || `section-${fallbackIndex}`;
}

function extractHeadings(html: string | null): TimelineItem[] {
  if (!html || typeof html !== 'string') return [];

  const headings: TimelineItem[] = [];
  const idCounts: Record<string, number> = {};

  // Parse headings deterministically on both SSR and client to avoid React hydration mismatch (#418)
  const headingRegex = /<h([1-6])(?:\s[^>]*)?>([\s\S]*?)<\/h\1>/gi;
  let match: RegExpExecArray | null;
  let index = 0;

  while ((match = headingRegex.exec(html)) !== null) {
    index += 1;
    const level = parseInt(match[1], 10);
    const rawInner = match[2] || '';
    const text = decodeHtmlEntities(rawInner.replace(/<[^>]*>/g, '')).replace(/\s+/g, ' ').trim();

    if (text) {
      const baseId = generateId(text, index);
      idCounts[baseId] = (idCounts[baseId] || 0) + 1;
      const id = idCounts[baseId] === 1 ? baseId : `${baseId}-${idCounts[baseId]}`;
      headings.push({ id, text, level });
    }
  }

  return headings;
}

export function BlogPostTimeline({
  content,
  className,
  recommendedTitle
}: BlogPostTimelineProps) {
  const headings = useMemo(() => extractHeadings(content), [content]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (headings.length === 0) return;

    let disconnectObserver: (() => void) | undefined;

    const setupObserver = () => {
      // Ensure rendered article headings have matching IDs so TOC scroll & IntersectionObserver work
      const articleRoot = document.querySelector('article .rich-text-content');
      if (articleRoot) {
        const renderedHeadings = articleRoot.querySelectorAll('h1, h2, h3, h4, h5, h6');
        renderedHeadings.forEach((el, idx) => {
          if (!el.id && headings[idx]) {
            el.id = headings[idx].id;
          }
        });
      }

      const observer = new IntersectionObserver(
        (entries) => {
          const intersecting = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

          if (intersecting.length > 0) {
            setActiveId(intersecting[0].target.id);
          }
        },
        {
          rootMargin: '-20% 0px -60% 0px',
          threshold: 0,
        }
      );

      headings.forEach((heading) => {
        const element = document.getElementById(heading.id);
        if (element) observer.observe(element);
      });

      disconnectObserver = () => observer.disconnect();
    };

    const timeout = setTimeout(setupObserver, 250);
    return () => {
      clearTimeout(timeout);
      disconnectObserver?.();
    };
  }, [headings]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth',
      });
      setActiveId(id);
    }
  };

  if (headings.length === 0) return null;

  const mainHeadings = headings.filter((h) => h.level <= 3);

  return (
    <aside
      className={cn(
        'hidden xl:block w-64 shrink-0 sticky top-32 self-start',
        className
      )}
    >
      <div className="space-y-6">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
          Table of Contents
        </h3>

        <div className="space-y-4">
          {mainHeadings.map((heading, idx) => {
            const isActive = activeId === heading.id;
            const number = String(idx + 1).padStart(2, '0');

            return (
              <button
                key={heading.id}
                onClick={() => scrollToSection(heading.id)}
                className="w-full text-left group flex flex-col"
              >
                <div className="flex items-center gap-3 mb-1">
                  <span
                    className={cn(
                      'text-[10px] font-bold transition-colors duration-300',
                      isActive ? 'text-[#BC6C25]' : 'text-slate-300'
                    )}
                  >
                    {number}
                  </span>
                  <div
                    className={cn(
                      'flex-1 h-px transition-all duration-300',
                      isActive ? 'bg-[#BC6C25]' : 'bg-slate-100 group-hover:bg-slate-200'
                    )}
                  />
                </div>

                <span
                  className={cn(
                    'text-xs font-medium transition-all duration-300 line-clamp-2',
                    isActive
                      ? 'text-[#606C38] translate-x-1'
                      : 'text-slate-500 group-hover:text-slate-900'
                  )}
                >
                  {heading.text}
                </span>
              </button>
            );
          })}
        </div>

        {recommendedTitle && (
          <div className="pt-6 border-t border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Recommended
            </p>
            <p className="text-sm font-bold text-[#BC6C25] leading-tight">
              {recommendedTitle}
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
