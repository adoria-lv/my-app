import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ serviceId: string }> }
) {
  try {
    const { serviceId } = await params

    // Verify service exists
    const service = await prisma.service.findUnique({
      where: { id: serviceId }
    })

    if (!service) {
      return NextResponse.json({ error: 'Pakalpojums nav atrasts' }, { status: 404 })
    }

    // Get FAQs for this service
    const faqs = await prisma.serviceFAQ.findMany({
      where: { serviceId },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(faqs)
  } catch (error) {
    console.error('Error fetching service FAQs:', error)
    return NextResponse.json({ error: 'Kļūda ielādējot jautājumus' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ serviceId: string }> }
) {
  try {
    const { serviceId } = await params
    const body = await request.json()
    const { question, answer, icon, order, isActive } = body

    // Verify service exists
    const service = await prisma.service.findUnique({
      where: { id: serviceId }
    })

    if (!service) {
      return NextResponse.json({ error: 'Pakalpojums nav atrasts' }, { status: 404 })
    }

    const faq = await prisma.serviceFAQ.create({
      data: {
        question,
        answer,
        icon: icon || 'HelpCircle',
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true,
        serviceId
      }
    })

    return NextResponse.json(faq)
  } catch (error) {
    console.error('Error creating service FAQ:', error)
    return NextResponse.json({ error: 'Kļūda izveidojot jautājumu' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ serviceId: string }> }
) {
  try {
    const { serviceId } = await params
    const body = await request.json()
    const { id, question, answer, icon, order, isActive } = body

    // Verify the FAQ belongs to this service
    const existingFaq = await prisma.serviceFAQ.findFirst({
      where: { id, serviceId }
    })

    if (!existingFaq) {
      return NextResponse.json({ error: 'FAQ nav atrasts' }, { status: 404 })
    }

    const faq = await prisma.serviceFAQ.update({
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
    console.error('Error updating service FAQ:', error)
    return NextResponse.json({ error: 'Kļūda atjauninot jautājumu' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ serviceId: string }> }
) {
  try {
    const { serviceId } = await params
    const body = await request.json()
    const { id } = body

    // Verify the FAQ belongs to this service
    const existingFaq = await prisma.serviceFAQ.findFirst({
      where: { id, serviceId }
    })

    if (!existingFaq) {
      return NextResponse.json({ error: 'FAQ nav atrasts' }, { status: 404 })
    }

    await prisma.serviceFAQ.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting service FAQ:', error)
    return NextResponse.json({ error: 'Kļūda dzēšot jautājumu' }, { status: 500 })
  }
}