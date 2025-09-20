'use client'

import { useState, useEffect } from 'react'
import { useParams, notFound } from 'next/navigation'
import Breadcrumb from '@/app/components/Breadcrumb'
import { Clock, Users, Phone, Calendar, ArrowLeft, Heart, CheckCircle, Euro } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { parseServiceContentWithReadMore } from '@/lib/contentParser'
import AppointmentDialog from '@/app/components/AppointmentDialog'
import ContactForm from '@/app/components/ContactForm'
import FAQBlock from '@/app/components/FAQBlock'
import Gallery from '@/app/components/Gallery'

interface ServiceData {
  id: string
  title: string
  icon: string
  description: string
  href: string
  slug: string
}

interface SubServiceData {
  id: string
  title: string
  description: string
  content?: string
  gallery1?: string
  gallery2?: string
  gallery3?: string
  gallery4?: string
  duration?: string
  price?: string
  slug: string
  isActive: boolean
  service: ServiceData
  subSubServices?: SubSubServiceData[]
}

interface SubSubServiceData {
  id: string
  title: string
  description: string
  duration?: string
  price?: string
  slug: string
  isActive: boolean
}

export default function SubServiceDetailPage() {
  const { slug, subSlug } = useParams()
  const [subService, setSubService] = useState<SubServiceData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (slug && subSlug) {
      // Scroll to top when page loads or parameters change
      window.scrollTo(0, 0)
      fetchSubService()
    }
  }, [slug, subSlug])

  const fetchSubService = async () => {
    try {
      const response = await fetch(`/api/services/${slug}/${subSlug}?includeSubSub=true`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setSubService(data)
      } else if (response.status === 404) {
        notFound()
      }
    } catch (error) {
      console.error('Error fetching sub-service:', error)
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

  if (!subService) {
    return notFound()
  }

  const breadcrumbItems = [
    { label: subService.service.title, href: subService.service.href },
    { label: subService.title }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50/50 overflow-x-hidden">
      {/* Full-width Hero Header */}
      <div className="relative bg-gradient-to-br from-slate-50 via-white to-gray-50/30 border-b border-gray-200/50 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-8 left-4 sm:top-16 sm:left-8 lg:top-20 lg:left-20 w-24 h-24 sm:w-32 sm:h-32 lg:w-80 lg:h-80 bg-gradient-to-br from-[#B7AB96]/10 to-[#706152]/5 rounded-full blur-2xl lg:blur-3xl" />
          <div className="absolute bottom-8 right-4 sm:bottom-10 sm:right-10 lg:bottom-10 lg:right-10 w-32 h-32 sm:w-48 sm:h-48 lg:w-96 lg:h-96 bg-gradient-to-tl from-[#706152]/8 to-[#B7AB96]/6 rounded-full blur-2xl lg:blur-3xl" />
          <div className="absolute top-1/3 right-1/3 w-20 h-20 sm:w-32 sm:h-32 lg:w-64 lg:h-64 bg-[#B7AB96]/4 rounded-full blur-xl lg:blur-2xl" />
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
          {/* Breadcrumb */}
          <div className="mb-6 md:mb-2">
            <div className="inline-block backdrop-blur-sm rounded-lg px-3 py-2 bg-white/90">
              <Breadcrumb items={breadcrumbItems} />
            </div>
          </div>

          {/* Hero Content */}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-8">

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#706152] mb-4 leading-tight">
                {subService.title}
              </h1>

              {/* Description */}
              <p className="text-lg md:text-xl text-[#706152]/80 mb-6 md:mb-8 leading-relaxed max-w-2xl">
                {subService.description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <AppointmentDialog defaultService={subService.title}>
                  <div className="inline-flex items-center justify-center gap-2 sm:gap-3 px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-[#B7AB96] via-[#a59885] to-[#706152] text-white rounded-xl font-bold hover:shadow-xl hover:shadow-[#B7AB96]/30 hover:-translate-y-1 transition-all duration-300 cursor-pointer text-sm md:text-base">
                    <Calendar className="w-5 h-5" />
                    Pieteikt vizīti
                  </div>
                </AppointmentDialog>
                <Link
                  href={subService.service.href}
                  className="inline-flex items-center justify-center gap-2 sm:gap-3 px-6 py-3 md:px-8 md:py-4 bg-white/80 backdrop-blur-sm text-[#706152] rounded-xl font-bold hover:bg-white hover:shadow-lg border border-gray-200/50 hover:border-[#B7AB96]/30 transition-all duration-300 text-sm md:text-base"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Atpakaļ uz {subService.service.title}
                </Link>
              </div>
            </div>

            {/* Service Details Card */}
            <div className="lg:col-span-4">
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 md:p-8 shadow-lg shadow-[#B7AB96]/10 border border-gray-200/50 hover:shadow-xl hover:shadow-[#B7AB96]/15 transition-all duration-500">
                <div className="flex items-center gap-3 mb-6 justify-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#B7AB96] to-[#706152] rounded-xl flex items-center justify-center">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-[#706152]">Pakalpojuma detaļas</h3>
                </div>

                <div className="space-y-4">
                  {subService.duration && (
                    <div className="flex items-center gap-4 p-3 rounded-xl bg-gradient-to-r from-gray-50/50 to-white/30">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#B7AB96]/20 to-[#706152]/10 rounded-xl flex items-center justify-center">
                        <Clock className="w-5 h-5 text-[#B7AB96]" />
                      </div>
                      <div>
                        <div className="text-sm text-[#706152]/70 font-medium">Ilgums</div>
                        <div className="font-bold text-[#706152]">{subService.duration}</div>
                      </div>
                    </div>
                  )}

                  {subService.price && (
                    <div className="flex items-center gap-4 p-3 rounded-xl bg-gradient-to-r from-gray-50/50 to-white/30">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#B7AB96]/20 to-[#706152]/10 rounded-xl flex items-center justify-center">
                        <Euro className="w-5 h-5 text-[#B7AB96]" />
                      </div>
                      <div>
                        <div className="text-sm text-[#706152]/70 font-medium">Cena</div>
                        <div className="font-bold text-[#706152]">{subService.price}</div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4 p-3 rounded-xl bg-gradient-to-r from-gray-50/50 to-white/30">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#B7AB96]/20 to-[#706152]/10 rounded-xl flex items-center justify-center">
                      <Users className="w-5 h-5 text-[#B7AB96]" />
                    </div>
                    <div>
                      <div className="text-sm text-[#706152]/70 font-medium">Pieejamība</div>
                      <div className="font-bold text-[#706152]">Ar iepriekšēju pierakstu</div>
                    </div>
                  </div>
                </div>

                {/* Quick Contact */}
                <div className="mt-6 pt-6 border-t border-gray-200/50">
                  <div className="text-center">
                    <p className="text-sm text-[#706152]/70 mb-3">Nepieciešama konsultācija?</p>
                    <Link
                      href="tel:+37167315000"
                      className="inline-flex items-center gap-2 text-[#B7AB96] hover:text-[#706152] font-medium transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">67 315 000</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1250px] mx-auto px-4 sm:px-6 py-8 sm:py-12">

        {/* Contact Form & Gallery Side by Side */}
        <section className="py-8 md:py-12 bg-gradient-to-br from-slate-50 via-white to-gray-50/30 relative overflow-hidden mb-8 sm:mb-12">
          {/* Background decorations */}
          <div className="absolute inset-0">
            <div className="absolute top-8 left-4 sm:top-16 sm:left-8 lg:top-20 lg:left-20 w-24 h-24 sm:w-32 sm:h-32 lg:w-80 lg:h-80 bg-gradient-to-br from-[#B7AB96]/8 to-[#706152]/5 rounded-full blur-2xl lg:blur-3xl" />
            <div className="absolute bottom-8 right-4 sm:bottom-16 sm:right-8 lg:bottom-20 lg:right-20 w-28 h-28 sm:w-36 sm:h-36 lg:w-96 lg:h-96 bg-gradient-to-tl from-[#706152]/6 to-[#B7AB96]/8 rounded-full blur-2xl lg:blur-3xl" />
            <div className="absolute top-1/3 right-1/4 w-20 h-20 sm:w-24 sm:h-24 lg:w-64 lg:h-64 bg-[#B7AB96]/4 rounded-full blur-xl lg:blur-2xl" />
          </div>

          <div className="max-w-[1250px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 lg:items-start relative">
              {/* Vertical divider - hidden on mobile */}
              <div className="hidden lg:block absolute top-0 left-1/2 transform -translate-x-1/2 h-full w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent"></div>

              {/* Gallery - Left Side */}
              <div className="order-2 lg:order-1 lg:pr-8">
                {(() => {
                  const galleryImages = [
                    ...(subService.gallery1 ? [{
                      id: '1',
                      src: subService.gallery1,
                      alt: `${subService.title} - attēls 1`,
                      title: subService.title
                    }] : []),
                    ...(subService.gallery2 ? [{
                      id: '2',
                      src: subService.gallery2,
                      alt: `${subService.title} - attēls 2`,
                      title: subService.title
                    }] : []),
                    ...(subService.gallery3 ? [{
                      id: '3',
                      src: subService.gallery3,
                      alt: `${subService.title} - attēls 3`,
                      title: subService.title
                    }] : []),
                    ...(subService.gallery4 ? [{
                      id: '4',
                      src: subService.gallery4,
                      alt: `${subService.title} - attēls 4`,
                      title: subService.title
                    }] : [])
                  ].filter(Boolean)

                  return galleryImages.length > 0 ? (
                    <Gallery
                      images={galleryImages}
                      title="Mūsu galerija"
                      className="py-0 bg-transparent"
                    />
                  ) : (
                    <div className="text-center py-8">
                      <div className="section-badge">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm sm:text-base">Galerija</span>
                      </div>
                      <h2 className="section-heading">Mūsu galerija</h2>
                      <div className="mt-6 p-8 bg-[#B7AB96]/5 border-2 border-dashed border-[#B7AB96]/30 rounded-xl">
                        <div className="w-16 h-16 mx-auto mb-4 bg-[#B7AB96]/10 rounded-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-[#B7AB96]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p className="text-[#706152] text-lg font-medium">Nav pievienota bilde</p>
                        <p className="text-[#706152]/70 text-sm mt-1">Šim pakalpojumam vēl nav pievienoti attēli</p>
                      </div>
                    </div>
                  )
                })()}
              </div>

              {/* Contact Form - Right Side */}
              <div className="order-1 lg:order-2 lg:pl-8">
                <ContactForm
                  preselectedService={subService.title}
                  disableServiceSelection={true}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        {subService.content && (
          <div className="sm:bg-white sm:rounded-2xl sm:shadow-lg p-0 sm:p-6 lg:p-8 mb-8 sm:mb-12">
            <div className="max-w-4xl mx-auto">
              <div className="mx-auto subServices-heading"
              >
              {parseServiceContentWithReadMore(subService.content || '')}
              </div>
            </div>
          </div>
        )}

        {/* Sub-Sub-Services */}
        {subService.subSubServices && subService.subSubServices.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12">
            <h2 className="mb-6 sm:mb-8 text-center">
              {subService.title} pakalpojumi
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {subService.subSubServices.map((subSubService) => (
                <Link
                  key={subSubService.id}
                  href={`${subService.service.href}/${subService.slug}/${subSubService.slug}`}
                  className="group bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-lg hover:border-[#B7AB96]/50 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#B7AB96]/20 to-[#706152]/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#B7AB96] group-hover:text-[#706152] transition-colors duration-300" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#706152] mb-1 sm:mb-2 group-hover:text-[#B7AB96] transition-colors duration-300 text-sm sm:text-base">
                        {subSubService.title}
                      </h3>
                      <p className="text-[#706152] opacity-75 text-xs sm:text-sm leading-relaxed line-clamp-2">
                        {subSubService.description}
                      </p>

                      {(subSubService.duration || subSubService.price) && (
                        <div className="flex items-center gap-3 mt-2 sm:mt-3 pt-2 border-t border-gray-100">
                          {subSubService.duration && (
                            <span className="text-xs text-[#B7AB96] bg-[#B7AB96]/10 px-2 py-1 rounded-full">
                              {subSubService.duration}
                            </span>
                          )}
                          {subSubService.price && (
                            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                              {subSubService.price}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <FAQBlock apiEndpoint={`/api/services/${slug}/${subSlug}/faq`} />

        {/* Benefits/Features */}
        <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-4 sm:p-6 lg:p-8 xl:p-12 mb-8 sm:mb-12">
          <h2 className="mb-6 sm:mb-8 text-center">
            Kāpēc izvēlēties mūs?
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-[#706152] mb-1 text-sm sm:text-base">Pieredzējuši speciālisti</h3>
                <p className="text-[#706152] opacity-75 text-xs sm:text-sm">Mūsu komandā ir kvalificēti ārsti ar daudzgadīgu pieredzi</p>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:gap-4">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-[#706152] mb-1 text-sm sm:text-base">Mūsdienīgs aprīkojums</h3>
                <p className="text-[#706152] opacity-75 text-xs sm:text-sm">Izmantojam jaunākās tehnoloģijas un aprīkojumu</p>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:gap-4">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-[#706152] mb-1 text-sm sm:text-base">Individuāla pieeja</h3>
                <p className="text-[#706152] opacity-75 text-xs sm:text-sm">Katram pacientam pielāgota ārstēšanas programma</p>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:gap-4">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-[#706152] mb-1 text-sm sm:text-base">Ērta atrašanās vieta</h3>
                <p className="text-[#706152] opacity-75 text-xs sm:text-sm">Centrs atrodas Rīgas centrā, viegli pieejams</p>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:gap-4">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-[#706152] mb-1 text-sm sm:text-base">Elastīgs grafiks</h3>
                <p className="text-[#706152] opacity-75 text-xs sm:text-sm">Piedāvājam dažādus vizīšu laikus</p>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:gap-4 sm:col-span-2 lg:col-span-1">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-[#706152] mb-1 text-sm sm:text-base">Kvalitatīva aprūpe</h3>
                <p className="text-[#706152] opacity-75 text-xs sm:text-sm">Garantējam augstu pakalpojumu kvalitāti</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-gradient-to-r from-[#B7AB96] via-[#a59885] to-[#706152] rounded-2xl p-6 sm:p-8 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />

          <div className="relative z-10">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Calendar className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>

            <h3 className="mb-2">
              Gatavs pieteikt vizīti?
            </h3>

            <p className="opacity-90 mb-4 sm:mb-6 max-w-md mx-auto text-sm sm:text-base">
              Sazinieties ar mums, lai pieteiktu {subService.title.toLowerCase()} pakalpojumu
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="tel:+37167315000"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#706152] px-4 sm:px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors text-sm sm:text-base"
              >
                <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                Zvanīt: 67 315 000
              </Link>
              <Link
                href={subService.service.href}
                className="inline-flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm text-white border border-white/20 px-4 sm:px-6 py-3 rounded-xl font-bold hover:bg-white/30 transition-colors text-sm sm:text-base"
              >
                <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                Citi {subService.service.title} pakalpojumi
              </Link>
            </div>
          </div>

          <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full blur-xl" />
          <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
        </div>
      </div>
    </div>
  )
}