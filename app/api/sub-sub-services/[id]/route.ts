import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const subSubService = await prisma.subSubService.findUnique({
      where: { id },
      include: {
        subService: {
          include: {
            service: {
              select: {
                id: true,
                title: true,
                href: true
              }
            }
          }
        }
      }
    })

    if (!subSubService) {
      return NextResponse.json({ error: 'Apakš-apakšpakalpojums nav atrasts' }, { status: 404 })
    }

    const response = NextResponse.json(subSubService)
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    response.headers.set('Surrogate-Control', 'no-store')

    return response
  } catch (error) {
    console.error('Error fetching sub-sub-service:', error)
    return NextResponse.json({ error: 'Kļūda ielādējot apakš-apakšpakalpojumu' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, description, duration, price, content, slug, subServiceId, order, isActive } = body

    // Check if slug is unique within the sub-service (excluding current record)
    const existingSubSubService = await prisma.subSubService.findFirst({
      where: {
        slug: slug,
        subServiceId: subServiceId,
        id: { not: id }
      }
    })

    if (existingSubSubService) {
      return NextResponse.json({ error: 'Apakš-apakšpakalpojums ar šādu slug jau eksistē šajā apakšpakalpojumā' }, { status: 400 })
    }

    const subSubService = await prisma.subSubService.update({
      where: { id },
      data: {
        title,
        description,
        duration,
        price,
        content,
        slug,
        subServiceId,
        order: parseInt(order) || 0,
        isActive: isActive !== false
      },
      include: {
        subService: {
          include: {
            service: {
              select: {
                id: true,
                title: true,
                href: true
              }
            }
          }
        }
      }
    })

    const response = NextResponse.json(subSubService)
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    response.headers.set('Surrogate-Control', 'no-store')

    return response
  } catch (error) {
    console.error('Error updating sub-sub-service:', error)
    return NextResponse.json({ error: 'Kļūda atjauninot apakš-apakšpakalpojumu' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.subSubService.delete({
      where: { id }
    })

    const response = NextResponse.json({ message: 'Apakš-apakšpakalpojums veiksmīgi dzēsts' })
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    response.headers.set('Surrogate-Control', 'no-store')

    return response
  } catch (error) {
    console.error('Error deleting sub-sub-service:', error)
    return NextResponse.json({ error: 'Kļūda dzēšot apakš-apakšpakalpojumu' }, { status: 500 })
  }
}