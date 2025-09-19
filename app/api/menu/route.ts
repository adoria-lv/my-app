import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Fetch MainMenu items
export async function GET() {
  try {
    const menuItems = await prisma.mainMenu.findMany({
      include: {
        dropdowns: {
          where: { isActive: true },
          orderBy: { order: 'asc' }
        }
      },
      where: { isActive: true },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(menuItems)
  } catch (error) {
    console.error('Error fetching menu items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch menu items' },
      { status: 500 }
    )
  }
}

// POST - Create new MainMenu item
export async function POST(request: Request) {
  try {

    const data = await request.json()

    const menuItem = await prisma.mainMenu.create({
      data: {
        label: data.label,
        href: data.href || null,
        iconPath: data.iconPath || null,
        order: data.order || 0,
        isActive: data.isActive ?? true,
      },
      include: {
        dropdowns: true
      }
    })

    return NextResponse.json(menuItem)
  } catch (error) {
    console.error('Error creating menu item:', error)
    return NextResponse.json(
      { error: 'Failed to create menu item' },
      { status: 500 }
    )
  }
}

// PUT - Update existing MainMenu item
export async function PUT(request: Request) {
  try {

    const data = await request.json()

    if (!data.id) {
      return NextResponse.json(
        { error: 'Menu item ID is required' },
        { status: 400 }
      )
    }

    const menuItem = await prisma.mainMenu.update({
      where: { id: data.id },
      data: {
        label: data.label,
        href: data.href || null,
        iconPath: data.iconPath || null,
        order: data.order || 0,
        isActive: data.isActive ?? true,
      },
      include: {
        dropdowns: true
      }
    })

    return NextResponse.json(menuItem)
  } catch (error) {
    console.error('Error updating menu item:', error)
    return NextResponse.json(
      { error: 'Failed to update menu item' },
      { status: 500 }
    )
  }
}

// DELETE - Delete MainMenu item
export async function DELETE(request: Request) {
  try {

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Menu item ID is required' },
        { status: 400 }
      )
    }

    await prisma.mainMenu.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting menu item:', error)
    return NextResponse.json(
      { error: 'Failed to delete menu item' },
      { status: 500 }
    )
  }
}