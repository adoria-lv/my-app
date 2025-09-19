import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const recentAppointments = await prisma.appointment.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        name: true,
        service: true,
        date: true,
        time: true,
        status: true,
        createdAt: true
      }
    })

    return NextResponse.json(recentAppointments)
  } catch (error) {
    console.error('Error fetching recent appointments:', error)
    return NextResponse.json({ error: 'Kļūda ielādējot jaunākos pierakstus' }, { status: 500 })
  }
}