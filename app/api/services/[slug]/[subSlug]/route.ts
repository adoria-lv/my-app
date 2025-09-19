import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; subSlug: string }> }
) {
  try {
    const { slug, subSlug } = await params

    const { searchParams } = new URL(request.url)
    const includeSubSub = searchParams.get('includeSubSub') === 'true'

    const subService = await prisma.subService.findFirst({
      where: {
        slug: subSlug,
        isActive: true,
        service: {
          href: `/${slug}`,
          isActive: true
        }
      },
      include: {
        service: {
          select: {
            id: true,
            title: true,
            icon: true,
            description: true,
            href: true
          }
        },
        ...(includeSubSub && {
          subSubServices: {
            where: { isActive: true },
            orderBy: { order: 'asc' }
          }
        })
      }
    })

    if (!subService) {
      return NextResponse.json({ error: 'Pakalpojums nav atrasts' }, { status: 404 })
    }

    const response = NextResponse.json(subService)
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    response.headers.set('Surrogate-Control', 'no-store')

    return response
  } catch (error) {
    console.error('Error fetching sub-service:', error)
    return NextResponse.json({ error: 'Kļūda ielādējot pakalpojumu' }, { status: 500 })
  }
}