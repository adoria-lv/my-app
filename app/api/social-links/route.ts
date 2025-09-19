import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const socialLinks = await prisma.socialLink.findMany({
      orderBy: { order: 'asc' }
    })
    return NextResponse.json(socialLinks)
  } catch (error) {
    return NextResponse.json({ error: 'Kļūda ielādējot sociālās saites' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const socialLink = await prisma.socialLink.create({
      data: {
        name: data.name,
        href: data.href,
        icon: data.icon,
        order: data.order,
        isActive: data.isActive ?? true,
      }
    })
    return NextResponse.json(socialLink)
  } catch (error) {
    console.error('Social link creation error:', error)
    return NextResponse.json({ error: 'Kļūda izveidojot sociālo saiti' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()

    const socialLink = await prisma.socialLink.update({
      where: { id: data.id },
      data: {
        name: data.name,
        href: data.href,
        icon: data.icon,
        order: data.order,
        isActive: data.isActive,
      }
    })
    return NextResponse.json(socialLink)
  } catch (error) {
    console.error('Social link update error:', error)
    return NextResponse.json({ error: 'Kļūda atjauninot sociālo saiti' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Nav ID' }, { status: 400 })
    }

    await prisma.socialLink.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Social link deletion error:', error)
    return NextResponse.json({ error: 'Kļūda dzēšot sociālo saiti' }, { status: 500 })
  }
}