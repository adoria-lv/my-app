import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, description, gallery1, gallery2, gallery3, gallery4, duration, price, content, slug, serviceId, order, isActive } = body

    // Check if slug is unique within the service (excluding current record)
    const existingSubService = await prisma.subService.findFirst({
      where: {
        slug: slug,
        serviceId: serviceId,
        NOT: {
          id: id
        }
      }
    })

    if (existingSubService) {
      return NextResponse.json({ error: 'Apakšpakalpojums ar šādu slug jau eksistē šajā pakalpojumā' }, { status: 400 })
    }

    const subService = await prisma.subService.update({
      where: { id },
      data: {
        title,
        description,
        gallery1: gallery1 || null,
        gallery2: gallery2 || null,
        gallery3: gallery3 || null,
        gallery4: gallery4 || null,
        duration,
        price,
        content,
        slug,
        serviceId,
        order: parseInt(order) || 0,
        isActive
      },
      include: {
        service: {
          select: {
            id: true,
            title: true,
            href: true
          }
        }
      }
    })

    const response = NextResponse.json(subService)
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    response.headers.set('Surrogate-Control', 'no-store')

    return response
  } catch (error) {
    console.error('Error updating sub-service:', error)
    return NextResponse.json({ error: 'Kļūda atjauninot apakšpakalpojumu' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.subService.delete({
      where: { id }
    })

    const response = NextResponse.json({ success: true })
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    response.headers.set('Surrogate-Control', 'no-store')

    return response
  } catch (error) {
    console.error('Error deleting sub-service:', error)
    return NextResponse.json({ error: 'Kļūda dzēšot apakšpakalpojumu' }, { status: 500 })
  }
}