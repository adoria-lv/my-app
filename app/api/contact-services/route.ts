import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const services = await prisma.contactService.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    })
    return NextResponse.json(services)
  } catch (error) {
    return NextResponse.json({ error: 'Kļūda ielādējot pakalpojumus' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const service = await prisma.contactService.create({
      data: {
        name: data.name,
        order: data.order || 0,
        isActive: data.isActive ?? true,
      }
    })
    return NextResponse.json(service)
  } catch (error) {
    return NextResponse.json({ error: 'Kļūda izveidojot pakalpojumu' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const service = await prisma.contactService.update({
      where: { id: data.id },
      data: {
        name: data.name,
        order: data.order,
        isActive: data.isActive,
      }
    })
    return NextResponse.json(service)
  } catch (error) {
    return NextResponse.json({ error: 'Kļūda atjauninot pakalpojumu' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Nav ID' }, { status: 400 })
    }

    await prisma.contactService.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Kļūda dzēšot pakalpojumu' }, { status: 500 })
  }
}