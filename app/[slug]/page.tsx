// Modificētā service detail page
'use client'

import { useState, useEffect } from 'react'
import { useParams, notFound } from 'next/navigation'
import { clsx } from 'clsx'
import Breadcrumb from '@/app/components/Breadcrumb'
import { ArrowRight, Clock, Users, Award, Heart, Stethoscope, Calendar, Phone } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import PricingSection from '@/app/components/PricingSection'
import Footer from '@/app/components/Footer'
import AppointmentDialog from '@/app/components/AppointmentDialog'
import { parseServiceContentWithReadMore } from '@/lib/contentParser'
import FAQBlock from '@/app/components/FAQBlock'

interface ServiceData {
  id: string
  title: string
  icon: string
  backgroundImage?: string
  titleColor?: string
  description: string
  content?: string
  href: string
  order: number
  isActive: boolean
  subServices?: SubService[]
}

interface SubService {
  id: string
  title: string
  description: string
  duration?: string
  price?: string
  slug: string
  isActive: boolean
}

export default function ServiceDetailPage() {
  const { slug } = useParams()
  const [service, setService] = useState<ServiceData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (slug) {
      // Scroll to top when page loads or parameters change
      window.scrollTo(0, 0)
      fetchService()
    }
  }, [slug])

  const fetchService = async () => {
    try {
      const response = await fetch(`/api/services/${slug}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setService(data)
      } else if (response.status === 404) {
        notFound()
      }
    } catch (error) {
      console.error('Error fetching service:', error)
      notFound()
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50/50 overflow-x-hidden">
        <div className="max-w-[1250px] mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#B7AB96]/30 border-t-[#B7AB96]"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!service) {
    return notFound()
  }

  const breadcrumbItems = [
    { label: service.title }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50/50 overflow-x-hidden max-w-full">
      {/* Header Section */}
      <div
          className={`p-6 sm:p-8 lg:p-20 shadow-md shadow-[#B7AB96]/10 relative overflow-hidden mb-6 md:mb-8 h-[500px] ${
            service.backgroundImage
              ? 'bg-cover bg-center'
              : 'bg-gradient-to-br from-[#B7AB96] via-[#9d9583] to-[#8b8371]'
          } ${service.titleColor === 'dark' ? 'text-[#706152]' : 'text-white'}`}
          style={service.backgroundImage ? { backgroundImage: `url('${service.backgroundImage}')` } : {}}
        >
          {/* Overlay for better readability - only when needed */}
          {service.backgroundImage && service.titleColor !== 'dark' && (
            <div className="absolute inset-0 bg-black/40"></div>
          )}

          <div className="relative z-10 max-w-[1440px] mx-auto">
          <div className="relative z-10 mb-6 md:mb-8">
            <div className={`inline-block backdrop-blur-sm rounded-lg px-3 py-2 ${
              service.titleColor === 'dark'
                ? 'bg-white/90'
                : 'bg-white/90'
            }`}>
              <Breadcrumb items={breadcrumbItems} />
            </div>
          </div>
            <div className="flex items-center gap-2 mb-2 md:mb-3">
              <div className={`w-8 h-8 md:w-10 md:h-10 backdrop-blur-sm rounded-lg flex items-center justify-center ${
                service.titleColor === 'dark'
                  ? 'bg-[#706152]/20'
                  : 'bg-white/20'
              }`}>
                <Image
                  src={service.icon}
                  alt={service.title}
                  width={32}
                  height={32}
                  className={`w-4 h-4 md:w-5 md:h-5 ${
                    service.titleColor === 'dark'
                      ? 'brightness-0'
                      : 'brightness-0 invert'
                  }`}
                />
              </div>
              <div className={`px-3 py-1.5 backdrop-blur-sm rounded-lg ${
                service.titleColor === 'dark'
                  ? 'bg-[#706152]/20'
                  : 'bg-white/20'
              }`}>
                <span className="text-xs md:text-sm font-medium">Pakalpojums</span>
              </div>
            </div>

            <h1 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 leading-tight ${
              service.titleColor === 'dark' ? '!text-[#706152]' : 'services-heading'
            }`}>
              {service.title}
            </h1>

            <p className={`text-base md:text-lg opacity-90 mb-4 md:mb-6 leading-relaxed max-w-2xl ${
              service.titleColor === 'dark' ? 'text-[#706152]' : 'text-white'
            }`}>
              {service.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <AppointmentDialog defaultService={service?.title}>
                <button
                  className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-bold transition-all duration-300 text-sm ${
                    service.titleColor === 'dark'
                      ? 'bg-[#706152] text-white hover:bg-[#5f5449]'
                      : 'bg-white text-[#706152] hover:bg-gray-50'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  Pieteikt vizīti
                </button>
              </AppointmentDialog>
              <Link
                href="tel:+37167315000"
                className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 backdrop-blur-sm rounded-lg font-bold transition-all duration-300 text-sm ${
                  service.titleColor === 'dark'
                    ? 'bg-[#706152]/20 hover:bg-[#706152]/30'
                    : 'bg-white/20 hover:bg-white/30'
                }`}
              >
                <Phone className="w-4 h-4" />
                Zvanīt tagad
              </Link>
            </div>
          </div>
        </div>

      <div className="max-w-[1250px] mx-auto px-4 py-6 md:py-8">
        {/* Content Section with ID for scrolling */}
        {service.content && (
          <div 
            id="service-content" 
            className="sm:bg-white sm:rounded-xl md:sm:rounded-2xl sm:shadow-md p-0 sm:p-6 md:sm:p-8 lg:sm:p-10 mb-8 md:mb-10"
          >
            <div className="prose prose-lg max-w-none">
              <div className="text-[#706152] leading-relaxed">
                {parseServiceContentWithReadMore(service.content)}
              </div>
            </div>
          </div>
        )}

        {/* Sub Services Section */}
        {service.subServices && service.subServices.length > 0 && (
          <div id="services">
            <div className="text-center mb-6 md:mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#B7AB96]/10 text-[#706152] font-medium text-sm mb-4">
                <Heart size={16} />
                Pieejamie pakalpojumi
              </div>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#706152] mb-3 md:mb-4 leading-tight">
                {service.title} pakalpojumi
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-10">
              {service.subServices.map((subService, index) => (
                <Link
                  key={subService.id}
                  href={`${service.href}/${subService.slug}`}
                  className="group"
                >
                  <div className="bg-white rounded-xl p-4 md:p-5 border border-gray-100 hover:shadow-lg hover:shadow-[#B7AB96]/10 transition-all duration-300 md:hover:-translate-y-1 hover:border-[#B7AB96]/20 relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#B7AB96]/5 rounded-full blur-xl group-hover:bg-[#B7AB96]/10 transition-all duration-300" />

                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#B7AB96] to-[#9d9583] rounded-lg md:rounded-xl flex items-center justify-center md:group-hover:scale-110 transition-all duration-300">
                          <Stethoscope className="w-5 h-5 md:w-6 md:h-6 text-white" />
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#B7AB96] group-hover:translate-x-1 transition-all duration-300" />
                      </div>

                      <h3 className="text-base md:text-lg font-bold text-[#706152] mb-2 group-hover:text-[#B7AB96] transition-colors">
                        {subService.title}
                      </h3>

                      <p className="text-[#706152] opacity-75 text-xs md:text-sm mb-3 md:mb-4 leading-relaxed">
                        {subService.description}
                      </p>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        {subService.duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {subService.duration}
                          </div>
                        )}
                        {subService.price && (
                          <div className="font-semibold text-[#B7AB96]">
                            {subService.price}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Pricing Section */}
        <PricingSection serviceId={service.id} className="mb-8 md:mb-10" />

        {/* FAQ Section */}
        <FAQBlock apiEndpoint={`/api/services/${slug}/faq`} />

        {/* Contact CTA */}
        <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl md:rounded-2xl p-6 md:p-8 border border-gray-200 text-center">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-[#B7AB96] rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
            <Users className="w-6 h-6 md:w-8 md:h-8 text-white" />
          </div>

          <h3 className="text-lg md:text-xl font-bold text-[#706152] mb-2">
            Nepieciešama konsultācija?
          </h3>

          <p className="text-sm md:text-base text-[#706152] opacity-75 mb-4 md:mb-6 max-w-md mx-auto">
            Sazinieties ar mums, lai uzzinātu vairāk par pakalpojumu un pieteiktu vizīti
          </p>

          <div className="flex flex-col sm:flex-row gap-2 md:gap-3 justify-center">
            <Link
              href="tel:+37167315000"
              className="inline-flex items-center gap-2 bg-[#B7AB96] hover:bg-[#a59885] text-white px-4 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl transition-colors font-medium text-sm md:text-base"
            >
              <Phone className="w-5 h-5" />
              Zvanīt: 67 315 000
            </Link>
            <Link
              href="/pakalpojumi"
              className="inline-flex items-center gap-2 border border-[#B7AB96] text-[#B7AB96] hover:bg-[#B7AB96] hover:text-white px-4 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl transition-all font-medium text-sm md:text-base"
            >
              <ArrowRight className="w-5 h-5" />
              Visi pakalpojumi
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
