import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const quickLinks = await prisma.quickLink.findMany({
      orderBy: { order: 'asc' }
    })
    return NextResponse.json(quickLinks)
  } catch (error) {
    return NextResponse.json({ error: 'Kļūda ielādējot ātrās saites' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const quickLink = await prisma.quickLink.create({
      data: {
        label: data.label,
        href: data.href,
        order: data.order,
        isActive: data.isActive ?? true,
      }
    })
    return NextResponse.json(quickLink)
  } catch (error) {
    console.error('Quick link creation error:', error)
    return NextResponse.json({ error: 'Kļūda izveidojot ātro saiti' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()

    const quickLink = await prisma.quickLink.update({
      where: { id: data.id },
      data: {
        label: data.label,
        href: data.href,
        order: data.order,
        isActive: data.isActive,
      }
    })
    return NextResponse.json(quickLink)
  } catch (error) {
    console.error('Quick link update error:', error)
    return NextResponse.json({ error: 'Kļūda atjauninot ātro saiti' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Nav ID' }, { status: 400 })
    }

    await prisma.quickLink.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Quick link deletion error:', error)
    return NextResponse.json({ error: 'Kļūda dzēšot ātro saiti' }, { status: 500 })
  }
}