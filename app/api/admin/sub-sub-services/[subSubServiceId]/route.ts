import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ subSubServiceId: string }> }
) {
  try {
    const { subSubServiceId } = await params

    const subSubService = await prisma.subSubService.findUnique({
      where: { id: subSubServiceId },
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

    if (!subSubService) {
      return NextResponse.json({ error: 'Apakš-apakšpakalpojums nav atrasts' }, { status: 404 })
    }

    return NextResponse.json(subSubService)
  } catch (error) {
    console.error('Error fetching sub-sub-service:', error)
    return NextResponse.json({ error: 'Kļūda ielādējot apakš-apakšpakalpojumu' }, { status: 500 })
  }
}