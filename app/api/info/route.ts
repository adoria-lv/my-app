import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const infoSection = await prisma.infoSection.findFirst({
      where: { isActive: true },
      include: {
        highlights: {
          where: { isActive: true },
          orderBy: { order: 'asc' }
        }
      }
    })

    return NextResponse.json(infoSection)
  } catch (error) {
    console.error('Error fetching info section:', error)
    return NextResponse.json({ error: 'Failed to fetch info section' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, title, subtitle, content, highlights } = body

    // Update info section
    const updatedSection = await prisma.infoSection.update({
      where: { id },
      data: {
        title,
        subtitle,
        content
      }
    })

    // Delete existing highlights and create new ones
    await prisma.infoHighlight.deleteMany({
      where: { sectionId: id }
    })

    if (highlights && highlights.length > 0) {
      await prisma.infoHighlight.createMany({
        data: highlights.map((highlight: any, index: number) => ({
          ...highlight,
          sectionId: id,
          order: index
        }))
      })
    }

    // Fetch updated section with highlights
    const result = await prisma.infoSection.findUnique({
      where: { id },
      include: {
        highlights: {
          where: { isActive: true },
          orderBy: { order: 'asc' }
        }
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error updating info section:', error)
    return NextResponse.json({ error: 'Failed to update info section' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, subtitle, content, highlights } = body

    // Create info section
    const newSection = await prisma.infoSection.create({
      data: {
        title,
        subtitle,
        content
      }
    })

    // Create highlights
    if (highlights && highlights.length > 0) {
      await prisma.infoHighlight.createMany({
        data: highlights.map((highlight: any, index: number) => ({
          ...highlight,
          sectionId: newSection.id,
          order: index
        }))
      })
    }

    // Fetch created section with highlights
    const result = await prisma.infoSection.findUnique({
      where: { id: newSection.id },
      include: {
        highlights: {
          where: { isActive: true },
          orderBy: { order: 'asc' }
        }
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error creating info section:', error)
    return NextResponse.json({ error: 'Failed to create info section' }, { status: 500 })
  }
}