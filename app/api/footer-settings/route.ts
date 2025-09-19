import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const settings = await prisma.footerSettings.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(settings)
  } catch (error) {
    return NextResponse.json({ error: 'Kļūda ielādējot Footer iestatījumus' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const settings = await prisma.footerSettings.create({
      data: {
        logoPath: data.logoPath,
        companyDescription: data.companyDescription,
        phone: data.phone,
        email: data.email,
        address: data.address,
        showServices: data.showServices ?? true,
        isActive: data.isActive ?? true,
      }
    })
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Footer settings creation error:', error)
    return NextResponse.json({ error: 'Kļūda izveidojot Footer iestatījumus' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()

    const settings = await prisma.footerSettings.update({
      where: { id: data.id },
      data: {
        logoPath: data.logoPath,
        companyDescription: data.companyDescription,
        phone: data.phone,
        email: data.email,
        address: data.address,
        showServices: data.showServices,
        isActive: data.isActive,
      }
    })
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Footer settings update error:', error)
    return NextResponse.json({ error: 'Kļūda atjauninot Footer iestatījumus' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Nav ID' }, { status: 400 })
    }

    await prisma.footerSettings.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Footer settings deletion error:', error)
    return NextResponse.json({ error: 'Kļūda dzēšot Footer iestatījumus' }, { status: 500 })
  }
}