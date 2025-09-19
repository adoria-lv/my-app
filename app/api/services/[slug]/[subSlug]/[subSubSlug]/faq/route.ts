import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; subSlug: string; subSubSlug: string }> }
) {
  try {
    const { slug, subSlug, subSubSlug } = await params

    // First find the sub-sub-service
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
      }
    })

    if (!subSubService) {
      return NextResponse.json({ error: 'Pakalpojums nav atrasts' }, { status: 404 })
    }

    // Get FAQs for this sub-sub-service
    const faqs = await prisma.subSubServiceFAQ.findMany({
      where: {
        subSubServiceId: subSubService.id,
        isActive: true
      },
      orderBy: { order: 'asc' }
    })

    const response = NextResponse.json(faqs)
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    response.headers.set('Surrogate-Control', 'no-store')

    return response
  } catch (error) {
    console.error('Error fetching sub-sub-service FAQs:', error)
    return NextResponse.json({ error: 'Kļūda ielādējot jautājumus' }, { status: 500 })
  }
}