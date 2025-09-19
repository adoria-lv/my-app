import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET all blog posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const published = searchParams.get('published');
    const limit = searchParams.get('limit');
    const search = searchParams.get('search');

    const where: any = {};

    if (published === 'true') {
      where.published = true;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ];
    }

    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: {
        publishedAt: 'desc'
      },
      take: limit ? parseInt(limit) : undefined
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Kļūda ielādējot blog rakstus' },
      { status: 500 }
    );
  }
}

// POST create new blog post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      slug,
      content,
      image,
      author,
      published,
      tags,
      metaTitle,
      metaDescription
    } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Virsraksts un saturs ir obligāti' },
        { status: 400 }
      );
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        content,
        image,
        author: author || 'Adoria komanda',
        published: published || false,
        publishedAt: published ? new Date() : null,
        tags: tags || [],
        metaTitle,
        metaDescription
      }
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { error: 'Kļūda izveidojot blog rakstu' },
      { status: 500 }
    );
  }
}

// PUT update blog post
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
      title,
      slug,
      content,
      image,
      author,
      published,
      tags,
      metaTitle,
      metaDescription
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ID ir nepieciešams' },
        { status: 400 }
      );
    }

    const updateData: any = {
      title,
      slug,
      content,
      image,
      author,
      published,
      tags,
      metaTitle,
      metaDescription
    };

    // Set publishedAt when publishing for the first time
    if (published) {
      const existingPost = await prisma.blogPost.findUnique({
        where: { id },
        select: { published: true, publishedAt: true }
      });

      if (!existingPost?.published && !existingPost?.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { error: 'Kļūda atjauninot blog rakstu' },
      { status: 500 }
    );
  }
}

// DELETE blog post
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID ir nepieciešams' },
        { status: 400 }
      );
    }

    await prisma.blogPost.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Jaunumu raksts dzēsts' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { error: 'Kļūda dzēšot blog rakstu' },
      { status: 500 }
    );
  }
}