import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ subSubServiceId: string }> }
) {
  try {
    const { subSubServiceId } = await params

    // Verify sub-sub-service exists
    const subSubService = await prisma.subSubService.findUnique({
      where: { id: subSubServiceId }
    })

    if (!subSubService) {
      return NextResponse.json({ error: 'Apakš-apakšpakalpojums nav atrasts' }, { status: 404 })
    }

    // Get FAQs for this sub-sub-service
    const faqs = await prisma.subSubServiceFAQ.findMany({
      where: { subSubServiceId },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(faqs)
  } catch (error) {
    console.error('Error fetching sub-sub-service FAQs:', error)
    return NextResponse.json({ error: 'Kļūda ielādējot jautājumus' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ subSubServiceId: string }> }
) {
  try {
    const { subSubServiceId } = await params
    const body = await request.json()
    const { question, answer, icon, order, isActive } = body

    // Verify sub-sub-service exists
    const subSubService = await prisma.subSubService.findUnique({
      where: { id: subSubServiceId }
    })

    if (!subSubService) {
      return NextResponse.json({ error: 'Apakš-apakšpakalpojums nav atrasts' }, { status: 404 })
    }

    const faq = await prisma.subSubServiceFAQ.create({
      data: {
        question,
        answer,
        icon: icon || 'HelpCircle',
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true,
        subSubServiceId
      }
    })

    return NextResponse.json(faq)
  } catch (error) {
    console.error('Error creating sub-sub-service FAQ:', error)
    return NextResponse.json({ error: 'Kļūda izveidojot jautājumu' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ subSubServiceId: string }> }
) {
  try {
    const { subSubServiceId } = await params
    const body = await request.json()
    const { id, question, answer, icon, order, isActive } = body

    // Verify the FAQ belongs to this sub-sub-service
    const existingFaq = await prisma.subSubServiceFAQ.findFirst({
      where: { id, subSubServiceId }
    })

    if (!existingFaq) {
      return NextResponse.json({ error: 'FAQ nav atrasts' }, { status: 404 })
    }

    const faq = await prisma.subSubServiceFAQ.update({
      where: { id },
      data: {
        question,
        answer,
        icon,
        order,
        isActive
      }
    })

    return NextResponse.json(faq)
  } catch (error) {
    console.error('Error updating sub-sub-service FAQ:', error)
    return NextResponse.json({ error: 'Kļūda atjauninot jautājumu' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ subSubServiceId: string }> }
) {
  try {
    const { subSubServiceId } = await params
    const body = await request.json()
    const { id } = body

    // Verify the FAQ belongs to this sub-sub-service
    const existingFaq = await prisma.subSubServiceFAQ.findFirst({
      where: { id, subSubServiceId }
    })

    if (!existingFaq) {
      return NextResponse.json({ error: 'FAQ nav atrasts' }, { status: 404 })
    }

    await prisma.subSubServiceFAQ.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting sub-sub-service FAQ:', error)
    return NextResponse.json({ error: 'Kļūda dzēšot jautājumu' }, { status: 500 })
  }
}