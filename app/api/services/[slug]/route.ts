import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params

    const service = await prisma.service.findFirst({
      where: {
        href: `/${slug}`,
        isActive: true
      },
      include: {
        subServices: {
          where: { isActive: true },
          orderBy: { order: 'asc' }
        }
      }
    })

    if (!service) {
      return NextResponse.json({ error: 'Pakalpojums nav atrasts' }, { status: 404 })
    }

    const response = NextResponse.json(service)
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    response.headers.set('Surrogate-Control', 'no-store')

    return response
  } catch (error) {
    console.error('Error fetching service:', error)
    return NextResponse.json({ error: 'Kļūda ielādējot pakalpojumu' }, { status: 500 })
  }
}