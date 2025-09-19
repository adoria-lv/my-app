import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [
      servicesCount,
      subServicesCount,
      subSubServicesCount,
      blogPostsCount,
      serviceFaqsCount,
      subServiceFaqsCount,
      subSubServiceFaqsCount,
      appointmentsCount
    ] = await Promise.all([
      prisma.service.count({ where: { isActive: true } }),
      prisma.subService.count({ where: { isActive: true } }),
      prisma.subSubService.count({ where: { isActive: true } }),
      prisma.blogPost.count({ where: { published: true } }),
      prisma.serviceFAQ.count({ where: { isActive: true } }),
      prisma.subServiceFAQ.count({ where: { isActive: true } }),
      prisma.subSubServiceFAQ.count({ where: { isActive: true } }),
      prisma.appointment.count()
    ])

    const totalFaqs = serviceFaqsCount + subServiceFaqsCount + subSubServiceFaqsCount

    const stats = {
      services: servicesCount,
      subServices: subServicesCount,
      subSubServices: subSubServicesCount,
      blogPosts: blogPostsCount,
      faqs: totalFaqs,
      appointments: appointmentsCount,
      recentAppointments: 0 // Will be calculated in recent appointments endpoint
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json({ error: 'Kļūda ielādējot statistiku' }, { status: 500 })
  }
}