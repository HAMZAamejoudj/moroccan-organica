'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { BlogHero } from "@/components/blog/BlogHero";
import { BlogCard } from "@/components/blog/BlogCard";
import { FilterSidebar } from "@/components/blog/FilterSidebar";
import { BlogPagination } from "@/components/blog/BlogPagination";
import { BlogEmptyState } from "@/components/blog/BlogEmptyState";
import type { BlogPostFull, BlogCategory } from "@/types/blog";

const POSTS_PER_PAGE = 9;

interface BlogPageClientProps {
    lang: string;
    dict: Record<string, unknown>;
    initialPosts: BlogPostFull[];
    categories: BlogCategory[];
}

export function BlogPageClient({
    lang,
    dict,
    initialPosts,
    categories,
}: BlogPageClientProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const filteredPosts = useMemo(() => {
        const term = searchTerm.toLowerCase().trim();
        return initialPosts.filter((post) => {
            const matchesCategory = !selectedCategory || post.category_id === selectedCategory;
            if (!matchesCategory) return false;
            if (!term) return true;

            return (
                (post.title || '').toLowerCase().includes(term) ||
                (post.title_ar || '').toLowerCase().includes(term) ||
                (post.title_fr || '').toLowerCase().includes(term) ||
                (post.excerpt || '').toLowerCase().includes(term) ||
                (post.excerpt_ar || '').toLowerCase().includes(term) ||
                (post.excerpt_fr || '').toLowerCase().includes(term)
            );
        });
    }, [initialPosts, selectedCategory, searchTerm]);

    const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    const paginatedPosts = useMemo(() => {
        const start = (currentPage - 1) * POSTS_PER_PAGE;
        return filteredPosts.slice(start, start + POSTS_PER_PAGE);
    }, [filteredPosts, currentPage]);

    const handleSearchChange = useCallback((val: string) => {
        setSearchTerm(val);
        setCurrentPage(1);
    }, []);

    const handleCategoryChange = useCallback((cat: string | null) => {
        setSelectedCategory(cat);
        setCurrentPage(1);
    }, []);

    const handleClearFilters = useCallback(() => {
        setSelectedCategory(null);
        setSearchTerm('');
        setCurrentPage(1);
    }, []);

    return (
        <main className="min-h-screen bg-slate-50/50">
            <BlogHero
                title={dict.title as string}
                subtitle={dict.subtitle as string}
                searchPlaceholder={dict.searchPlaceholder as string}
                searchValue={searchTerm}
                onSearchChange={handleSearchChange}
                banner={dict.banner as any}
                lang={lang}
            />

            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
                    {/* Sidebar */}
                    <div className="w-full lg:w-1/4 xl:w-1/5 lg:pr-4 xl:pr-6">
                        <FilterSidebar
                            categories={categories}
                            selectedCategory={selectedCategory}
                            onCategoryChange={handleCategoryChange}
                            onClearFilters={handleClearFilters}
                            translations={{
                                title: (dict.filtersLabel as string) || (dict.categories as string),
                                category: (dict.categoryLabel as string) || (dict.category as string),
                                allCategories: dict.allCategories as string,
                                clearFilters: dict.clearFilters as string,
                            }}
                        />
                    </div>

                    {/* Content */}
                    <div className="w-full lg:w-3/4 xl:w-4/5">
                        {paginatedPosts.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                    {paginatedPosts.map((post) => (
                                        <BlogCard
                                            key={post.id}
                                            post={post}
                                            lang={lang}
                                            translations={{
                                                readMore: dict.readMore as string,
                                            }}
                                        />
                                    ))}
                                </div>
                                {totalPages > 1 && (
                                    <div className="flex justify-center pt-10">
                                        <BlogPagination
                                            currentPage={currentPage}
                                            totalPages={totalPages}
                                            onPageChange={setCurrentPage}
                                        />
                                    </div>
                                )}
                            </>
                        ) : (
                            <BlogEmptyState
                                title={dict.noResults as string}
                                description={dict.subtitle as string}
                                showClearButton={!!selectedCategory || !!searchTerm}
                                clearButtonText={dict.clearFilters as string}
                                onClear={handleClearFilters}
                            />
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
