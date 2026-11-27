import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { CACHE_TAGS } from '@/lib/cache-tags';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    const expectedSecret = process.env.REVALIDATE_SECRET || process.env.NEXTAUTH_SECRET;

    const hasValidSecret = Boolean(expectedSecret && secret && secret === expectedSecret);
    if (!hasValidSecret) {
      const session = await getServerSession(authOptions);
      if ((session?.user as any)?.role !== 'ADMIN') {
        return NextResponse.json({ revalidated: false, error: 'Unauthorized' }, { status: 401 });
      }
    }

    const tag = searchParams.get('tag');
    const path = searchParams.get('path');

    if (tag) {
      revalidateTag(tag, 'default');
    } else {
      revalidateTag(CACHE_TAGS.PRODUCTS, 'default');
      revalidateTag('products', 'default');
      revalidateTag(CACHE_TAGS.BLOG_POSTS, 'default');
      revalidateTag('blog_posts', 'default');
    }

    if (path) {
      revalidatePath(path);
    } else {
      revalidatePath('/', 'layout');
    }

    return NextResponse.json({
      revalidated: true,
      tag: tag || CACHE_TAGS.PRODUCTS,
      now: Date.now(),
    });
  } catch (err: any) {
    return NextResponse.json({ revalidated: false, error: err.message }, { status: 500 });
  }
}
