import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ subServiceId: string }> }
) {
  try {
    const { subServiceId } = await params

    const subService = await prisma.subService.findUnique({
      where: { id: subServiceId },
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

    if (!subService) {
      return NextResponse.json({ error: 'Apakšpakalpojums nav atrasts' }, { status: 404 })
    }

    return NextResponse.json(subService)
  } catch (error) {
    console.error('Error fetching sub-service:', error)
    return NextResponse.json({ error: 'Kļūda ielādējot apakšpakalpojumu' }, { status: 500 })
  }
}