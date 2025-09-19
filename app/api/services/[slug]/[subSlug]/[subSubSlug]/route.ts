import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; subSlug: string; subSubSlug: string }> }
) {
  try {
    const { slug, subSlug, subSubSlug } = await params

    const subSubService = await prisma.subSubService.findFirst({
      where: {
        slug: subSubSlug,
        isActive: true,
        subService: {
          slug: subSlug,
          isActive: true,
          service: {
            href: `/${slug}`,
            isActive: true
          }
        }
      },
      include: {
        subService: {
          include: {
            service: {
              select: {
                id: true,
                title: true,
                icon: true,
                description: true,
                href: true
              }
            }
          }
        }
      }
    })

    if (!subSubService) {
      return NextResponse.json({ error: 'Pakalpojums nav atrasts' }, { status: 404 })
    }

    const response = NextResponse.json(subSubService)
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    response.headers.set('Surrogate-Control', 'no-store')

    return response
  } catch (error) {
    console.error('Error fetching sub-sub-service:', error)
    return NextResponse.json({ error: 'Kļūda ielādējot pakalpojumu' }, { status: 500 })
  }
}