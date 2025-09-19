import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ subServiceId: string }> }
) {
  try {
    const { subServiceId } = await params

    // Verify sub-service exists
    const subService = await prisma.subService.findUnique({
      where: { id: subServiceId }
    })

    if (!subService) {
      return NextResponse.json({ error: 'Apakšpakalpojums nav atrasts' }, { status: 404 })
    }

    // Get FAQs for this sub-service
    const faqs = await prisma.subServiceFAQ.findMany({
      where: { subServiceId },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(faqs)
  } catch (error) {
    console.error('Error fetching sub-service FAQs:', error)
    return NextResponse.json({ error: 'Kļūda ielādējot jautājumus' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ subServiceId: string }> }
) {
  try {
    const { subServiceId } = await params
    const body = await request.json()
    const { question, answer, icon, order, isActive } = body

    // Verify sub-service exists
    const subService = await prisma.subService.findUnique({
      where: { id: subServiceId }
    })

    if (!subService) {
      return NextResponse.json({ error: 'Apakšpakalpojums nav atrasts' }, { status: 404 })
    }

    const faq = await prisma.subServiceFAQ.create({
      data: {
        question,
        answer,
        icon: icon || 'HelpCircle',
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true,
        subServiceId
      }
    })

    return NextResponse.json(faq)
  } catch (error) {
    console.error('Error creating sub-service FAQ:', error)
    return NextResponse.json({ error: 'Kļūda izveidojot jautājumu' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ subServiceId: string }> }
) {
  try {
    const { subServiceId } = await params
    const body = await request.json()
    const { id, question, answer, icon, order, isActive } = body

    // Verify the FAQ belongs to this sub-service
    const existingFaq = await prisma.subServiceFAQ.findFirst({
      where: { id, subServiceId }
    })

    if (!existingFaq) {
      return NextResponse.json({ error: 'FAQ nav atrasts' }, { status: 404 })
    }

    const faq = await prisma.subServiceFAQ.update({
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
    console.error('Error updating sub-service FAQ:', error)
    return NextResponse.json({ error: 'Kļūda atjauninot jautājumu' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ subServiceId: string }> }
) {
  try {
    const { subServiceId } = await params
    const body = await request.json()
    const { id } = body

    // Verify the FAQ belongs to this sub-service
    const existingFaq = await prisma.subServiceFAQ.findFirst({
      where: { id, subServiceId }
    })

    if (!existingFaq) {
      return NextResponse.json({ error: 'FAQ nav atrasts' }, { status: 404 })
    }

    await prisma.subServiceFAQ.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting sub-service FAQ:', error)
    return NextResponse.json({ error: 'Kļūda dzēšot jautājumu' }, { status: 500 })
  }
}