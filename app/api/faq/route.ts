import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const faqs = await prisma.fAQ.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    })

    const response = NextResponse.json(faqs)
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    response.headers.set('Surrogate-Control', 'no-store')

    return response
  } catch (error) {
    console.error('Error fetching FAQs:', error)
    return NextResponse.json({ error: 'Kļūda ielādējot FAQ' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const faq = await prisma.fAQ.create({
      data: {
        question: data.question,
        answer: data.answer,
        category: data.category,
        icon: data.icon || 'HelpCircle',
        order: data.order || 0,
        isActive: data.isActive ?? true,
      }
    })
    return NextResponse.json(faq)
  } catch (error) {
    console.error('Error creating FAQ:', error)
    return NextResponse.json({ error: 'Kļūda izveidojot FAQ' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const faq = await prisma.fAQ.update({
      where: { id: data.id },
      data: {
        question: data.question,
        answer: data.answer,
        category: data.category,
        icon: data.icon,
        order: data.order,
        isActive: data.isActive,
      }
    })
    return NextResponse.json(faq)
  } catch (error) {
    console.error('Error updating FAQ:', error)
    return NextResponse.json({ error: 'Kļūda atjauninot FAQ' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Nav ID' }, { status: 400 })
    }

    await prisma.fAQ.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting FAQ:', error)
    return NextResponse.json({ error: 'Kļūda dzēšot FAQ' }, { status: 500 })
  }
}