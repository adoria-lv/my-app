import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { deleteFromS3 } from '@/lib/s3-upload'

export async function GET() {
  try {
    const content = await prisma.experienceContent.findFirst({
      where: { isActive: true }
    })

    const response = NextResponse.json(content)
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    response.headers.set('Surrogate-Control', 'no-store')

    return response
  } catch (error) {
    console.error('Error fetching experience content:', error)
    return NextResponse.json({ error: 'Kļūda ielādējot saturu' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const content = await prisma.experienceContent.create({
      data: {
        headerTitle: data.headerTitle,
        headerSubtitle: data.headerSubtitle,
        description: data.description,
        companyName: data.companyName,
        image: data.image,
        rating: data.rating,
        address: data.address,
        email: data.email,
        phone: data.phone,
        isActive: data.isActive ?? true,
      }
    })
    return NextResponse.json(content)
  } catch (error) {
    return NextResponse.json({ error: 'Kļūda izveidojot saturu' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const content = await prisma.experienceContent.update({
      where: { id: data.id },
      data: {
        headerTitle: data.headerTitle,
        headerSubtitle: data.headerSubtitle,
        description: data.description,
        companyName: data.companyName,
        image: data.image,
        rating: data.rating,
        address: data.address,
        email: data.email,
        phone: data.phone,
        isActive: data.isActive,
      }
    })
    return NextResponse.json(content)
  } catch (error) {
    return NextResponse.json({ error: 'Kļūda atjauninot saturu' }, { status: 500 })
  }
}
