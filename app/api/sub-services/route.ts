import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeSubSub = searchParams.get('includeSubSub') === 'true'

    const subServices = await prisma.subService.findMany({
      include: {
        service: {
          select: {
            id: true,
            title: true,
            href: true
          }
        },
        ...(includeSubSub && {
          subSubServices: {
            orderBy: { order: 'asc' }
          }
        })
      },
      orderBy: [
        { service: { order: 'asc' } },
        { order: 'asc' }
      ]
    })

    const response = NextResponse.json(subServices)
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    response.headers.set('Surrogate-Control', 'no-store')

    return response
  } catch (error) {
    console.error('Error fetching sub-services:', error)
    return NextResponse.json({ error: 'Kļūda ielādējot apakšpakalpojumus' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, gallery1, gallery2, gallery3, gallery4, duration, price, content, slug, serviceId, order, isActive } = body

    // Check if slug is unique within the service
    const existingSubService = await prisma.subService.findFirst({
      where: {
        slug: slug,
        serviceId: serviceId
      }
    })

    if (existingSubService) {
      return NextResponse.json({ error: 'Apakšpakalpojums ar šādu slug jau eksistē šajā pakalpojumā' }, { status: 400 })
    }

    const subService = await prisma.subService.create({
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
        isActive: isActive !== false
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
    console.error('Error creating sub-service:', error)
    return NextResponse.json({ error: 'Kļūda izveidojot apakšpakalpojumu' }, { status: 500 })
  }
}