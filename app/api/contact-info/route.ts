import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const contactInfo = await prisma.contactInfo.findFirst({
      where: { isActive: true }
    })
    return NextResponse.json(contactInfo)
  } catch (error) {
    return NextResponse.json({ error: 'Kļūda ielādējot kontaktu informāciju' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const contactInfo = await prisma.contactInfo.create({
      data: {
        phone: data.phone,
        email: data.email,
        address: data.address,
        isActive: data.isActive ?? true,
      }
    })
    return NextResponse.json(contactInfo)
  } catch (error) {
    return NextResponse.json({ error: 'Kļūda izveidojot kontaktu informāciju' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const contactInfo = await prisma.contactInfo.update({
      where: { id: data.id },
      data: {
        phone: data.phone,
        email: data.email,
        address: data.address,
        isActive: data.isActive,
      }
    })
    return NextResponse.json(contactInfo)
  } catch (error) {
    return NextResponse.json({ error: 'Kļūda atjauninot kontaktu informāciju' }, { status: 500 })
  }
}