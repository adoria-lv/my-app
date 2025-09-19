import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const stats = await prisma.experienceStats.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    })

    const response = NextResponse.json(stats)
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    response.headers.set('Surrogate-Control', 'no-store')

    return response
  } catch (error) {
    console.error('Error fetching experience stats:', error)
    return NextResponse.json({ error: 'Kļūda ielādējot statistiku' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const stat = await prisma.experienceStats.create({
      data: {
        title: data.title,
        number: data.number,
        suffix: data.suffix,
        label: data.label,
        iconType: data.iconType,
        color: data.color,
        order: data.order,
        isActive: data.isActive ?? true,
      }
    })
    return NextResponse.json(stat)
  } catch (error) {
    return NextResponse.json({ error: 'Kļūda izveidojot statistiku' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const stat = await prisma.experienceStats.update({
      where: { id: data.id },
      data: {
        title: data.title,
        number: data.number,
        suffix: data.suffix,
        label: data.label,
        iconType: data.iconType,
        color: data.color,
        order: data.order,
        isActive: data.isActive,
      }
    })
    return NextResponse.json(stat)
  } catch (error) {
    return NextResponse.json({ error: 'Kļūda atjauninot statistiku' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Nav ID' }, { status: 400 })
    }

    await prisma.experienceStats.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Kļūda dzēšot statistiku' }, { status: 500 })
  }
}
