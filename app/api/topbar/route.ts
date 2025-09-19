import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Fetch TopBar data
export async function GET() {
  try {
    const topbar = await prisma.topBar.findFirst()

    if (!topbar) {
      // Return default values if no data exists
      return NextResponse.json({
        id: '',
        email: 'adoria@adoria.lv',
        address: 'A. Čaka iela 70-3, Rīga',
        hours: 'P. - C. 08:00 - 19:00 / Pk., S. 10:00 - 17:00',
        instagram: '',
        facebook: '',
        whatsapp: '',
        twitter: '',
        showInstagram: true,
        showFacebook: true,
        showWhatsapp: true,
        showTwitter: true
      })
    }

    return NextResponse.json(topbar)
  } catch (error) {
    console.error('Error fetching TopBar data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch TopBar data' },
      { status: 500 }
    )
  }
}

// POST - Create new TopBar data
export async function POST(request: Request) {
  try {

    const data = await request.json()

    // Delete existing record if any (we only want one TopBar record)
    await prisma.topBar.deleteMany()

    const topbar = await prisma.topBar.create({
      data: {
        email: data.email,
        address: data.address,
        hours: data.hours,
        instagram: data.instagram || null,
        facebook: data.facebook || null,
        whatsapp: data.whatsapp || null,
        twitter: data.twitter || null,
        showInstagram: data.showInstagram ?? true,
        showFacebook: data.showFacebook ?? true,
        showWhatsapp: data.showWhatsapp ?? true,
        showTwitter: data.showTwitter ?? true,
      },
    })

    return NextResponse.json(topbar)
  } catch (error) {
    console.error('Error creating TopBar data:', error)
    return NextResponse.json(
      { error: 'Failed to create TopBar data' },
      { status: 500 }
    )
  }
}

// PUT - Update existing TopBar data
export async function PUT(request: Request) {
  try {

    const data = await request.json()

    // Find the existing record
    let topbar = await prisma.topBar.findFirst()

    if (!topbar) {
      // If no record exists, create one
      topbar = await prisma.topBar.create({
        data: {
          email: data.email,
          address: data.address,
          hours: data.hours,
          instagram: data.instagram || null,
          facebook: data.facebook || null,
          whatsapp: data.whatsapp || null,
          twitter: data.twitter || null,
          showInstagram: data.showInstagram ?? true,
          showFacebook: data.showFacebook ?? true,
          showWhatsapp: data.showWhatsapp ?? true,
          showTwitter: data.showTwitter ?? true,
        },
      })
    } else {
      // Update existing record
      topbar = await prisma.topBar.update({
        where: { id: topbar.id },
        data: {
          email: data.email,
          address: data.address,
          hours: data.hours,
          instagram: data.instagram || null,
          facebook: data.facebook || null,
          whatsapp: data.whatsapp || null,
          twitter: data.twitter || null,
          showInstagram: data.showInstagram ?? true,
          showFacebook: data.showFacebook ?? true,
          showWhatsapp: data.showWhatsapp ?? true,
          showTwitter: data.showTwitter ?? true,
        },
      })
    }

    return NextResponse.json(topbar)
  } catch (error) {
    console.error('Error updating TopBar data:', error)
    return NextResponse.json(
      { error: 'Failed to update TopBar data' },
      { status: 500 }
    )
  }
}