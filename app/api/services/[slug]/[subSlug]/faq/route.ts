import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; subSlug: string }> }
) {
  try {
    const { slug, subSlug } = await params

    // First find the sub-service
    const subService = await prisma.subService.findFirst({
      where: {
        slug: subSlug,
        isActive: true,
        service: {
          href: `/${slug}`,
          isActive: true
        }
      }
    })

    if (!subService) {
      return NextResponse.json({ error: 'Pakalpojums nav atrasts' }, { status: 404 })
    }

    // Get FAQs for this sub-service
    const faqs = await prisma.subServiceFAQ.findMany({
      where: {
        subServiceId: subService.id,
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
    console.error('Error fetching sub-service FAQs:', error)
    return NextResponse.json({ error: 'Kļūda ielādējot jautājumus' }, { status: 500 })
  }
}