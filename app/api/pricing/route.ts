import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const serviceId = searchParams.get('serviceId')

    if (serviceId) {
      // Get pricing for specific service
      const servicePricing = await prisma.servicePricing.findMany({
        where: {
          serviceId: serviceId,
          isActive: true
        },
        include: {
          pricingItems: {
            where: { isActive: true },
            orderBy: { order: 'asc' }
          },
          service: {
            select: {
              title: true,
              href: true
            }
          }
        },
        orderBy: { order: 'asc' }
      })
      return NextResponse.json(servicePricing)
    } else {
      // Get all pricing with services
      const allPricing = await prisma.servicePricing.findMany({
        where: { isActive: true },
        include: {
          pricingItems: {
            where: { isActive: true },
            orderBy: { order: 'asc' }
          },
          service: {
            select: {
              title: true,
              href: true
            }
          }
        },
        orderBy: { order: 'asc' }
      })
      return NextResponse.json(allPricing)
    }
  } catch (error) {
    console.error('Pricing fetch error:', error)
    return NextResponse.json({ error: 'Kļūda ielādējot cenas' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const servicePricing = await prisma.servicePricing.create({
      data: {
        serviceId: data.serviceId,
        title: data.title,
        order: data.order || 0,
        isActive: data.isActive ?? true,
      },
      include: {
        pricingItems: true,
        service: {
          select: {
            title: true,
            href: true
          }
        }
      }
    })

    return NextResponse.json(servicePricing)
  } catch (error) {
    console.error('Service pricing creation error:', error)
    return NextResponse.json({ error: 'Kļūda izveidojot cenrādi' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()

    const servicePricing = await prisma.servicePricing.update({
      where: { id: data.id },
      data: {
        title: data.title,
        order: data.order,
        isActive: data.isActive,
      },
      include: {
        pricingItems: {
          where: { isActive: true },
          orderBy: { order: 'asc' }
        },
        service: {
          select: {
            title: true,
            href: true
          }
        }
      }
    })

    return NextResponse.json(servicePricing)
  } catch (error) {
    console.error('Service pricing update error:', error)
    return NextResponse.json({ error: 'Kļūda atjauninot cenrādi' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Nav ID' }, { status: 400 })
    }

    await prisma.servicePricing.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Service pricing deletion error:', error)
    return NextResponse.json({ error: 'Kļūda dzēšot cenrādi' }, { status: 500 })
  }
}