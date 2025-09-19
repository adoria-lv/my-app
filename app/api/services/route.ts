import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { deleteFromS3 } from '@/lib/s3-upload'

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      include: {
        subServices: {
          where: { isActive: true },
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { order: 'asc' }
    })
    return NextResponse.json(services)
  } catch (error) {
    return NextResponse.json({ error: 'Kļūda ielādējot pakalpojumus' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const service = await prisma.service.create({
      data: {
        title: data.title,
        icon: data.icon,
        backgroundImage: data.backgroundImage,
        titleColor: data.titleColor,
        description: data.description,
        href: data.href,
        order: data.order,
        isActive: data.isActive ?? true,
      }
    })
    return NextResponse.json(service)
  } catch (error) {
    console.error('Service creation error:', error)
    return NextResponse.json({ error: 'Kļūda izveidojot pakalpojumu' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()

    const service = await prisma.service.update({
      where: { id: data.id },
      data: {
        title: data.title,
        icon: data.icon,
        backgroundImage: data.backgroundImage,
        titleColor: data.titleColor,
        description: data.description,
        href: data.href,
        order: data.order,
        isActive: data.isActive,
      }
    })
    return NextResponse.json(service)
  } catch (error) {
    console.error('Service update error:', error)
    return NextResponse.json({ error: 'Kļūda atjauninot pakalpojumu' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Nav ID' }, { status: 400 })
    }

    // Get service to potentially delete icon from S3
    const service = await prisma.service.findUnique({ where: { id } })
    
    if (service && service.icon && service.icon.includes('amazonaws.com')) {
      // Delete icon from S3 if it's stored there
      await deleteFromS3(service.icon)
    }

    await prisma.service.delete({ where: { id } })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Service deletion error:', error)
    return NextResponse.json({ error: 'Kļūda dzēšot pakalpojumu' }, { status: 500 })
  }
}
