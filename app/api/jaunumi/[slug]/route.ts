import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    const post = await prisma.blogPost.findFirst({
      where: {
        OR: [
          { slug },
          { id: slug }
        ]
      }
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Jaunumu raksts nav atrasts' },
        { status: 404 }
      );
    }

    // Increment view count
    await prisma.blogPost.update({
      where: { id: post.id },
      data: { views: post.views + 1 }
    });

    return NextResponse.json({
      ...post,
      views: post.views + 1
    });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { error: 'Kļūda ielādējot blog rakstu' },
      { status: 500 }
    );
  }
}