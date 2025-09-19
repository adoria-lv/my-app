import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const subSubServices = await prisma.subSubService.findMany({
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
      },
      orderBy: [
        { subService: { service: { order: 'asc' } } },
        { subService: { order: 'asc' } },
        { order: 'asc' }
      ]
    })

    const response = NextResponse.json(subSubServices)
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    response.headers.set('Surrogate-Control', 'no-store')

    return response
  } catch (error) {
    console.error('Error fetching sub-sub-services:', error)
    return NextResponse.json({ error: 'Kļūda ielādējot apakš-apakšpakalpojumus' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, duration, price, content, slug, subServiceId, order, isActive } = body

    // Check if slug is unique within the sub-service
    const existingSubSubService = await prisma.subSubService.findFirst({
      where: {
        slug: slug,
        subServiceId: subServiceId
      }
    })

    if (existingSubSubService) {
      return NextResponse.json({ error: 'Apakš-apakšpakalpojums ar šādu slug jau eksistē šajā apakšpakalpojumā' }, { status: 400 })
    }

    const subSubService = await prisma.subSubService.create({
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
    console.error('Error creating sub-sub-service:', error)
    return NextResponse.json({ error: 'Kļūda izveidojot apakš-apakšpakalpojumu' }, { status: 500 })
  }
}