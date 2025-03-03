import { NextResponse } from 'next/server';
import { getDocBySlug } from '@/lib/docs';

/**
 * API route to get document content by slug
 * @param request The request object
 * @returns JSON response with document content
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json(
      { error: 'Slug parameter is required' },
      { status: 400 }
    );
  }

  try {
    const doc = await getDocBySlug(slug);
    
    if (!doc) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      content: doc.content,
      slug: doc.slug
    });
  } catch (error) {
    console.error(`Error fetching document content for slug: ${slug}`, error);
    return NextResponse.json(
      { error: 'Failed to fetch document content' },
      { status: 500 }
    );
  }
} 