// app/api/slider/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { deleteFromS3 } from '@/lib/s3-upload'

export async function GET() {
  try {
    const slides = await prisma.slider.findMany({
      orderBy: { order: 'asc' }
    })
    return NextResponse.json(slides)
  } catch (error) {
    return NextResponse.json({ error: 'Kļūda ielādējot slaidus' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const slide = await prisma.slider.create({
      data: {
        title: data.title,
        subtitle: data.subtitle,
        image: data.image,
        mobileImage: data.mobileImage,
        ctaText: data.ctaText,
        ctaLink: data.ctaLink,
        order: data.order,
        isActive: data.isActive ?? true,
      }
    })
    return NextResponse.json(slide)
  } catch (error) {
    return NextResponse.json({ error: 'Kļūda izveidojot slaidu' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const slide = await prisma.slider.update({
      where: { id: data.id },
      data: {
        title: data.title,
        subtitle: data.subtitle,
        image: data.image,
        mobileImage: data.mobileImage,
        ctaText: data.ctaText,
        ctaLink: data.ctaLink,
        order: data.order,
        isActive: data.isActive,
      }
    })
    return NextResponse.json(slide)
  } catch (error) {
    return NextResponse.json({ error: 'Kļūda atjauninot slaidu' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Nav ID' }, { status: 400 })
    }

    // Get slide to delete images from S3
    const slide = await prisma.slider.findUnique({ where: { id } })
    
    if (slide) {
      // Delete images from S3
      if (slide.image) await deleteFromS3(slide.image)
      if (slide.mobileImage) await deleteFromS3(slide.mobileImage)
    }

    await prisma.slider.delete({ where: { id } })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Kļūda dzēšot slaidu' }, { status: 500 })
  }
}
