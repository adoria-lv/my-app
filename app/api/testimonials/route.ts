import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { deleteFromS3 } from '@/lib/s3-upload'

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    })
    const formattedTestimonials = testimonials.map(t => ({
      ...t,
      date: t.date.toISOString().split('T')[0],
    }))
    return NextResponse.json(formattedTestimonials)
  } catch (error) {
    return NextResponse.json({ error: 'Kļūda ielādējot atsauksmes' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const testimonial = await prisma.testimonial.create({
      data: {
        name: data.name,
        text: data.text,
        rating: data.rating,
        avatar: data.avatar,
        service: data.service,
        date: data.date ? new Date(data.date) : new Date(),
        order: data.order,
        isActive: data.isActive ?? true,
      }
    })
    const formattedTestimonial = {
      ...testimonial,
      date: testimonial.date.toISOString().split('T')[0],
    }
    return NextResponse.json(formattedTestimonial)
  } catch (error) {
    return NextResponse.json({ error: 'Kļūda izveidojot atsauksmi' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const testimonial = await prisma.testimonial.update({
      where: { id: data.id },
      data: {
        name: data.name,
        text: data.text,
        rating: data.rating,
        avatar: data.avatar,
        service: data.service,
        date: data.date ? new Date(data.date) : undefined,
        order: data.order,
        isActive: data.isActive,
      }
    })
    const formattedTestimonial = {
      ...testimonial,
      date: testimonial.date.toISOString().split('T')[0],
    }
    return NextResponse.json(formattedTestimonial)
  } catch (error) {
    return NextResponse.json({ error: 'Kļūda atjauninot atsauksmi' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Nav ID' }, { status: 400 })
    }

    // Get testimonial to potentially delete avatar from S3
    const testimonial = await prisma.testimonial.findUnique({ where: { id } })
    
    if (testimonial && testimonial.avatar && testimonial.avatar.includes('amazonaws.com')) {
      await deleteFromS3(testimonial.avatar)
    }

    await prisma.testimonial.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Kļūda dzēšot atsauksmi' }, { status: 500 })
  }
}
