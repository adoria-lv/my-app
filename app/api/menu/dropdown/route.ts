import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// POST - Create new MainMenuDropdown item
export async function POST(request: Request) {
  try {
    const data = await request.json()

    if (!data.menuId) {
      return NextResponse.json(
        { error: 'Menu ID is required' },
        { status: 400 }
      )
    }

    const dropdownItem = await prisma.mainMenuDropdown.create({
      data: {
        label: data.label,
        href: data.href,
        iconPath: data.iconPath || null,
        order: data.order || 0,
        isActive: data.isActive ?? true,
        menuId: data.menuId,
      },
    })

    return NextResponse.json(dropdownItem)
  } catch (error) {
    console.error('Error creating dropdown item:', error)
    return NextResponse.json(
      { error: 'Failed to create dropdown item' },
      { status: 500 }
    )
  }
}

// PUT - Update existing MainMenuDropdown item
export async function PUT(request: Request) {
  try {
    const data = await request.json()

    if (!data.id) {
      return NextResponse.json(
        { error: 'Dropdown item ID is required' },
        { status: 400 }
      )
    }

    const dropdownItem = await prisma.mainMenuDropdown.update({
      where: { id: data.id },
      data: {
        label: data.label,
        href: data.href,
        iconPath: data.iconPath || null,
        order: data.order || 0,
        isActive: data.isActive ?? true,
      },
    })

    return NextResponse.json(dropdownItem)
  } catch (error) {
    console.error('Error updating dropdown item:', error)
    return NextResponse.json(
      { error: 'Failed to update dropdown item' },
      { status: 500 }
    )
  }
}

// DELETE - Delete MainMenuDropdown item
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Dropdown item ID is required' },
        { status: 400 }
      )
    }

    await prisma.mainMenuDropdown.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting dropdown item:', error)
    return NextResponse.json(
      { error: 'Failed to delete dropdown item' },
      { status: 500 }
    )
  }
}