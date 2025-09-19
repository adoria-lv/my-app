import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    // First find the service
    const service = await prisma.service.findFirst({
      where: {
        href: `/${slug}`,
        isActive: true
      }
    })

    if (!service) {
      return NextResponse.json({ error: 'Pakalpojums nav atrasts' }, { status: 404 })
    }

    // Get FAQs for this service
    const faqs = await prisma.serviceFAQ.findMany({
      where: {
        serviceId: service.id,
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
    console.error('Error fetching service FAQs:', error)
    return NextResponse.json({ error: 'Kļūda ielādējot jautājumus' }, { status: 500 })
  }
}