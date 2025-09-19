import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ serviceId: string }> }
) {
  try {
    const { serviceId } = await params

    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      select: {
        id: true,
        title: true,
        href: true,
        description: true,
        isActive: true
      }
    })

    if (!service) {
      return NextResponse.json({ error: 'Pakalpojums nav atrasts' }, { status: 404 })
    }

    return NextResponse.json(service)
  } catch (error) {
    console.error('Error fetching service:', error)
    return NextResponse.json({ error: 'Kļūda ielādējot pakalpojumu' }, { status: 500 })
  }
}