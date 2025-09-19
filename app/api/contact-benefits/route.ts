import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const benefits = await prisma.contactBenefit.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    })
    return NextResponse.json(benefits)
  } catch (error) {
    return NextResponse.json({ error: 'Kļūda ielādējot priekšrocības' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const benefit = await prisma.contactBenefit.create({
      data: {
        text: data.text,
        order: data.order || 0,
        isActive: data.isActive ?? true,
      }
    })
    return NextResponse.json(benefit)
  } catch (error) {
    return NextResponse.json({ error: 'Kļūda izveidojot priekšrocību' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const benefit = await prisma.contactBenefit.update({
      where: { id: data.id },
      data: {
        text: data.text,
        order: data.order,
        isActive: data.isActive,
      }
    })
    return NextResponse.json(benefit)
  } catch (error) {
    return NextResponse.json({ error: 'Kļūda atjauninot priekšrocību' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Nav ID' }, { status: 400 })
    }

    await prisma.contactBenefit.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Kļūda dzēšot priekšrocību' }, { status: 500 })
  }
}