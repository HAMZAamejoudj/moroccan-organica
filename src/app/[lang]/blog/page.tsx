import { getDictionary } from "@/lib/dictionaries";
import { getPublishedPosts, getBlogCategories } from "@/lib/blog/actions";
import { BlogPageClient } from "./BlogPageClient";
import type { BlogPostFull, BlogCategory } from "@/types/blog";

export const revalidate = 2592000; // 30 days ISR (on-demand revalidation handles edits)

const stripHtml = (html: string | null | undefined, maxLen = 220): string => {
    if (!html || typeof html !== 'string') return '';
    return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, maxLen);
};

export default async function BlogPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;

    let posts: BlogPostFull[] = [];
    let categories: BlogCategory[] = [];
    const dict = (await getDictionary(lang, 'blog')) as Record<string, unknown>;

    try {
        const [postsResult, categoriesResult] = await Promise.all([
            getPublishedPosts({ page: 1, pageSize: 200 }),
            getBlogCategories(),
        ]);

        // Strip heavy full article bodies so /blog HTML stays lightweight
        posts = postsResult.posts.map((post) => ({
            ...post,
            content: stripHtml(post.content),
            content_ar: stripHtml(post.content_ar),
            content_fr: stripHtml(post.content_fr),
        }));
        categories = categoriesResult;
    } catch (error) {
        console.error('Error fetching blog data:', error);
    }

    return (
        <BlogPageClient
            lang={lang}
            dict={dict}
            initialPosts={posts}
            categories={categories}
        />
    );
}
