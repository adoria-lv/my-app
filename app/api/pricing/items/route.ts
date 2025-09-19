import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const servicePricingId = searchParams.get('servicePricingId')

    if (!servicePricingId) {
      return NextResponse.json({ error: 'Nav servicePricingId' }, { status: 400 })
    }

    const pricingItems = await prisma.pricingItem.findMany({
      where: {
        servicePricingId: servicePricingId,
        isActive: true
      },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(pricingItems)
  } catch (error) {
    console.error('Pricing items fetch error:', error)
    return NextResponse.json({ error: 'Kļūda ielādējot cenu pozīcijas' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const pricingItem = await prisma.pricingItem.create({
      data: {
        servicePricingId: data.servicePricingId,
        serviceName: data.serviceName,
        price: data.price,
        description: data.description,
        order: data.order || 0,
        isActive: data.isActive ?? true,
      }
    })

    return NextResponse.json(pricingItem)
  } catch (error) {
    console.error('Pricing item creation error:', error)
    return NextResponse.json({ error: 'Kļūda izveidojot cenu pozīciju' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()

    const pricingItem = await prisma.pricingItem.update({
      where: { id: data.id },
      data: {
        serviceName: data.serviceName,
        price: data.price,
        description: data.description,
        order: data.order,
        isActive: data.isActive,
      }
    })

    return NextResponse.json(pricingItem)
  } catch (error) {
    console.error('Pricing item update error:', error)
    return NextResponse.json({ error: 'Kļūda atjauninot cenu pozīciju' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Nav ID' }, { status: 400 })
    }

    await prisma.pricingItem.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Pricing item deletion error:', error)
    return NextResponse.json({ error: 'Kļūda dzēšot cenu pozīciju' }, { status: 500 })
  }
}